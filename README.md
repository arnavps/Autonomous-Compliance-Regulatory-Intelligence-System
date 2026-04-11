# ACRIS - Autonomous Compliance & Regulatory Intelligence System
ACRIS is an autonomous AI system designed to read every RBI and SEBI circular the moment it's published. It detects contradictions across the entire regulatory corpus, scores its own confidence in every answer, and warns compliance teams 30–90 days before new regulations hit.

---

## 📊 Quick Stats
- **2** Regulators Monitored (RBI + SEBI)
- **1,200+** Circulars Indexed (Full Corpus)
- **47** Conflict Pairs Auto-detected
- **3-Layer** Confidence Engine (Anti-hallucination)

---

## 🚀 The Solution: Trifecta Differentiator

| Pillar | What Others Do | What RegIntel AI Does |
| :--- | :--- | :--- |
| **Q&A Engine** | Return an answer | Answer + exact source sentence + % confidence score |
| **Conflict Detection** | Nothing | Live knowledge graph flagging contradictions between RBI & SEBI |
| **Early Warning** | Nothing | Scrapes draft circulars, predicts compliance shifts 30–90 days in advance |
| **Amendment Drafting**| Manual lawyers | AI drafts replacement clauses mapped to specific contracts/policies |

---

## 🛠️ Technical Stack
- **Orchestration**: LangChain 0.2.x
- **Vector Store**: ChromaDB 0.5.x
- **Embeddings**: MiniLM-L6-v2 (Local, 384-dim)
- **LLM**: Ollama (llama3.1:8b) / GPT-4o-mini
- **Graph Engine**: NetworkX 3.x
- **Frontend**: Streamlit 1.35.x
- **Parsing**: PyMuPDF (fitz) + Tesseract OCR Fallback
- **Scraping**: BeautifulSoup 4 + APScheduler

---

## 🏗️ System Architecture

The system is structured in five layers:
1. **Layer 1: Data Ingestion** - BeautifulSoup, PyMuPDF, Tesseract OCR, APScheduler
2. **Layer 2: Vector Storage** - ChromaDB (Semantic + BM25), SQLite metadata
3. **Layer 3: RAG + Confidence** - LangChain LCEL, Cross-encoder, NLI faithfulness gate
4. **Layer 4: Conflict Graph** - NetworkX, NLI contradiction detector, GNN (optional)
5. **Layer 5: Presentation** - Streamlit UI, FastAPI REST endpoints, Early Warning Dashboard

---

## 🤖 Multi-Agent Pipeline
We implement a 6-agent pipeline for full traceability and parallel processing:
1. **Monitor Agent**: Continuously scans regulatory feeds for new documents.
2. **Ingestion Agent**: Downloads, parses, and chunks documents into ChromaDB.
3. **Change-Detection (Diff) Agent**: Generates textual diffs against previous versions.
4. **Mapping Agent**: Links regulatory changes to internal policies/contracts.
5. **Drafting Agent**: Formulates replacement wording for impacted clauses.
6. **Reporting Agent**: Compiles structured impact reports for stakeholders.

---

## 📈 Roadmap & Commercialization
- **0–12 Months**: RBI + SEBI full corpus; NBFC + Fintech GTM; SaaS Starter/Pro tiers.
- **12–18 Months**: Expansion to IRDAI (Insurance) and IBBI (Insolvency) coverage.
- **18–24 Months**: Multi-jurisdiction (India + Singapore + UAE); White-label API.

---

## 🔧 Setup & Installation

### Environment Configuration
Create a `.env` file based on the template:
```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
CHROMA_PERSIST_DIR=./chroma_db
SQLITE_PATH=data/metadata.db
```

### Installation
```bash
pip install -r requirements.txt
```

### Deployment
```bash
docker-compose up --build
```

---

## ⚖️ Disclaimer
*For informational purposes only; not legal advice. Every answer must be verified against the cited official regulatory document.*

---
*Built with precision. Pitch with confidence. Win.*
