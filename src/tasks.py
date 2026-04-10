import logging
import json
from typing import Dict, Any
from celery import current_task
from src.celery_app import celery_app
from src.engine.llm_config import get_model_router
from src.utils.db_utils import log_decision
from src.agents.reporting import ReportingAgent

logger = logging.getLogger(__name__)

@celery_app.task(bind=True)
def run_ingestion_pipeline(self, data_sources: list = None) -> Dict[str, Any]:
    """
    Async task to run the data ingestion pipeline.
    
    Args:
        data_sources: List of data sources to ingest from
        
    Returns:
        Dict containing task results
    """
    task_id = self.request.id
    
    try:
        # Update task status
        self.update_state(state="PROGRESS", meta={"status": "Starting ingestion pipeline"})
        
        # Simulate ingestion pipeline (replace with actual implementation)
        logger.info(f"Starting ingestion pipeline for task {task_id}")
        
        # Mock ingestion process
        steps = [
            "Fetching regulatory documents",
            "Parsing document content", 
            "Extracting metadata",
            "Updating vector database",
            "Indexing completed"
        ]
        
        for i, step in enumerate(steps):
            self.update_state(
                state="PROGRESS", 
                meta={"status": step, "progress": (i + 1) * 20}
            )
            
            # Simulate processing time
            import time
            time.sleep(2)
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "documents_processed": 42,  # Mock data
            "new_regulations": 5,
            "updated_policies": 12,
            "processing_time": 10.5
        }
        
        # Log decision to database
        log_decision(
            agent_name="ingestion_pipeline",
            input_data=json.dumps(data_sources or []),
            agent_output=json.dumps(result),
            confidence_score=95.0,
            processing_time=result["processing_time"]
        )
        
        logger.info(f"Ingestion pipeline completed for task {task_id}")
        return result
        
    except Exception as e:
        logger.error(f"Ingestion pipeline failed for task {task_id}: {str(e)}")
        self.update_state(
            state="FAILURE",
            meta={"error": str(e)}
        )
        raise

@celery_app.task(bind=True)
def generate_impact_report(self, regulation_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Async task to generate regulatory impact report.
    
    Args:
        regulation_data: Dictionary containing regulation information
        
    Returns:
        Dict containing task results including report path
    """
    task_id = self.request.id
    
    try:
        # Update task status
        self.update_state(state="PROGRESS", meta={"status": "Starting impact analysis"})
        
        logger.info(f"Starting impact report generation for task {task_id}")
        
        # Initialize reporting agent
        reporting_agent = ReportingAgent()
        
        # Use model router for any LLM processing needed
        model_router = get_model_router()
        
        # Process the regulation data through the reporting pipeline
        self.update_state(state="PROGRESS", meta={"status": "Analyzing regulatory changes"})
        
        # Mock analysis steps (replace with actual implementation)
        import time
        time.sleep(3)
        
        self.update_state(state="PROGRESS", meta={"status": "Mapping impacted policies"})
        time.sleep(2)
        
        self.update_state(state="PROGRESS", meta={"status": "Generating proposed amendments"})
        time.sleep(2)
        
        self.update_state(state="PROGRESS", meta={"status": "Creating impact report"})
        
        # Generate the actual report
        report_path = reporting_agent.generate_impact_report(regulation_data)
        
        # Get model information for logging
        model_result = model_router.invoke("Analyze regulation impact", confidence_score=85.0)
        
        result = {
            "task_id": task_id,
            "status": "completed",
            "report_path": report_path,
            "model_used": model_result.get("model_used"),
            "confidence_score": model_result.get("confidence_score"),
            "fallback_triggered": model_result.get("fallback_triggered", False),
            "processing_time": 7.5
        }
        
        # Log decision to database
        log_decision(
            agent_name="impact_report_generator",
            input_data=json.dumps(regulation_data),
            agent_output=json.dumps(result),
            confidence_score=result["confidence_score"],
            model_used=result["model_used"],
            fallback_triggered=result["fallback_triggered"],
            processing_time=result["processing_time"]
        )
        
        logger.info(f"Impact report generated for task {task_id}: {report_path}")
        return result
        
    except Exception as e:
        logger.error(f"Impact report generation failed for task {task_id}: {str(e)}")
        self.update_state(
            state="FAILURE",
            meta={"error": str(e)}
        )
        raise

@celery_app.task
def get_task_status(task_id: str) -> Dict[str, Any]:
    """
    Get the status of a Celery task.
    
    Args:
        task_id: The Celery task ID
        
    Returns:
        Dict containing task status information
    """
    try:
        result = celery_app.AsyncResult(task_id)
        
        response = {
            "task_id": task_id,
            "state": result.state,
            "result": result.result if result.state == "SUCCESS" else None,
            "error": str(result.result) if result.state == "FAILURE" else None,
            "progress": 0
        }
        
        # Extract progress information if available
        if result.state == "PROGRESS" and result.result:
            response.update(result.result)
        
        return response
        
    except Exception as e:
        logger.error(f"Failed to get task status for {task_id}: {str(e)}")
        return {
            "task_id": task_id,
            "state": "UNKNOWN",
            "error": str(e)
        }
