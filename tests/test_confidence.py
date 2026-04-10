import sys
import os
import json
import numpy as np
sys.path.append(os.getcwd())

from langchain_core.documents import Document
from src.engine.confidence import ConfidenceScorer, ConfidenceGate

def test_confidence_gate():
    scorer = ConfidenceScorer()
    gate = ConfidenceGate(scorer)
    
    query = "What is V-CIP?"
    context = [
        Document(
            page_content="V-CIP stands for Video-based Customer Identification Process. It is used by banks for remote KYC.",
            metadata={"url": "https://rbi.org.in/vcip"}
        )
    ]
    
    # Mock Embeddings (Simple random vectors for test)
    query_emb = np.random.rand(384)
    doc_embs = [np.random.rand(384)]
    
    print("\n--- Testing PASS Scenario ---")
    good_answer = "V-CIP is a Video-based Customer Identification Process used for remote KYC verification."
    response = gate.validate_and_return(query, context, good_answer, query_emb, doc_embs)
    print(response)
    
    print("\n--- Testing BLOCK Scenario (Hallucination) ---")
    bad_answer = "V-CIP is a new digital coin launched by banks for crypto trading."
    response = gate.validate_and_return(query, context, bad_answer, query_emb, doc_embs)
    print(response)

if __name__ == "__main__":
    test_confidence_gate()
