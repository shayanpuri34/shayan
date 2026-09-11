import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from src.config import CONFIG
from src.logging_config import logger

FALLBACK_UNIVERSE = [
    "AAPL", "MSFT", "AMZN", "GOOGL", "META", "NVDA",
    "JPM", "BAC", "XOM", "CVX", "WMT", "COST"
]

def get_research_universe(mode: str = "DEMO") -> List[str]:
    """Returns ticker universe according to active run mode."""
    if mode == "DEMO":
        return ["NVDA", "MSFT", "AAPL", "AMZN", "META", "JPM", "XOM", "WMT"]
    return CONFIG.get("universe", {}).get("primary", FALLBACK_UNIVERSE)

def create_synthetic_test_event(ticker: str, quarter: str) -> Dict[str, Any]:
    """Creates a deterministic synthetic earnings event labeled explicitly for unit testing."""
    return {
        "ticker": ticker,
        "quarter": quarter,
        "transcript_date": "2024-11-20",
        "eps_actual": 0.81,
        "eps_estimate": 0.75,
        "eps_surprise": 8.0,
        "rev_actual": 35.08,
        "rev_estimate": 33.16,
        "rev_surprise": 5.79,
        "sentiment_current": 0.65,
        "sentiment_prior": 0.50,
        "sentiment_delta": 1.25,
        "uncertainty_delta": -1.10,
        "narrative_shock": 0.22,
        "topic_delta_js": 0.18,
        "confidence_delta": 1.40,
        "qa_sentiment_divergence": 0.12,
        "car_0_5": 0.085,
        "return_5d": 0.088,
        "signal": 1,
        "is_synthetic_test_data": True
    }
