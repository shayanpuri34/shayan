import numpy as np
import pandas as pd
from typing import Dict, Any

def generate_percentile_signals(
    score_series: pd.Series,
    upper_percentile: float = 0.80,
    lower_percentile: float = 0.20
) -> pd.Series:
    """
    Generates ternary signals {LONG: 1, FLAT: 0, SHORT: -1} using rank percentiles.
    Top quantile -> LONG (+1)
    Bottom quantile -> SHORT (-1)
    Middle -> FLAT (0)
    """
    ranks = score_series.rank(pct=True)
    signals = pd.Series(0, index=score_series.index)
    signals[ranks >= upper_percentile] = 1
    signals[ranks <= lower_percentile] = -1
    return signals

def generate_combined_signals(
    df: pd.DataFrame,
    mnds_weight: float = 0.60,
    sentiment_weight: float = 0.20,
    ml_weight: float = 0.20
) -> pd.Series:
    """Blends proprietary MNDS signal with sentiment and machine learning predictions."""
    z_mnds = (df["mnds_score"] - df["mnds_score"].mean()) / (df["mnds_score"].std() or 1.0)
    z_sent = (df["sentiment_current"] - df["sentiment_current"].mean()) / (df["sentiment_current"].std() or 1.0)
    z_ml = (df["ml_predicted_return"] - df["ml_predicted_return"].mean()) / (df["ml_predicted_return"].std() or 1.0)

    composite = (mnds_weight * z_mnds) + (sentiment_weight * z_sent) + (ml_weight * z_ml)
    return generate_percentile_signals(composite)
