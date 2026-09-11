import re
from typing import List, Dict, Any, Tuple
from src.speakers import identify_speaker_role

BOILERPLATE_PATTERNS = [
    r"safe harbor statement",
    r"forward-looking statements",
    r"actual results could differ materially",
    r"please refer to our sec filings",
    r"reconciliation of non-gaap financial measures",
    r"this conference call is being recorded",
    r"good morning and welcome to",
    r"i would now like to turn the call over to"
]

def split_sentences(text: str) -> List[str]:
    """Splits text into cleaned sentences preserving financial abbreviations like U.S. or Inc."""
    if not text:
        return []
    # Normalize common abbreviations to protect periods
    normalized = text.replace("e.g.", "eg").replace("i.e.", "ie").replace("vs.", "vs").replace("Inc.", "Inc")
    raw_sentences = re.split(r"(?<=[.!?])\s+", normalized)
    return [s.strip() for s in raw_sentences if len(s.strip()) > 10]

def is_boilerplate(sentence: str) -> bool:
    """Detects standard safe-harbor and introductory conference call boilerplate."""
    lower = sentence.lower()
    for pat in BOILERPLATE_PATTERNS:
        if re.search(pat, lower):
            return True
    return False

def segment_transcript_sections(entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Classifies each segment into PREPARED_REMARKS or Q_AND_A based on cues.
    If the split boundary cannot be identified, marks section as UNKNOWN.
    """
    in_qa = False
    qa_trigger_patterns = [
        r"\bquestions?\s+and\s+answers?\b",
        r"\bopen\s+(the\s+line\s+for|for)\s+questions\b",
        r"\bfirst\s+question\s+comes\s+from\b",
        r"\bfloor\s+for\s+questions\b",
        r"\bq&a\s+session\b"
    ]

    processed = []
    for entry in entries:
        speaker = entry.get("speaker", "UNKNOWN")
        text = entry.get("text", "")
        role = entry.get("role", identify_speaker_role(speaker))

        # Check for section transition
        for pat in qa_trigger_patterns:
            if re.search(pat, text, re.IGNORECASE) or re.search(pat, speaker, re.IGNORECASE):
                in_qa = True
                break

        section = "Q_AND_A" if in_qa else "PREPARED_REMARKS"
        if not in_qa and role == "Analyst":
            # If an analyst is speaking, we are definitively in Q&A
            in_qa = True
            section = "Q_AND_A"

        sentences = split_sentences(text)
        filtered_sentences = [s for s in sentences if not is_boilerplate(s)]

        processed.append({
            "speaker": speaker,
            "role": role,
            "section": section,
            "raw_text": text,
            "cleaned_sentences": filtered_sentences,
            "word_count": len(text.split())
        })

    return processed
