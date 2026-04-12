import sys
import os
sys.path.append(os.getcwd())

from langchain_core.documents import Document
from src.engine.retriever import VectorEngine
import logging

# Configure logging to see the RRF process
logging.basicConfig(level=logging.INFO)

def test_vector_engine():
    engine = VectorEngine()
    
    # 1. Create sample documents
    docs = [
        Document(
            page_content="RBI Master Direction on KYC (2023). Section 12 states that banks must verify customer identity using V-CIP.",
            metadata={"circular_id": "RBI/2023/001", "chunk_index": 0}
        ),
        Document(
            page_content="SEBI circular on KRA (2022). Section 12(3)(b) requires in-person verification for demat accounts.",
            metadata={"circular_id": "SEBI/2022/045", "chunk_index": 0}
        ),
        Document(
            page_content="Digital Lending Guidelines. Interest rates should be calculated on a reducing balance basis.",
            metadata={"circular_id": "RBI/2022/098", "chunk_index": 0}
        )
    ]
    
    # 2. Add documents to engine
    print("\n--- Adding Documents ---")
    engine.add_documents(docs)
    
    # 3. Test Semantic Search
    print("\n--- Testing Semantic Search ('how to verify identity') ---")
    results = engine.retrieve_context("how to verify identity", top_k=2)
    for i, res in enumerate(results):
        print(f"[{i}] {res.metadata['circular_id']}: {res.page_content}")
        
    # 4. Test Keyword Search
    print("\n--- Testing Keyword Search ('Section 12(3)(b)') ---")
    results = engine.retrieve_context("Section 12(3)(b)", top_k=1)
    for i, res in enumerate(results):
        print(f"[{i}] {res.metadata['circular_id']}: {res.page_content}")

if __name__ == "__main__":
    test_vector_engine()
