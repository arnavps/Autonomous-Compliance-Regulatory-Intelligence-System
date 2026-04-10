import asyncio
import logging
import uuid
import json
from typing import Dict, Any, List, Optional, TypedDict
from datetime import datetime

# Agent Imports
from src.agents.parser import chunk_document, ParsedDocument
from src.engine.graph import RegulatoryGraph
from src.engine.retriever import VectorEngine
from src.agents.diff import generate_regulatory_diff
from src.agents.mapping import MappingAgent
from src.agents.monitor import run_discovery
from src.utils.db_utils import log_decision

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AgentState(TypedDict):
    task_id: str
    document_id: str
    issuing_body: str
    raw_text: str
    metadata: Dict[str, Any]
    chunks: List[Any]
    diff_results: Optional[Dict[str, Any]]
    mappings: List[Dict[str, Any]]
    status: str  # 'processing', 'completed', 'quarantine', 'failed'
    current_step: str
    progress: int  # 0-100
    errors: List[str]

class TaskTracker:
    """Singleton to track live agent tasks for the dashboard."""
    _instance = None
    _tasks: Dict[str, AgentState] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TaskTracker, cls).__new__(cls)
        return cls._instance

    def create_task(self, document_id: str, issuing_body: str, title: str = "") -> str:
        task_id = str(uuid.uuid4())
        self._tasks[task_id] = {
            "task_id": task_id,
            "document_id": document_id,
            "issuing_body": issuing_body,
            "raw_text": "",
            "metadata": {"title": title},
            "chunks": [],
            "diff_results": None,
            "mappings": [],
            "status": "processing",
            "current_step": "Initializing",
            "progress": 0,
            "errors": []
        }
        return task_id

    def update_task(self, task_id: str, **kwargs):
        if task_id in self._tasks:
            self._tasks[task_id].update(kwargs)

    def get_task(self, task_id: str) -> Optional[AgentState]:
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> List[AgentState]:
        return list(self._tasks.values())

# Global tracker instance
task_tracker = TaskTracker()

async def run_document_pipeline(task_id: str, raw_data: Dict[str, Any]):
    """
    DAG for a single document: Parser -> Indexers -> Relationship -> Analysis
    """
    state = task_tracker.get_task(task_id)
    if not state: return

    try:
        # Step 1: Parsing (Substituted for a real extraction in a full system)
        task_tracker.update_task(task_id, current_step="Parsing & Chunking", progress=30)
        logger.info(f"[{task_id}] Parsing {state['document_id']}...")
        
        # In a real system, we'd fetch the PDF content here. 
        # For the demo pipeline trigger, we assume the text is provided or we use a high-fidelity mock.
        text = raw_data.get("text", "This is the regulatory document content for " + state['document_id'])
        
        parsed_doc = ParsedDocument(
            text=text,
            circular_id=state["document_id"],
            issuing_body=state["issuing_body"],
            date_issued=raw_data.get("date", datetime.now().strftime("%Y-%m-%d")),
            title=state["metadata"].get("title", "Unknown Title")
        )
        
        chunks = chunk_document(parsed_doc)
        task_tracker.update_task(task_id, raw_text=text, chunks=chunks, progress=50)

        # Step 2: Vector and Graph Indexing
        task_tracker.update_task(task_id, current_step="Vector & Graph Indexing", progress=70)
        vector_engine = VectorEngine()
        vector_engine.add_documents(chunks)
        
        reg_graph = RegulatoryGraph()
        reg_graph.add_circular_node(parsed_doc.circular_id, {
            "title": parsed_doc.title,
            "issuing_body": parsed_doc.issuing_body,
            "date": parsed_doc.date_issued,
            "status": "active"
        })

        # Step 3: Conflict & Relationship Detection
        # Heuristic for demo: If title matches seeded conflict titles
        supersedes_id = raw_data.get("supersedes")
        if not supersedes_id and "KYC" in parsed_doc.title:
            # Simulated heuristic detection
            supersedes_id = "RBI/2023-24/01" # Mock old version
            
        if supersedes_id:
            task_tracker.update_task(task_id, current_step="Analyzing Relationships (SUPERSEDES)", progress=85)
            reg_graph.add_relationship(parsed_doc.circular_id, supersedes_id, "SUPERSEDES")
            
            # Step 4: Diff & Mapping
            old_text = "Standard physical KYC was mandatory."
            diff = generate_regulatory_diff(old_text, text)
            task_tracker.update_task(task_id, diff_results=diff)
            
            mapping_agent = MappingAgent(vector_engine)
            mappings = mapping_agent.map_impact_to_policies(diff)
            task_tracker.update_task(task_id, mappings=mappings)

        # Success
        task_tracker.update_task(task_id, current_step="Completed", progress=100, status="completed")
        log_decision("Orchestrator", state["document_id"], "Pipeline success", 100.0)

    except Exception as e:
        logger.error(f"Pipeline error: {e}")
        task_tracker.update_task(task_id, status="failed", errors=[str(e)])

async def orchestrate_regulatory_update():
    """
    Main entry point triggered by /api/ingest.
    Discovers documents and spawns individual pipelines.
    """
    logger.info("Starting Orchestrator discovery run...")
    new_docs = run_discovery()
    
    if not new_docs:
        logger.info("No new documents discovered.")
        return {"status": "no_new_data"}

    tasks = []
    for doc in new_docs:
        task_id = task_tracker.create_task(
            document_id=doc.get("circular_id", str(uuid.uuid4())[:8]),
            issuing_body=doc.get("issuing_body", "Unknown"),
            title=doc.get("title", "Untitled")
        )
        # Pass discovery data as raw_data to the pipeline
        tasks.append(run_document_pipeline(task_id, doc))
    
    await asyncio.gather(*tasks)
    return {"status": "success", "tasks_count": len(new_docs)}
