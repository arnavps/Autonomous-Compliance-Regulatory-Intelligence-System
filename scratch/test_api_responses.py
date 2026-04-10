
import requests
import json

def test_api():
    base_url = "http://localhost:8000/api"
    # Testing the endpoints as matched by my previous analysis
    endpoints = [
        ("GET", "/stats"),
        ("POST", "/ask", {"query": "test"}),
        ("GET", "/tasks"),
    ]
    
    for method, path, *data in endpoints:
        url = f"{base_url}{path}"
        print(f"Testing {method} {url}...")
        try:
            if method == "GET":
                resp = requests.get(url)
            else:
                resp = requests.post(url, json=data[0])
            print(f"Status: {resp.status_code}")
            print(f"Body: {resp.text[:100]}...")
        except Exception as e:
            print(f"Error: {e}")

test_api()
