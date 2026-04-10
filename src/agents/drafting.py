import logging
import json
from typing import Dict, Any, List
from src.engine.prompts import PromptRegistry

# Imagine we have an LLM caller here. 
# For the hackathon, we simulate the LLM call or use the existing config.
from src.utils.llm_config import get_llm

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DraftingAgent:
    def __init__(self):
        """Initialize the drafting agent with LLM capabilities."""
        self.llm = get_llm()

    def draft_amendment(
        self, 
        internal_clause: str, 
        change_text: str, 
        reg_context: str,
        upstream_confidence: float = 100.0
    ) -> Dict[str, Any]:
        """
        Generates a proposed amendment for an internal policy clause.
        """
        logger.info(f"Drafting amendment for clause: {internal_clause[:50]}...")
        
        # Prepare the prompt
        prompt = PromptRegistry.LEGAL_DRAFTING_PROMPT.format(
            internal_clause=internal_clause,
            change_text=change_text,
            reg_context=reg_context
        )
        
        # Call LLM (simulated or real)
        # In a real system: response = self.llm.invoke(prompt)
        # For the demo, we simulate a high-quality legal rewrite if LLM is offline
        try:
            # Attempt real LLM call if available
            raw_response = self.llm.invoke(prompt)
            # LLM usually returns a string for this prompt
            proposed_text = raw_response.content if hasattr(raw_response, 'content') else str(raw_response)
        except Exception as e:
            logger.warning(f"LLM call failed: {e}. Falling back to template-based drafting.")
            proposed_text = f"[DRAFT] {internal_clause} (Updated per {change_text})"

        # Human Review Logic
        human_review_required = upstream_confidence < 80.0
        
        result = {
            "original_clause": internal_clause,
            "proposed_amendment": proposed_text.strip(),
            "regulatory_change": change_text,
            "human_review_required": human_review_required,
            "confidence_score": upstream_confidence
        }
        
        logger.info(f"Drafting complete. Review Required: {human_review_required}")
        return result

if __name__ == "__main__":
    # Smoke test
    agent = DraftingAgent()
    res = agent.draft_amendment(
        "Customers must verify identity physically.",
        "RBI/2024/001 allows V-CIP.",
        "Full context text about V-CIP...",
        upstream_confidence=75.0
    )
    print(json.dumps(res, indent=2))