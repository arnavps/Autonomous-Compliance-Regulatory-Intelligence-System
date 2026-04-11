import os
import pickle
import logging
import networkx as nx
from typing import List, Dict, Any, Optional, Set

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
GRAPH_PATH = os.path.join(os.getcwd(), 'data', 'regulatory_graph.gpickle')

class RegulatoryGraph:
    def __init__(self):
        """Initialize the graph, loading from disk if available."""
        self.graph = nx.DiGraph()
        self.load_graph()

    def load_graph(self):
        """Load graph from persistence layer."""
        if os.path.exists(GRAPH_PATH):
            try:
                with open(GRAPH_PATH, 'rb') as f:
                    self.graph = pickle.load(f)
                logger.info(f"Loaded RegulatoryGraph with {self.graph.number_of_nodes()} nodes.")
            except Exception as e:
                logger.error(f"Failed to load graph: {e}")
                self.graph = nx.DiGraph()

    def save_graph(self):
        """Save graph to persistence layer."""
        os.makedirs(os.path.dirname(GRAPH_PATH), exist_ok=True)
        try:
            with open(GRAPH_PATH, 'wb') as f:
                pickle.dump(self.graph, f)
            logger.info("RegulatoryGraph persisted to disk.")
        except Exception as e:
            logger.error(f"Failed to save graph: {e}")

    def add_circular_node(self, circular_id: str, metadata: Dict[str, Any]):
        """Add a regulatory circular as a node."""
        self.graph.add_node(
            circular_id, 
            type='Circular', 
            **metadata
        )
        logger.info(f"Added Circular node: {circular_id}")
        self.save_graph()

    def add_clause_node(self, clause_id: str, text: str, parent_circular: str, section: str = ""):
        """Add a specific clause/section as a node linked to a circular."""
        self.graph.add_node(
            clause_id, 
            type='Clause', 
            text=text, 
            circular_id=parent_circular,
            section=section
        )
        # Automatically create a reference link to the parent
        self.add_relationship(clause_id, parent_circular, 'BELONGS_TO')

    def add_relationship(self, id_a: str, id_b: str, rel_type: str):
        """
        Add a relationship between two nodes.
        Types: SUPERSEDES, CONTRADICTS, REFERENCES, BELONGS_TO
        """
        if rel_type == 'CONTRADICTS':
            # Contradiction is bidirectional
            self.graph.add_edge(id_a, id_b, type=rel_type)
            self.graph.add_edge(id_b, id_a, type=rel_type)
        else:
            # Directed relationship
            self.graph.add_edge(id_a, id_b, type=rel_type)
            
        # Special logic for supersession: Update node status
        if rel_type == 'SUPERSEDES':
            if id_b in self.graph:
                self.graph.nodes[id_b]['status'] = 'superseded'
            if id_a in self.graph:
                self.graph.nodes[id_a]['status'] = 'active'
        
        logger.info(f"Added relationship: {id_a} --[{rel_type}]--> {id_b}")
        self.save_graph()

    def resolve_active_circular(self, circular_id: str, visited: Optional[Set[str]] = None) -> str:
        """
        Traverse the SUPERSEDES chain to find the currently active version.
        Example: A --superseded_by--> B --superseded_by--> C. Returns C.
        """
        if visited is None:
            visited = set()
            
        if circular_id in visited:
            logger.warning(f"Circular reference detected at {circular_id}. Stopping traversal.")
            return circular_id
            
        visited.add(circular_id)
        
        # In our graph, SUPERSEDES is (New -> Old), but we want to follow it (Old -> New)
        # Wait, the spec says SUPERSEDES: Newer -> Older. 
        # So to find the ACTIVE version of an OLD circular, we look at incoming edges of type SUPERSEDES.
        
        successor = None
        for u, v, d in self.graph.in_edges(circular_id, data=True):
            if d.get('type') == 'SUPERSEDES':
                successor = u
                break # Assume one primarily active successor for now
                
        if successor:
            return self.resolve_active_circular(successor, visited)
            
        return circular_id

    def find_conflicts(self, node_id: str) -> List[str]:
        """Return all nodes connected by a CONTRADICTS edge."""
        conflicts = []
        if node_id not in self.graph:
            return conflicts
            
        for neighbor in self.graph.neighbors(node_id):
            edge_data = self.graph.get_edge_data(node_id, neighbor)
            if edge_data.get('type') == 'CONTRADICTS':
                conflicts.append(neighbor)
                
        return conflicts

    def get_stats(self) -> Dict[str, Any]:
        """Return summary statistics for the dashboard."""
        circulars_count = len([n for n, d in self.graph.nodes(data=True) if d.get('type') == 'Circular'])
        conflicts_count = len([ (u, v) for u, v, d in self.graph.edges(data=True) if d.get('type') == 'CONTRADICTS']) // 2
        
        # Exposure Score: Heuristic based on conflict density
        # Baseline 100, deduct 5 per conflict, weighted by scale
        score = 100.0
        if circulars_count > 0:
            # More circulars = more complexity, so conflicts are more expensive
            score = max(0, 100 - (conflicts_count * 5))
            
        return {
            "total_circulars": circulars_count,
            "total_conflicts": conflicts_count,
            "exposure_score": round(score, 1)
        }

if __name__ == "__main__":
    # Smoke test
    rg = RegulatoryGraph()
    print("RegulatoryGraph initialized.")