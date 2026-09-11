import re
from typing import Dict, Any

UNCERTAINTY_LEXICON = {
    "may", "might", "could", "uncertain", "uncertainty", "uncertainties", "challenging",
    "risk", "risks", "risky", "potentially", "possible", "possibly", "depending",
    "unpredictable", "volatile", "fluctuate", "approximate", "indefinite", "tentative",
    "contingent", "doubt", "doubtful", "unresolved"
}

CONFIDENCE_LEXICON = {
    "will", "shall", "expect", "expected", "committed", "commitment", "remain", "remains",
    "continue", "continues", "confident", "confidence", "strong", "strongly", "conviction",
    "guarantee", "assure", "definite", "definitely", "disciplined", "unwavering", "milestone"
}

def compute_linguistic_features(text: str) -> Dict[str, float]:
    """Computes uncertainty and confidence frequency counts and normalized rates."""
    words = re.findall(r"\b[a-z]+\b", text.lower())
    total_words = len(words)
    if total_words == 0:
        return {
            "uncertainty_count": 0,
            "uncertainty_rate": 0.0,
            "confidence_count": 0,
            "confidence_rate": 0.0,
            "confidence_to_uncertainty_ratio": 1.0
        }

    unc_count = sum(1 for w in words if w in UNCERTAINTY_LEXICON)
    conf_count = sum(1 for w in words if w in CONFIDENCE_LEXICON)

    unc_rate = unc_count / total_words
    conf_rate = conf_count / total_words

    ratio = (conf_count + 1) / (unc_count + 1)

    return {
        "uncertainty_count": unc_count,
        "uncertainty_rate": unc_rate,
        "confidence_count": conf_count,
        "confidence_rate": conf_rate,
        "confidence_to_uncertainty_ratio": ratio
    }
