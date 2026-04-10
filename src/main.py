import os
import shutil
import logging
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from tenacity import retry, wait_exponential, stop_after_attempt

# Configure SRE logger to agent_health.log
os.makedirs("logs", exist_ok=True)
logger = logging.getLogger("agent_health")
logger.setLevel(logging.ERROR)
file_handler = logging.FileHandler("logs/agent_health.log")
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(file_handler)

class QueryRequest(BaseModel):
    query: str

app = FastAPI(title="ACRIS API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ACRIS FastAPI Server is running."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    # Define save directory
    save_dir = os.path.join("data", "policies")
    os.makedirs(save_dir, exist_ok=True)
    
    file_path = os.path.join(save_dir, file.filename)
    
    # Save the file safely
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {
        "status": "success",
        "message": "File uploaded successfully",
        "filename": file.filename,
        "path": file_path
    }

# Agent Wrappers with Exponential Backoff
@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
def run_scraper_agent(query: str):
    """Simulated Scraper Agent call."""
    return [
        "RBI/2024-25/112 (Digital Lending Framework)",
        "SEBI Circular CIR/2023/89 (Algorithmic Trading)"
    ]

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
def run_llm_agent(query: str, sources: list):
    """Simulated LLM Generation call."""
    return f"Based on our analysis of the regulatory corpus regarding '{query}', the latest RBI guidelines stipulate strict enforcement of algorithmic lending caps. You must ensure all third-party API partnerships undergo a quarterly audit and report compliance directly to the supervisor."


def get_confidence_score():
    """Simulated ConfidenceScorer call."""
    return 88.5

@app.post("/api/ask")
def query_acris(request: QueryRequest):
    try:
        # Wrap all agent calls inside error-handling block
        sources = run_scraper_agent(request.query)
        answer = run_llm_agent(request.query, sources)
        
        # Verify LLM Safety and Hallucination Risk
        confidence = get_confidence_score()
        
        # Low-Confidence Block
        if confidence < 65:
            return {
                "status": "Insufficient Data",
                "answer": "The AI could not gather enough verifiable evidence. Please consult the enclosed links.",
                "source_links": sources
            }
        
        return {
            "answer": answer,
            "confidence": confidence,
            "citations": sources
        }

    except Exception as e:
        # Logger Integration and Exception Global Handling
        logger.error(f"Agent Pipeline Failed: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=206,
            content={
                "status": "FALLBACK",
                "message": "Agent timeout",
                "suggested_action": "Consult Source URL"
            }
        )