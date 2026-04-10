import sys
import os
import requests

# We'll use the API if it's running, or call the logic directly
sys.path.append(os.getcwd())

from src.engine.retriever import VectorEngine
from src.engine.llm_config import get_model_router

def test_qa():
    query = "What is the requirement for V-CIP under RBI?"
    print(f"Testing Q&A with query: {query}")
    
    # 1. Test Retrieval
    try:
        engine = VectorEngine()
        docs = engine.retrieve_context(query, top_k=2)
        print(f"\nRetrieved {len(docs)} documents:")
        for doc in docs:
            print(f"- [{doc.metadata.get('circular_id')}] {doc.page_content}")
    except Exception as e:
        print(f"Retrieval failed: {e}")
        return

    # 2. Test LLM
    try:
        router = get_model_router()
        # Create a context-aware prompt
        context = "\n".join([d.page_content for d in docs])
        prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"
        
        result = router.invoke(prompt)
        print("\nLLM Response:")
        print(f"Model used: {result.get('model_used')}")
        print(f"Confidence: {result.get('confidence_score')}%")
        print(f"Answer: {result.get('response')}")
    except Exception as e:
        print(f"LLM call failed: {e}")

if __name__ == "__main__":
    test_qa()
