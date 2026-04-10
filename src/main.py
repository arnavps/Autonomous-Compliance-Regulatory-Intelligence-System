import os
import shutil
import logging
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from tenacity import retry, wait_exponential, stop_after_attempt

from src.celery_app import celery_app
from src.tasks import run_ingestion_pipeline, generate_impact_report, get_task_status
from src.engine.llm_config import get_model_router
from src.utils.db_utils import get_db_manager

# Configure logging
os.makedirs("logs", exist_ok=True)

# SRE logger to agent_health.log
sre_logger = logging.getLogger("agent_health")
sre_logger.setLevel(logging.ERROR)
file_handler = logging.FileHandler("logs/agent_health.log")
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
if not sre_logger.handlers:
    sre_logger.addHandler(file_handler)

# General logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class QueryRequest(BaseModel):
    query: str

class IngestionRequest(BaseModel):
    data_sources: Optional[List[str]] = []

class ImpactReportRequest(BaseModel):
    regulation_data: Dict[str, Any]

class TaskResponse(BaseModel):
    task_id: str
    status: str
    message: str

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
    """Query the regulatory intelligence system with model routing."""
    try:
        # Wrap all agent calls inside error-handling block
        sources = run_scraper_agent(request.query)
        
        # Use ModelRouter for LLM generation with fallback
        model_router = get_model_router()
        model_result = model_router.invoke(request.query)
        
        if model_result.get("error"):
            # Fall back to simulated response if model fails
            answer = run_llm_agent(request.query, sources)
            confidence = get_confidence_score()
            model_used = None
            fallback_triggered = True
        else:
            answer = model_result["response"]
            confidence = model_result["confidence_score"]
            model_used = model_result["model_used"]
            fallback_triggered = model_result.get("fallback_triggered", False)
            
            # Log the decision to database
            try:
                get_db_manager().log_decision(
                    agent_name="query_engine",
                    input_data=request.query,
                    agent_output=answer,
                    confidence_score=confidence,
                    model_used=model_used,
                    fallback_triggered=fallback_triggered,
                    processing_time=model_result.get("timing")
                )
            except Exception as log_e:
                logger.warning(f"Failed to log decision: {log_e}")
        
        # Low-Confidence Block
        if confidence < 65:
            return {
                "status": "Insufficient Data",
                "answer": "The AI could not gather enough verifiable evidence. Please consult the enclosed links.",
                "source_links": sources,
                "confidence": confidence
            }
        
        response = {
            "answer": answer,
            "confidence": confidence,
            "citations": sources
        }
        
        # Add model info if available
        if model_used:
            response["model_used"] = model_used
            response["fallback_triggered"] = fallback_triggered
        
        return response

    except Exception as e:
        # Logger Integration and Exception Global Handling
        sre_logger.error(f"Agent Pipeline Failed: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=206,
            content={
                "status": "FALLBACK",
                "message": "Agent timeout or error",
                "suggested_action": "Consult Source URL"
            }
        )

@app.post("/api/ingest", response_model=TaskResponse)
def trigger_ingestion(request: IngestionRequest):
    """Trigger async data ingestion pipeline."""
    try:
        task = run_ingestion_pipeline.delay(request.data_sources)
        
        return TaskResponse(
            task_id=task.id,
            status="queued",
            message="Ingestion pipeline started successfully"
        )
        
    except Exception as e:
        logger.error(f"Failed to start ingestion pipeline: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/impact-report", response_model=TaskResponse)
def trigger_impact_report(request: ImpactReportRequest):
    """Trigger async impact report generation."""
    try:
        task = generate_impact_report.delay(request.regulation_data)
        
        return TaskResponse(
            task_id=task.id,
            status="queued", 
            message="Impact report generation started successfully"
        )
        
    except Exception as e:
        logger.error(f"Failed to start impact report generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/task/{task_id}")
def get_task_status_endpoint(task_id: str):
    """Get the status of an async task."""
    try:
        task_result = get_task_status.delay(task_id).get()
        return task_result
        
    except Exception as e:
        logger.error(f"Failed to get task status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/decisions")
def get_recent_decisions(limit: int = 100, agent_name: Optional[str] = None):
    """Get recent decision logs."""
    try:
        db_manager = get_db_manager()
        decisions = db_manager.get_recent_decisions(limit=limit, agent_name=agent_name)
        
        return {
            "decisions": [decision.to_dict() for decision in decisions],
            "total": len(decisions)
        }
        
    except Exception as e:
        logger.error(f"Failed to retrieve decisions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
def get_decision_stats(agent_name: Optional[str] = None):
    """Get decision statistics."""
    try:
        db_manager = get_db_manager()
        stats = db_manager.get_decision_stats(agent_name=agent_name)
        
        return stats
        
    except Exception as e:
        logger.error(f"Failed to get decision stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))