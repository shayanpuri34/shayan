import json
import re
from pathlib import Path
from typing import Any, Dict, List
from src.logging_config import logger
from src.api_utils import fetch_transcript

def validate_transcript(raw_data: Dict[str, Any], min_words: int = 500) -> Dict[str, Any]:
    """
    Validates transcript structure, minimum text length, field completeness,
    and returns a quality report.
    """
    report = {
        "valid": False,
        "ticker": raw_data.get("symbol", raw_data.get("ticker", "UNKNOWN")),
        "quarter": raw_data.get("quarter", "UNKNOWN"),
        "word_count": 0,
        "speaker_count": 0,
        "management_word_count": 0,
        "qa_word_count": 0,
        "issues": []
    }

    transcript_list = raw_data.get("transcript", [])
    if not transcript_list or not isinstance(transcript_list, list):
        report["issues"].append("Empty or malformed transcript field")
        return report

    unique_speakers = set()
    total_words = 0
    mgmt_words = 0
    qa_words = 0

    for entry in transcript_list:
        speaker = entry.get("speaker", "UNKNOWN")
        unique_speakers.add(speaker)
        text = entry.get("text", "")
        words = len(text.split())
        total_words += words

        role = entry.get("role", "").upper()
        if any(exec_title in role for exec_title in ["CEO", "CFO", "COO", "PRESIDENT", "EXECUTIVE"]):
            mgmt_words += words

        section = entry.get("section", "").upper()
        if "Q" in section or "QA" in section:
            qa_words += words

    report["word_count"] = total_words
    report["speaker_count"] = len(unique_speakers)
    report["management_word_count"] = mgmt_words
    report["qa_word_count"] = qa_words

    if total_words < min_words:
        report["issues"].append(f"Insufficient word count: {total_words} < {min_words}")
    elif len(unique_speakers) < 2:
        report["issues"].append("Less than 2 distinct speakers identified")
    else:
        report["valid"] = True

    return report

def clean_transcript_text(raw_text: str) -> str:
    """Removes HTML tags, multiple spaces, non-breaking spaces, and normalize encoding."""
    if not raw_text:
        return ""
    text = re.sub(r"<[^>]+>", " ", raw_text)
    text = text.replace("\u00a0", " ").replace("\r", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text

def download_transcript_history(
    tickers: List[str],
    quarters: List[str],
    cache_dir: Path = Path("data/raw/transcripts")
) -> Dict[str, Dict[str, Any]]:
    """Downloads and caches quarterly transcript history across universe."""
    cache_dir.mkdir(parents=True, exist_ok=True)
    results = {}
    for ticker in tickers:
        results[ticker] = {}
        for quarter in quarters:
            try:
                data = fetch_transcript(ticker, quarter, cache_dir=cache_dir)
                val = validate_transcript(data)
                results[ticker][quarter] = {
                    "data": data,
                    "validation": val
                }
                logger.info(f"Loaded {ticker} {quarter}: valid={val['valid']} (words={val['word_count']})")
            except Exception as exc:
                logger.error(f"Failed loading transcript for {ticker} {quarter}: {exc}")
                results[ticker][quarter] = {"data": {}, "validation": {"valid": False, "issues": [str(exc)]}}
    return results
