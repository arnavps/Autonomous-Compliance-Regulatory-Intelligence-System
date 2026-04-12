import sys
import os
sys.path.append(os.getcwd())

from src.engine.prompts import PromptRegistry, format_rag_prompt, validate_json_response
from langchain_core.documents import Document

def test_prompt_orchestration():
    print("\n--- Testing Prompt Formatting ---")
    query = "What are the KYC norms for V-CIP?"
    docs = [
        Document(
            page_content="V-CIP is a Video-based Customer Identification Process for KYC.",
            metadata={"issuing_body": "RBI", "circular_id": "RBI/2023/001", "date_issued": "2023-01-01"}
        )
    ]
    
    formatted = format_rag_prompt(query, docs)
    print(formatted)
    
    assert "<context>" in formatted
    assert "RBI/2023/001" in formatted
    print("✓ Prompt formatting verified.")

    print("\n--- Testing JSON Validation (Markdown Block) ---")
    mock_llm_output = """Here is the compliance insight:
```json
{
  "answer": "V-CIP is allowed for KYC.",
  "source_sentences": ["V-CIP is a Video-based Customer Identification Process for KYC."],
  "circular_ids": ["RBI/2023/001"],
  "superseded_warning": "None",
  "status": "OK"
}
```
"""
    result = validate_json_response(mock_llm_output)
    print(result)
    assert result["status"] == "OK"
    assert "V-CIP" in result["answer"]
    print("✓ JSON parsing (markdown) verified.")

    print("\n--- Testing JSON Validation (Malformed) ---")
    bad_output = "No information found."
    result = validate_json_response(bad_output)
    print(result)
    assert result["status"] == "ERROR"
    print("✓ JSON error handling verified.")

if __name__ == "__main__":
    test_prompt_orchestration()
