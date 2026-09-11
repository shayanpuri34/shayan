import numpy as np
import pandas as pd
from typing import Dict, Any, List

def construct_portfolio_weights(
    signals: pd.Series,
    portfolio_type: str = "DOLLAR_NEUTRAL",
    max_position: float = 0.02,
    max_gross: float = 1.00
) -> pd.Series:
    """
    Constructs normalized portfolio weights given signals.
    - DOLLAR_NEUTRAL: Long weights sum to +0.50, Short weights sum to -0.50 (Gross = 1.00, Net = 0.00).
    - LONG_ONLY: Long weights sum to 1.00 (Gross = 1.00, Net = 1.00).
    """
    weights = pd.Series(0.0, index=signals.index)
    long_mask = signals > 0
    short_mask = signals < 0

    n_long = long_mask.sum()
    n_short = short_mask.sum()

    if portfolio_type == "DOLLAR_NEUTRAL":
        if n_long > 0:
            weights[long_mask] = (max_gross / 2.0) / n_long
        if n_short > 0:
            weights[short_mask] = -(max_gross / 2.0) / n_short
    elif portfolio_type == "LONG_ONLY":
        if n_long > 0:
            weights[long_mask] = max_gross / n_long

    # Apply individual position limit cap
    weights = weights.clip(lower=-max_position, upper=max_position)
    return weights
