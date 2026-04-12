import sys
import os
import json
from datetime import datetime, timedelta
sys.path.append(os.getcwd())

from src.agents.diff import generate_regulatory_diff
from src.agents.mapping import MappingAgent, seed_internal_policies
from src.agents.drafting import DraftingAgent
from src.agents.reporting import ReportingAgent
from src.engine.retriever import VectorEngine

def test_full_agent_orchestration():
    print("\n--- Starting Full Agent Orchestration Test ---")
    
    # 1. Setup Data & Engines
    internal_engine = VectorEngine(collection_name="internal_policies")
    seed_internal_policies(internal_engine)
    
    drafting_agent = DraftingAgent()
    reporting_agent = ReportingAgent()
    mapping_agent = MappingAgent(internal_engine)

    # 2. Input: New Circular replaces Old Circular
    old_circular = "Clause 1.0: All KYC must be done physically."
    new_circular = "Clause 1.0: KYC can now be done via V-CIP (RBI/2024/001)."
    
    # 3. Step 1: Diff Agent
    print("\n[Step 1] Running Diff Agent...")
    diff_results = generate_regulatory_diff(old_circular, new_circular)
    
    # 4. Step 2: Mapping Agent
    print("\n[Step 2] Running Mapping Agent...")
    impacted_policies = mapping_agent.map_impact_to_policies(diff_results, taxonomy_filter="KYC")
    
    # 5. Step 3: Drafting Agent
    print("\n[Step 3] Running Drafting Agent...")
    proposed_amendments = []
    for policy in impacted_policies:
        # Simulate an internal clause text
        internal_clause_text = "Standard Operating Procedure: All customer identification requires physical attendance and document scanning."
        # Call drafting (using a mock confidence score from a previous phase)
        draft = drafting_agent.draft_amendment(
            internal_clause=internal_clause_text,
            change_text=policy["change_fragment"],
            reg_context=new_circular,
            upstream_confidence=78.5 # Should trigger Human Review Flag
        )
        proposed_amendments.append(draft)

    # 6. Step 4: Reporting Agent
    print("\n[Step 4] Running Reporting Agent...")
    # Simulate a close effective date for HIGH urgency
    effective_date = (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d")
    
    data_package = {
        "metadata": {
            "circular_id": "RBI/2024/001",
            "issuing_body": "RBI",
            "title": "Master Direction - KYC Amendment 2024",
            "effective_date": effective_date,
            "scraped_at": datetime.now().isoformat()
        },
        "diff": diff_results,
        "impacted_policies": impacted_policies,
        "proposed_amendments": proposed_amendments,
        "confidence": {
            "score": 78.5,
            "status": "LOW_CONFIDENCE",
            "signals": {"retrieval": 0.8, "relevance": 0.7, "faithfulness": 0.6}
        }
    }
    
    report_path = reporting_agent.generate_impact_report(data_package)
    print(f"\n✓ Full Pipeline Test Complete. Report generated at: {report_path}")
    
    assert os.path.exists(report_path)
    with open(report_path, "r", encoding="utf-8") as f:
        content = f.read()
        print(f"\n--- Report Content Preview ---\n{content[:500]}...")
        assert "## 4. Proposed Policy Amendments" in content
        assert "HUMAN REVIEW REQUIRED" in content.upper()
        # More robust check for Urgency
        assert "HIGH" in content.upper() and "URGENCY" in content.upper()
        
    print("\n✓ ALL AGENTS VERIFIED.")

if __name__ == "__main__":
    test_full_agent_orchestration()
