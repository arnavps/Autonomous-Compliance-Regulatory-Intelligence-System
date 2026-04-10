import difflib
import json
import logging
from typing import Dict, Any, List

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def generate_regulatory_diff(old_text: str, new_text: str) -> Dict[str, Any]:
    """
    Compares two regulatory texts and generates a structured JSON diff.
    Focuses on insertions and deletions at a paragraph/line level.
    """
    # Split into lines for comparison
    old_lines = old_text.splitlines()
    new_lines = new_text.splitlines()
    
    # Use SequenceMatcher for granular opcodes
    matcher = difflib.SequenceMatcher(None, old_lines, new_lines)
    
    changes = []
    summary = {"additions": 0, "deletions": 0, "modifications": 0}
    
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == 'insert':
            for line in new_lines[j1:j2]:
                if line.strip():
                    changes.append({"type": "addition", "text": line.strip()})
                    summary["additions"] += 1
        elif tag == 'delete':
            for line in old_lines[i1:i2]:
                if line.strip():
                    changes.append({"type": "deletion", "text": line.strip()})
                    summary["deletions"] += 1
        elif tag == 'replace':
            # For 'replace', we could show it as a pair, but for RAG mapping, 
            # we treat it as an addition and deletion
            for line in old_lines[i1:i2]:
                if line.strip():
                    changes.append({"type": "deletion", "text": line.strip()})
                    summary["deletions"] += 1
            for line in new_lines[j1:j2]:
                if line.strip():
                    changes.append({"type": "addition", "text": line.strip()})
                    summary["additions"] += 1
            summary["modifications"] += 1

    result = {
        "summary": summary,
        "changes": changes
    }
    
    logger.info(f"Diff generated: {summary['additions']} additions, {summary['deletions']} deletions.")
    return result

if __name__ == "__main__":
    # Smoke test
    old = "Banks must verify customer identity physically.\nFee is 500 INR."
    new = "Banks must verify customer identity via V-CIP.\nFee is 1000 INR."
    print(json.dumps(generate_regulatory_diff(old, new), indent=2))