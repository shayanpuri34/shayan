import re
from typing import Dict

ROLE_PATTERNS: Dict[str, str] = {
    "CEO": r"\b(Chief Executive Officer|CEO|Chief Executive)\b",
    "CFO": r"\b(Chief Financial Officer|CFO|Chief Financial)\b",
    "COO": r"\b(Chief Operating Officer|COO)\b",
    "President": r"\b(President)\b",
    "Operator": r"\b(Operator|Conference Call Operator|Moderator)\b",
    "Analyst": r"\b(Analyst|Research Analyst|Managing Director|Securities|Capital Markets|Equities)\b",
    "Executive": r"\b(Vice President|VP|SVP|EVP|Treasurer|General Counsel|Chief Technology Officer|CTO)\b"
}

def identify_speaker_role(speaker_name: str, title_or_context: str = "") -> str:
    """
    Identifies speaker role with strict fallback to 'UNKNOWN' if ambiguous.
    Never forces an incorrect classification.
    """
    combined = f"{speaker_name} {title_or_context}".strip()
    if not combined:
        return "UNKNOWN"

    for role, pattern in ROLE_PATTERNS.items():
        if re.search(pattern, combined, re.IGNORECASE):
            return role

    # Check for standalone tokens
    speaker_upper = speaker_name.upper()
    if "OPERATOR" in speaker_upper:
        return "Operator"
    if any(q in speaker_upper for q in ["QUESTION", "Q -", "Q:"]):
        return "Analyst"

    return "UNKNOWN"
