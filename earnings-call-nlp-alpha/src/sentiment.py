import re
from typing import Dict, List, Any
from src.logging_config import logger

# Loughran-McDonald inspired financial sentiment lexicon
LM_POSITIVE = {
    "achieve", "attain", "benefit", "boost", "capable", "confidence", "confident",
    "delighted", "effective", "efficiency", "efficient", "enhance", "excellent",
    "exceptional", "gain", "grow", "growth", "improve", "improvement", "innovation",
    "momentum", "opportunity", "outperform", "outperformance", "productive", "profitable",
    "progress", "record", "reward", "robust", "solid", "strength", "strong", "succeed",
    "success", "successful", "surpass", "sustainable", "value", "win"
}

LM_NEGATIVE = {
    "adversely", "attrition", "bottleneck", "challenge", "challenging", "closure",
    "compress", "compression", "decline", "decrease", "defect", "deficit", "delay",
    "deteriorate", "difficulty", "disadvantage", "discontinue", "dispute", "disrupt",
    "downside", "drop", "eroded", "erosion", "fail", "failure", "fall", "headwind",
    "impair", "impairment", "inability", "loss", "losses", "negative", "recession",
    "restructure", "risk", "risks", "severe", "shortfall", "sluggish", "stagnant",
    "struggle", "suffer", "turmoil", "uncertain", "unfavorable", "vulnerable", "weak", "weakness"
}

def compute_dictionary_sentiment(text: str) -> Dict[str, float]:
    """Calculates Loughran-McDonald based financial sentiment metrics."""
    words = re.findall(r"\b[a-z]+\b", text.lower())
    total_words = len(words)
    if total_words == 0:
        return {"pos_ratio": 0.0, "neg_ratio": 0.0, "net_sentiment": 0.0, "total_words": 0}

    pos_count = sum(1 for w in words if w in LM_POSITIVE)
    neg_count = sum(1 for w in words if w in LM_NEGATIVE)

    pos_ratio = pos_count / total_words
    neg_ratio = neg_count / total_words
    # Standardized net sentiment in [-1, +1]
    denom = pos_count + neg_count
    net_sentiment = (pos_count - neg_count) / denom if denom > 0 else 0.0

    return {
        "pos_ratio": pos_ratio,
        "neg_ratio": neg_ratio,
        "net_sentiment": net_sentiment,
        "total_words": total_words
    }

def analyze_section_sentiments(processed_sections: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Computes sentiment separately for:
    - Management (CEO, CFO, Execs)
    - Analysts
    - Prepared Remarks
    - Q&A
    """
    mgmt_text = []
    analyst_text = []
    prepared_text = []
    qa_text = []

    for sec in processed_sections:
        raw = sec.get("raw_text", "")
        role = sec.get("role", "UNKNOWN")
        section = sec.get("section", "UNKNOWN")

        if any(mgmt in role for mgmt in ["CEO", "CFO", "Executive", "President"]):
            mgmt_text.append(raw)
        elif role == "Analyst":
            analyst_text.append(raw)

        if section == "PREPARED_REMARKS":
            prepared_text.append(raw)
        elif section == "Q_AND_A":
            qa_text.append(raw)

    s_mgmt = compute_dictionary_sentiment(" ".join(mgmt_text))["net_sentiment"]
    s_analyst = compute_dictionary_sentiment(" ".join(analyst_text))["net_sentiment"]
    s_prep = compute_dictionary_sentiment(" ".join(prepared_text))["net_sentiment"]
    s_qa = compute_dictionary_sentiment(" ".join(qa_text))["net_sentiment"]

    return {
        "sentiment_mgmt": s_mgmt,
        "sentiment_analyst": s_analyst,
        "sentiment_prepared": s_prep,
        "sentiment_qa": s_qa,
        "sentiment_overall": compute_dictionary_sentiment(" ".join([s.get("raw_text", "") for s in processed_sections]))["net_sentiment"]
    }
