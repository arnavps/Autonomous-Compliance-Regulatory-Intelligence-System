import requests
import json

BASE_URL = "http://localhost:8000/api/agents"

def test_parser():
    payload = {
        "text": "Section 1: All banks must verify users. Section 2: Penalties apply for failure.",
        "circular_id": "DEMO-99",
        "issuing_body": "RBI"
    }
    response = requests.post(f"{BASE_URL}/parser", json=payload)
    print(f"Parser Response: {json.dumps(response.json(), indent=2)}")

def test_diff():
    payload = {
        "old_text": "Banks must verify identity physically.",
        "new_text": "Banks must verify identity via V-CIP."
    }
    response = requests.post(f"{BASE_URL}/diff", json=payload)
    print(f"Diff Response: {json.dumps(response.json(), indent=2)}")

def test_mapping():
    # Mock diff results structure
    payload = {
        "diff_results": {
            "changes": [
                {"type": "addition", "text": "V-CIP methodology is adopted."}
            ]
        }
    }
    response = requests.post(f"{BASE_URL}/mapping", json=payload)
    print(f"Mapping Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    try:
        print("--- Testing Parser ---")
        test_parser()
        print("\n--- Testing Diff ---")
        test_diff()
        print("\n--- Testing Mapping ---")
        test_mapping()
    except Exception as e:
        print(f"Test failed: {e}")
