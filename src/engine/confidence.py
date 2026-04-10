import numpy as np
import logging
import json
from typing import List, Dict, Any, Tuple
from sentence_transformers import CrossEncoder
from langchain_core.documents import Document

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ConfidenceScorer:
    def __init__(self):
        """Initialize models for re-ranking and faithfulness scoring."""
        logger.info("Initializing ConfidenceScorer models (CPU mode)...")
        # For Signal 2: Relevance Score
        self.relevance_model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2', device='cpu')
        # For Signal 3: Faithfulness Gate (NLI)
        self.faithfulness_model = CrossEncoder('cross-encoder/nli-deberta-v3-small', device='cpu')

    def _sigmoid(self, x: float) -> float:
        """Normalize Cross-Encoder raw scores to [0, 1]."""
        return 1 / (1 + np.exp(-x))

    def compute_confidence(
        self, 
        query: str, 
        retrieved_docs: List[Document], 
        generated_answer: str,
        query_embedding: np.ndarray,
        doc_embeddings: List[np.ndarray]
    ) -> Dict[str, Any]:
        """
        Calculate a multi-signal confidence score.
        1. Semantic Retrieval (40%)
        2. Cross-Encoder Re-ranking (35%)
        3. NLI Faithfulness (25%)
        """
        
        # Signal 1: Semantic Retrieval Score (40%)
        # Calculate cosine similarity for top-3 chunks
        similarities = []
        for doc_emb in doc_embeddings[:3]:
            # Normalize embeddings to handle potential unit vector mismatches
            cos_sim = np.dot(query_embedding, doc_emb) / (np.linalg.norm(query_embedding) * np.linalg.norm(doc_emb))
            similarities.append(max(0, cos_sim))
        s1_score = np.mean(similarities) if similarities else 0.0
        
        # Signal 2: Cross-Encoder Re-ranking (35%)
        # Score the answer's specific relevance to the query
        relevance_raw = self.relevance_model.predict([(query, generated_answer)])[0]
        s2_score = self._sigmoid(relevance_raw)
        
        # Signal 3: NLI Faithfulness (25%)
        # Check if the answer (hypothesis) is grounded in the context (premise)
        context_text = " ".join([doc.page_content for doc in retrieved_docs[:3]])
        nli_scores = self.faithfulness_model.predict([(context_text, generated_answer)])[0]
        # Label mapping for 'cross-encoder/nli-deberta-v3-small': Usually 0: Contradiction, 1: Entailment, 2: Neutral
        # We want high score for Entailment
        entailment_score = nli_scores[1]  # Index 1 is often entailment for this model
        s3_score = max(0, entailment_score) # NLI scores can be normalized or raw
        
        # Total Weighted Score
        total_score = (s1_score * 0.40) + (s2_score * 0.35) + (s3_score * 0.25)
        total_percentage = total_score * 100
        
        # Determine Status
        status = "OK" if total_percentage >= 65 else "LOW_CONFIDENCE"
        
        # Generate Note
        if total_percentage >= 85:
            note = "High confidence: Answer is explicitly supported by regulatory text."
        elif total_percentage >= 65:
            note = "Sufficient confidence: Answer is inferred accurately from context."
        else:
            note = "Low confidence: Answer may contain hallucinations; proximity to context is weak."
            
        return {
            "score": round(total_percentage, 2),
            "status": status,
            "confidence_note": note,
            "signals": {
                "retrieval": round(s1_score, 4),
                "relevance": round(s2_score, 4),
                "faithfulness": round(s3_score, 4)
            }
        }

class ConfidenceGate:
    def __init__(self, scorer: ConfidenceScorer):
        self.scorer = scorer

    def validate_and_return(
        self, 
        query: str, 
        retrieved_docs: List[Document], 
        generated_answer: str,
        query_embedding: np.ndarray,
        doc_embeddings: List[np.ndarray]
    ) -> str:
        """
        Executes the Anti-Hallucination Gate.
        """
        result = self.scorer.compute_confidence(
            query, 
            retrieved_docs, 
            generated_answer, 
            query_embedding, 
            doc_embeddings
        )
        
        if result["status"] == "LOW_CONFIDENCE":
            source_urls = list(set([doc.metadata.get("url", "N/A") for doc in retrieved_docs]))
            response = {
                "status": "LOW_CONFIDENCE",
                "error": "The generated answer did not meet the 65% legal defensibility threshold.",
                "confidence_score": f"{result['score']}%",
                "source_urls": source_urls,
                "advice": "Please consult the source documents manually."
            }
            return json.dumps(response, indent=2)
            
        return json.dumps({
            "status": "OK",
            "confidence_score": f"{result['score']}%",
            "answer": generated_answer,
            "confidence_note": result["confidence_note"]
        }, indent=2)

if __name__ == "__main__":
    # Smoke test for components
    scorer = ConfidenceScorer()
    print("ConfidenceScorer initialized.")