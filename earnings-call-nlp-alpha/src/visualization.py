from typing import Dict, Any, List
import pandas as pd
import numpy as np

def build_what_changed_dashboard_spec(
    ticker: str,
    quarter: str,
    event_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Constructs the data specification for the interactive
    'WHAT CHANGED IN MANAGEMENT'S STORY?' comparative dashboard.
    """
    return {
        "company": {
            "ticker": ticker,
            "quarter": quarter,
            "transcript_date": event_data.get("date", "N/A"),
            "market_cap": event_data.get("marketCap", 0)
        },
        "earnings": {
            "eps_actual": event_data.get("epsActual", 0.0),
            "eps_estimate": event_data.get("epsEstimate", 0.0),
            "eps_surprise": event_data.get("epsSurprise", 0.0),
            "rev_actual": event_data.get("revActual", 0.0),
            "rev_estimate": event_data.get("revEstimate", 0.0),
            "rev_surprise": event_data.get("revSurprise", 0.0)
        },
        "language": {
            "current_sentiment": event_data.get("sentimentCurrent", 0.0),
            "previous_sentiment": event_data.get("sentimentPrior", 0.0),
            "sentiment_delta": event_data.get("sentimentDelta", 0.0),
            "current_uncertainty": event_data.get("uncertaintyCurrent", 0.0),
            "previous_uncertainty": event_data.get("uncertaintyPrior", 0.0),
            "uncertainty_delta": event_data.get("uncertaintyDelta", 0.0)
        },
        "confidence": {
            "current_confidence": event_data.get("confidenceCurrent", 0.0),
            "previous_confidence": event_data.get("confidencePrior", 0.0),
            "confidence_delta": event_data.get("confidenceDelta", 0.0)
        },
        "semantics": {
            "narrative_similarity": event_data.get("semanticSimilarityPrior", 0.0),
            "narrative_shock": event_data.get("narrativeShock", 0.0)
        },
        "topics": {
            "new_topics": event_data.get("newTopics", []),
            "disappearing_topics": event_data.get("disappearingTopics", []),
            "accelerating_topics": event_data.get("acceleratingTopics", []),
            "declining_topics": event_data.get("decliningTopics", [])
        },
        "qa": {
            "prepared_sentiment": event_data.get("preparedSentiment", 0.0),
            "qa_sentiment": event_data.get("qaSentiment", 0.0),
            "qa_divergence": event_data.get("qaSentimentDivergence", 0.0),
            "prepared_uncertainty": event_data.get("preparedUncertainty", 0.0),
            "qa_uncertainty": event_data.get("qaUncertainty", 0.0)
        },
        "final_signal": {
            "mnds_score": event_data.get("mndsScore", 0.0),
            "mnds_percentile": event_data.get("mndsPercentile", 50.0),
            "signal": event_data.get("mndsSignal", "FLAT"),
            "ml_predicted_return": event_data.get("mlPredictedReturn", 0.0),
            "actual_return": event_data.get("actual5dReturn", 0.0)
        }
    }
