from fastapi.testclient import TestClient
from src.main import app
import pytest

client = TestClient(app)

QUERIES = [
    "What are the KYC requirements for digital lending apps under RBI?",
    "Is V-CIP allowed for KYC verification?",
    "Is IPV mandatory for securities accounts under SEBI?",
    "Are there any contradictions between RBI and SEBI regarding video KYC?",
    "What is the required verification mechanism for a Listed NBFC?"
]

@pytest.mark.parametrize("query", QUERIES)
def test_canned_queries_confidence_and_citation(query):
    payload = {"query": query}
    response = client.post("/api/ask", json=payload)
    
    assert response.status_code == 200, f"Request failed for query: {query}"
    data = response.json()
    
    # Assert Confidence > 85
    assert "confidence" in data, "Confidence score missing"
    assert data["confidence"] > 85, f"Confidence score too low: {data['confidence']}"
    
    # Assert Citations include RBI
    assert "citations" in data, "Citations missing"
    citations = data["citations"]
    has_rbi = any("RBI/2023-24/73" in str(citation) for citation in citations)
    has_sebi = any("SEBI/HO/MIRSD/2022/45" in str(citation) for citation in citations)
    
    # Since VectorEngine top_k=3 will pull our seeded documents, at least one should be present.
    assert has_rbi or has_sebi, "Required demo citation missing"

    # Ensure structural integrity
    assert "answer" in data
    assert "conflict_flag" in data
