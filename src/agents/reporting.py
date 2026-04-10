import os
import logging
from datetime import datetime, date
from typing import Dict, Any, List

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ReportingAgent:
    def __init__(self, output_dir: str = "reports"):
        """Initialize the reporting agent."""
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def _calculate_urgency(self, effective_date_str: str) -> str:
        """
        Calculates urgency based on the effective date.
        HIGH: <= 15 days
        MEDIUM: <= 45 days
        LOW: > 45 days
        """
        if not effective_date_str or effective_date_str == "N/A":
            return "MEDIUM (Unspecified Deadline)"
            
        try:
            # Assume YYYY-MM-DD
            target_date = datetime.strptime(effective_date_str, "%Y-%m-%d").date()
            today = date.today()
            days_diff = (target_date - today).days
            
            if days_diff <= 15:
                return "HIGH"
            elif days_diff <= 45:
                return "MEDIUM"
            else:
                return "LOW"
        except Exception:
            return "MEDIUM (Parsing Error)"

    def generate_impact_report(self, data_package: Dict[str, Any]) -> str:
        """
        Generates a 7-section Impact Report in Markdown format.
        Sections: Summary, details, scope, amendments, urgency, risk, audit.
        """
        circular_id = data_package.get("metadata", {}).get("circular_id", "Unknown")
        report_id = f"Impact_Report_{circular_id.replace('/', '_')}_{datetime.now().strftime('%Y%m%d_%H%M')}"
        file_path = os.path.join(self.output_dir, f"{report_id}.md")
        
        metadata = data_package.get("metadata", {})
        diff = data_package.get("diff", {})
        mapping = data_package.get("impacted_policies", [])
        drafts = data_package.get("proposed_amendments", [])
        confidence = data_package.get("confidence", {})
        
        urgency = self._calculate_urgency(metadata.get("effective_date", "N/A"))

        report_content = f"""# Regulatory Impact Report: {metadata.get('title', 'Untitled')}
**Circular ID:** {circular_id}
**Issuing Authority:** {metadata.get('issuing_body', 'N/A')}
**Report Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Compliance Urgency:** {urgency}

---

## 1. Executive Summary
This report analyzes the impact of {circular_id} on bank operations. The primary change involves {diff.get('summary', {}).get('modifications', 0)} modifications and {diff.get('summary', {}).get('additions', 0)} new requirements discovered.

## 2. Regulatory Change Details (Diff)
The following substantive text changes were identified:
"""
        for change in diff.get("changes", []):
            report_content += f"- **{change['type'].upper()}**: {change['text']}\n"

        report_content += """
## 3. Internal Impact Scope
The following internal policies were found to be potentially at risk or redundant:
"""
        for policy in mapping:
            report_content += f"- **[{policy['internal_policy_id']}]** {policy['internal_policy_title']} (Relevance: {policy['relevance_score']})\n"

        report_content += """
## 4. Proposed Policy Amendments
The Drafting Agent has generated the following proposed rewrites for compliance:
"""
        for draft in drafts:
            status = "⚠️ HUMAN REVIEW REQUIRED" if draft.get("human_review_required") else "✅ AUTO-GENERATED"
            report_content += f"### Clause: {draft['original_clause']}\n"
            report_content += f"**Status:** {status}\n\n"
            report_content += f"> {draft['proposed_amendment']}\n\n"

        report_content += f"""
## 5. Compliance Roadmap & Urgency
- **Effective Date:** {metadata.get('effective_date', 'N/A')}
- **Priority Level:** {urgency}
- **Baseline Requirement:** Immediate update to {len(mapping)} documentation nodes.

## 6. Risk Assessment & Safety Gate
- **AI Confidence Score:** {confidence.get('score', 'N/A')}%
- **Gate Status:** {confidence.get('status', 'N/A')}
- **Signals:** Retrieval({confidence.get('signals', {}).get('retrieval', 0)}), Relevance({confidence.get('signals', {}).get('relevance', 0)}), Faithfulness({confidence.get('signals', {}).get('faithfulness', 0)})

## 7. Audit Trail
- **Scraped At:** {metadata.get('scraped_at', 'N/A')}
- **Processor:** RegIntel AI Autonomous Logic Engine
- **Report Hash:** {hash(report_content)}
"""
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(report_content)
            
        logger.info(f"Impact Report generated successfully at {file_path}")
        return file_path

if __name__ == "__main__":
    # Smoke test
    agent = ReportingAgent()
    mock_data = {
        "metadata": {"circular_id": "RBI/2024/001", "title": "V-CIP Update", "effective_date": "2024-04-20"},
        "diff": {"summary": {"additions": 1}, "changes": [{"type": "addition", "text": "V-CIP is mandatory"}]},
        "impacted_policies": [{"internal_policy_id": "KYC-01", "internal_policy_title": "KYC Policy", "relevance_score": "High"}],
        "proposed_amendments": [{"original_clause": "Physical KYC only", "proposed_amendment": "V-CIP and Physical KYC", "human_review_required": True}],
        "confidence": {"score": 75, "status": "LOW_CONFIDENCE"}
    }
    agent.generate_impact_report(mock_data)