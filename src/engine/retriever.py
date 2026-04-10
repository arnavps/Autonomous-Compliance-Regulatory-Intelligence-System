import os
import pickle
import logging
from typing import List, Dict, Any, Optional

from langchain_chroma import Chroma
from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document
from src.utils.llm_config import get_embeddings

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
CHROMA_PATH = os.path.join(os.getcwd(), 'data', 'chroma_db')
BM25_PATH = os.path.join(os.getcwd(), 'data', 'bm25_index.pkl')

class VectorEngine:
    def __init__(self, collection_name: str = "regintel_semantic"):
        """Initialize the retrieval engine with semantic and keyword layers."""
        self.embeddings = get_embeddings()
        self.collection_name = collection_name
        self.chroma_path = os.path.join(os.getcwd(), 'data', f'chroma_{collection_name}')
        self.bm25_path = os.path.join(os.getcwd(), 'data', f'bm25_{collection_name}.pkl')
        
        self.vector_store = Chroma(
            persist_directory=self.chroma_path,
            embedding_function=self.embeddings,
            collection_name=collection_name
        )
        self.bm25_retriever = self._load_bm25()

    def _load_bm25(self) -> Optional[BM25Retriever]:
        """Load the BM25 index from disk if it exists."""
        if os.path.exists(self.bm25_path):
            try:
                with open(self.bm25_path, 'rb') as f:
                    return pickle.load(f)
            except Exception as e:
                logger.error(f"Failed to load BM25 index for {self.collection_name}: {e}")
        return None


    def _save_bm25(self, retriever: BM25Retriever):
        """Save the BM25 index to disk."""
        os.makedirs(os.path.dirname(self.bm25_path), exist_ok=True)
        with open(self.bm25_path, 'wb') as f:
            pickle.dump(retriever, f)


    def add_documents(self, documents: List[Document]):
        """Add documents to both semantic and keyword indices."""
        if not documents:
            return

        logger.info(f"Adding {len(documents)} documents to VectorEngine...")
        
        # 1. Update Semantic Index (Chroma)
        self.vector_store.add_documents(documents)
        
        # 2. Update/Rebuild BM25 Index
        # Note: LangChain's BM25Retriever is usually rebuilt as it's not natively incremental
        # For the hackathon, we rebuild from all docs if we have few, or just the new ones.
        # Ideally, we should fetch all docs from Chroma and rebuild the BM25 index.
        all_docs = self.vector_store.get()
        # Convert Chroma results back to Documents for BM25
        # all_docs['documents'] contains strings, all_docs['metadatas'] contains metadata
        corpus_docs = [
            Document(page_content=text, metadata=meta) 
            for text, meta in zip(all_docs['documents'], all_docs['metadatas'])
        ]
        
        self.bm25_retriever = BM25Retriever.from_documents(corpus_docs)
        self._save_bm25(self.bm25_retriever)
        logger.info("VectorEngine indices updated and persisted.")

    def _reciprocal_rank_fusion(self, semantic_results: List[Document], keyword_results: List[Document], k: int = 60) -> List[Document]:
        """
        Merge two ranked lists using Reciprocal Rank Fusion (RRF).
        Score(d) = sum(1 / (k + rank(d)))
        """
        fused_scores = {}
        
        # Process semantic results
        for rank, doc in enumerate(semantic_results):
            doc_id = doc.metadata.get("circular_id", "") + "_" + str(doc.metadata.get("chunk_index", rank))
            if doc_id not in fused_scores:
                fused_scores[doc_id] = {"score": 0.0, "doc": doc}
            fused_scores[doc_id]["score"] += 1.0 / (k + rank + 1)
            
        # Process keyword results
        for rank, doc in enumerate(keyword_results):
            doc_id = doc.metadata.get("circular_id", "") + "_" + str(doc.metadata.get("chunk_index", rank))
            if doc_id not in fused_scores:
                fused_scores[doc_id] = {"score": 0.0, "doc": doc}
            fused_scores[doc_id]["score"] += 1.0 / (k + rank + 1)
            
        # Sort by fused score
        sorted_docs = sorted(fused_scores.values(), key=lambda x: x["score"], reverse=True)
        return [item["doc"] for item in sorted_docs]

    def retrieve_context(self, query: str, top_k: int = 8) -> List[Document]:
        """Perform hybrid search and return fused results."""
        logger.info(f"Retrieving context for query: {query}")
        
        # 1. Semantic Search
        semantic_results = self.vector_store.similarity_search(query, k=top_k * 2)
        
        # 2. Keyword Search (BM25)
        keyword_results = []
        if self.bm25_retriever:
            self.bm25_retriever.k = top_k * 2
            keyword_results = self.bm25_retriever.invoke(query)

        
        # 3. Apply RRF
        fused_results = self._reciprocal_rank_fusion(semantic_results, keyword_results)
        
        # Return top_k
        final_docs = fused_results[:top_k]
        logger.info(f"Retrieved {len(final_docs)} chunks using Hybrid Search (RRF).")
        return final_docs

if __name__ == "__main__":
    # Smoke test
    engine = VectorEngine()
    print("VectorEngine initialized.")
    # test retrieval if index exists
    if engine.bm25_retriever:
        results = engine.retrieve_context("KYC requirements")
        for i, res in enumerate(results):
            print(f"[{i}] {res.metadata.get('circular_id')}: {res.page_content[:100]}...")