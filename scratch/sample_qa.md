### Sample Professional Regulatory Query

**User Input (Prompt):**
"What are the specific identity verification requirements for digital lending products as per the latest RBI circular, and are there any exemptions for low-value loans?"

**Expected Agentic Payload (Input to /api/ask):**
```json
{
  "query": "What are the specific identity verification requirements for digital lending products as per the latest RBI circular, and are there any exemptions for low-value loans?",
  "preferences": {
    "focus_areas": ["KYC", "Digital Lending"],
    "authority": "RBI",
    "strict_grounding": true
  }
}
```

**Expected Autonomous Response (ACRIS Intelligence Output):**
```json
{
  "answer": "As per RBI Circular RBI/2024-25/110, all digital lending entities (REs) must ensure that identity verification is completed either through Physical KYC or Video-based Customer Identification Process (V-CIP). For low-value loans (up to INR 10,000), simplified KYC is permitted provided the aggregate loan amount across all lenders does not exceed INR 50,000 for that customer.",
  "source_sentences": [
    "REs shall ensure that identity verification for digital lending is aligned with existing V-CIP mandates.",
    "Exemptions are provided for small-ticket lending under Section 12.2 of the master direction."
  ],
  "circular_ids": ["RBI/2024-25/110", "RBI/BR/KYC-MD/2016"],
  "confidence_score": 94.2,
  "status": "OK"
}
```
