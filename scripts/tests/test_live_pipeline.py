import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from src.engine.orchestrator import orchestrate_regulatory_update, task_tracker

async def verify_pipeline():
    print("--- Starting Pipeline Verification ---")
    
    # 1. Trigger Orchestrator
    # This will calls run_discovery and spawn pipelines for any new docs
    # Note: run_discovery uses the actual RBI/SEBI URLs from .env
    print("Triggering discovery...")
    result = await orchestrate_regulatory_update()
    print(f"Discovery Result: {result}")
    
    # 2. Monitor Tasks
    # We check the task tracker for all active tasks
    tasks = task_tracker.get_all_tasks()
    if not tasks:
        print("No new documents were found by the Monitor Agent (already seen).")
        print("To force a pipeline run, we will create a manual task.")
        
        task_id = task_tracker.create_task(
            document_id="TEST-CIR-001",
            issuing_body="RBI",
            title="Manual Test: Digital Lending Update"
        )
        
        manual_doc = {
            "circular_id": "TEST-CIR-001",
            "title": "Manual Test: Digital Lending Update",
            "text": "All digital lending must use a flat rate. Penalty is 10%.",
            "date": "2024-04-10",
            "supersedes": "OLD-CIR-99"
        }
        
        # We need to run the document pipeline manually since discovery didn't find anything new
        from src.engine.orchestrator import run_document_pipeline
        await run_document_pipeline(task_id, manual_doc)
        tasks = [task_tracker.get_task(task_id)]

    print(f"Found {len(tasks)} tasks in tracker.")
    
    for task in tasks:
        print(f"\nTask ID: {task['task_id']}")
        print(f"Document: {task['document_id']}")
        print(f"Status: {task['status']}")
        print(f"Progress: {task['progress']}%")
        print(f"Current Step: {task['current_step']}")
        
        if task['diff_results']:
            print(f"Diff Detected: {task['diff_results']['summary']}")
            
        if task['mappings']:
            print(f"Mappings Found: {len(task['mappings'])} internal policies affected.")
            for m in task['mappings']:
                print(f"  -> {m['internal_policy_id']}: {m['internal_policy_title']}")

    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    asyncio.run(verify_pipeline())
