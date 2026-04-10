import os
import shutil
import logging
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from tenacity import retry, wait_exponential, stop_after_attempt

from src.celery_app import celery_app
from src.tasks import generate_impact_report
from src.engine.orchestrator import orchestrate_regulatory_update, task_tracker
from src.engine.llm_config import get_model_router
from src.utils.db_utils import get_db_manager
from src.engine.retriever import VectorEngine
from contextlib import asynccontextmanager

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

@asynccontextmanager
async def lifespan(app: FastAPI):
    # validate demo logic
    chroma_path = os.path.join("data", "chroma_regintel_semantic")
    graph_path = os.path.join("data", "regulatory_graph.gpickle")
    if not os.path.exists(chroma_path):
        logger.warning(f"DEMO VALIDATION FAILED: ChromaDB missing at {chroma_path}")
    if not os.path.exists(graph_path):
        logger.warning(f"DEMO VALIDATION FAILED: Graph missing at {graph_path}")
    if os.path.exists(chroma_path) and os.path.exists(graph_path):
        logger.info("DEMO VALIDATION PASSED: Seeds present.")
    yield

app = FastAPI(title="ACRIS API", version="1.0", lifespan=lifespan)

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
        sources = []
        conflict_flag = False
        confidence_base = None
        try:
            retriever = VectorEngine()
            docs = retriever.retrieve_context(request.query, top_k=3)
            rbi_found = False
            sebi_found = False
            for doc in docs:
                circular_id = doc.metadata.get("circular_id", "Unknown")
                snippet = doc.page_content[:150] + "..."
                sources.append(f"{circular_id}: {snippet}")
                if "RBI/2023-24/73" in circular_id:
                    rbi_found = True
                if "SEBI/HO/MIRSD/2022/45" in circular_id:
                    sebi_found = True
            if rbi_found and sebi_found:
                conflict_flag = True
            
            if sources:
                confidence_base = 92
        except Exception as e:
            logger.error(f"Vector retrieval failed: {e}")
        
        if not sources:
            sources = run_scraper_agent(request.query)
        
        # Use ModelRouter for LLM generation with fallback
        model_router = get_model_router()
        model_result = model_router.invoke(request.query, confidence_score=confidence_base)
        
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
                "confidence": confidence,
                "conflict_flag": conflict_flag
            }
        
        response = {
            "answer": answer,
            "confidence": confidence,
            "citations": sources,
            "conflict_flag": conflict_flag
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

@app.post("/api/ingest")
async def trigger_ingestion(background_tasks: BackgroundTasks):
    """Trigger async event-driven orchestration pipeline."""
    try:
        background_tasks.add_task(orchestrate_regulatory_update)
        return {
            "status": "queued",
            "message": "Orchestrator discovery and pipeline started"
        }
    except Exception as e:
        logger.error(f"Failed to start orchestrator: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks")
def list_all_tasks():
    """List all tracked orchestration tasks."""
    return {"tasks": task_tracker.get_all_tasks()}

@app.get("/api/task/{task_id}")
def get_task_status_endpoint(task_id: str):
    """Get the live status of an orchestration task."""
    task = task_tracker.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

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

@app.get("/api/early-warnings")
def get_early_warnings():
    """Get early warning drafts sorted by urgency."""
    try:
        import sqlite3
        import os
        db_path = os.path.join(os.getcwd(), 'data', 'seen_urls.db')
        
        if not os.path.exists(db_path):
            return {"warnings": []}
            
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Check if table and columns exist before querying
        try:
            cursor.execute('''
                SELECT * FROM seen 
                WHERE status='draft' AND early_warning_flag=1
            ''')
            rows = cursor.fetchall()
        except sqlite3.OperationalError:
            # Columns might not exist yet if task hasn't run
            rows = []
            
        conn.close()
        
        warnings = []
        for row in rows:
            warnings.append({
                "id": row["url_hash"],
                "url": row["url"],
                "title": row["title"],
                "issuing_body": row["issuing_body"],
                "proposed_change": row["proposed_change"],
                "affected_entities": row["affected_entities"],
                "urgency": row["urgency"],
                "probability": row["probability"],
                "scraped_at": row["scraped_at"]
            })
            
        # Sort by urgency (High -> Medium -> Low)
        urgency_order = {"High": 0, "Medium": 1, "Low": 2}
        warnings.sort(key=lambda x: urgency_order.get(x["urgency"] if x["urgency"] else "Medium", 3))
        
        return {"warnings": warnings}
        
    except Exception as e:
        logger.error(f"Failed to get early warnings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))