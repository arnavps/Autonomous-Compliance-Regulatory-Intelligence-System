import sys
import os
import json
sys.path.append(os.getcwd())

from src.agents.diff import generate_regulatory_diff
from src.agents.mapping import MappingAgent, seed_internal_policies
from src.engine.retriever import VectorEngine

def test_analysis_pipeline():
    print("\n--- Testing Diff Agent ---")
    old_circular = """
    1. Introduction: KYC norms are vital.
    2. Verification: Banks must perform physical verification of documents.
    3. Fee: Processing fee is 500 INR.
    """
    new_circular = """
    1. Introduction: KYC norms are vital.
    2. Verification: Banks must perform Video-based Customer Identification Process (V-CIP).
    3. Fee: Processing fee is 500 INR.
    4. Compliance: Mandatory for all scheduled commercial banks.
    """
    
    diff_results = generate_regulatory_diff(old_circular, new_circular)
    print("Diff Summary:", diff_results["summary"])
    assert diff_results["summary"]["additions"] >= 1
    assert diff_results["summary"]["deletions"] >= 1
    print("✓ Diff Agent verified.")

    print("\n--- Testing Mapping Agent ---")
    # Initialize internal policy engine
    internal_engine = VectorEngine(collection_name="internal_policies")
    # Seed mock policies
    seed_internal_policies(internal_engine)
    
    mapping_agent = MappingAgent(internal_engine)
    
    # Map the diff to internal policies
    impacts = mapping_agent.map_impact_to_policies(diff_results, taxonomy_filter="KYC")
    
    print(f"\nDetected {len(impacts)} Impacted Policies:")
    for impact in impacts:
        print(f"- [{impact['internal_policy_id']}] {impact['internal_policy_title']}")
        print(f"  Note: {impact['suggested_action']} due to change: '{impact['change_fragment']}'")
    
    assert len(impacts) > 0
    assert "KYC-001" in [i["internal_policy_id"] for i in impacts]
    print("\n✓ Mapping Agent verified.")

if __name__ == "__main__":
    test_analysis_pipeline()
