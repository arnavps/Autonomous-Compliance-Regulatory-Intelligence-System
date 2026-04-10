import logging
from typing import List, Dict, Any
from langchain_core.documents import Document
from src.engine.retriever import VectorEngine

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MappingAgent:
    def __init__(self, internal_vector_engine: VectorEngine):
        """
        Initialize the mapping agent with access to internal bank policies.
        """
        self.vector_engine = internal_vector_engine

    def map_impact_to_policies(self, diff_results: Dict[str, Any], taxonomy_filter: str = "") -> List[Dict[str, Any]]:
        """
        Maps regulatory changes to affected internal policies.
        Only processes 'addition' and 'deletion' types as they represent substantive impacts.
        """
        impact_links = []
        changes = diff_results.get("changes", [])
        
        if not changes:
            logger.info("No substantive changes to map to internal policies.")
            return []

        # We combine relevant changes into a search query or process them one by one.
        # For granular mapping, we process each change block.
        for change in changes:
            change_text = change.get("text", "")
            if not change_text:
                continue
                
            logger.info(f"Mapping impact for {change['type']}: {change_text[:50]}...")
            
            # Perform semantic search on internal policies
            # We use the generic retrieve_context but we could refine it for internal docs
            policy_matches = self.vector_engine.retrieve_context(change_text, top_k=3)
            
            for policy in policy_matches:
                # Apply taxonomy filter if provided
                policy_taxonomy = policy.metadata.get("taxonomy", "")
                if taxonomy_filter and taxonomy_filter.lower() not in policy_taxonomy.lower():
                    continue
                    
                impact_links.append({
                    "change_fragment": change_text[:100] + "...",
                    "internal_policy_id": policy.metadata.get("policy_id", "Unknown"),
                    "internal_policy_title": policy.metadata.get("title", "Untitled Policy"),
                    "relevance_score": "High", # In a real system, we'd use the distance score
                    "suggested_action": "Review for Update" if change["type"] == "addition" else "Review for Redundancy"
                })

        # Deduplicate results per policy
        unique_impacts = {}
        for link in impact_links:
            pid = link["internal_policy_id"]
            if pid not in unique_impacts:
                unique_impacts[pid] = link
                
        return list(unique_impacts.values())

def seed_internal_policies(engine: VectorEngine):
    """
    Helper to seed the internal policy collection with mock documents for the demo.
    """
    mock_policies = [
        Document(
            page_content="Policy ID: KYC-001. All new customers must undergo Video-based Customer Identification Process (V-CIP) as per RBI guidelines.",
            metadata={"policy_id": "KYC-001", "title": "Customer Onboarding Policy", "taxonomy": "KYC"}
        ),
        Document(
            page_content="Policy ID: LEND-099. Digital lending rates are calculated using the reducing balance method. Late fees are capped.",
            metadata={"policy_id": "LEND-099", "title": "Digital Lending Operations", "taxonomy": "Lending"}
        ),
        Document(
            page_content="Policy ID: DATA-SEC. Biometric data acquired during KYC must be encrypted using AES-256 and stored in high-security zones.",
            metadata={"policy_id": "DATA-SEC", "title": "Data Security & Privacy", "taxonomy": "Security, KYC"}
        )
    ]
    logger.info("Seeding internal policies into vector store...")
    engine.add_documents(mock_policies)

if __name__ == "__main__":
    # Smoke test (requires VectorEngine)
    pass