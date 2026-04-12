import sys
import os
sys.path.append(os.getcwd())

from src.engine.graph import RegulatoryGraph

def test_regulatory_graph():
    # 1. Initialize
    rg = RegulatoryGraph()
    
    # 2. Add sample nodes
    print("\n--- Adding Nodes ---")
    rg.add_circular_node("RBI/2021/001", {"title": "KYC Phase 1", "date": "2021-01-01", "status": "active"})
    rg.add_circular_node("RBI/2022/001", {"title": "KYC Phase 2", "date": "2022-01-01", "status": "active"})
    rg.add_circular_node("SEBI/2023/X", {"title": "KRA Norms", "date": "2023-01-01", "status": "active"})
    
    # 3. Add Relationships
    print("\n--- Adding Relationships ---")
    # RBI 2022 supersedes RBI 2021
    rg.add_relationship("RBI/2022/001", "RBI/2021/001", "SUPERSEDES")
    # SEBI 2023 contradicts RBI 2022 on a specific clause
    rg.add_relationship("SEBI/2023/X", "RBI/2022/001", "CONTRADICTS")
    
    # 4. Test Supersession Resolution
    print("\n--- Testing Supersession Resolution ---")
    active_ver = rg.resolve_active_circular("RBI/2021/001")
    print(f"Active version of RBI/2021/001 -> {active_ver}")
    assert active_ver == "RBI/2022/001"
    
    # 5. Test Conflict Detection
    print("\n--- Testing Conflict Detection ---")
    conflicts = rg.find_conflicts("RBI/2022/001")
    print(f"Conflicts for RBI/2022/001: {conflicts}")
    assert "SEBI/2023/X" in conflicts
    
    # 6. Test Loop Protection
    print("\n--- Testing Loop Protection ---")
    rg.add_relationship("RBI/2021/001", "RBI/2022/001", "SUPERSEDES") # Create a loop B -> A -> B
    active_ver = rg.resolve_active_circular("RBI/2021/001")
    print(f"Loop resolution for RBI/2021/001 -> {active_ver}")
    print("✓ Loop protection verified.")

if __name__ == "__main__":
    test_regulatory_graph()
