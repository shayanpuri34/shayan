import numpy as np
import pandas as pd
from typing import Dict, Any, List

def calculate_control_features(
    prices: pd.Series,
    volume: pd.Series,
    market_prices: pd.Series,
    event_idx: int
) -> Dict[str, float]:
    """
    Constructs lagged market and control variables ending before event_idx.
    Strictly avoids future price or volume contamination.
    """
    # Slice strictly before event date
    p_hist = prices.iloc[:event_idx]
    v_hist = volume.iloc[:event_idx]
    m_hist = market_prices.iloc[:event_idx]

    if len(p_hist) < 63:
        return {
            "momentum_5d": 0.0,
            "momentum_21d": 0.0,
            "momentum_63d": 0.0,
            "volatility_21d": 0.20,
            "volatility_63d": 0.20,
            "volume_zscore": 0.0
        }

    # Momentum: return over prior window
    mom_5d = float((p_hist.iloc[-1] / p_hist.iloc[-5]) - 1) if len(p_hist) >= 5 else 0.0
    mom_21d = float((p_hist.iloc[-1] / p_hist.iloc[-21]) - 1) if len(p_hist) >= 21 else 0.0
    mom_63d = float((p_hist.iloc[-1] / p_hist.iloc[-63]) - 1) if len(p_hist) >= 63 else 0.0

    # Volatility: annualized standard deviation of log returns
    ret = np.log(p_hist / p_hist.shift(1)).dropna()
    vol_21d = float(ret.iloc[-21:].std() * np.sqrt(252)) if len(ret) >= 21 else 0.20
    vol_63d = float(ret.iloc[-63:].std() * np.sqrt(252)) if len(ret) >= 63 else 0.20

    # Volume z-score over 63-day trailing window
    v_mean = v_hist.iloc[-63:].mean()
    v_std = v_hist.iloc[-63:].std()
    vol_zscore = float((v_hist.iloc[-1] - v_mean) / v_std) if v_std > 0 else 0.0

    return {
        "momentum_5d": mom_5d,
        "momentum_21d": mom_21d,
        "momentum_63d": mom_63d,
        "volatility_21d": vol_21d,
        "volatility_63d": vol_63d,
        "volume_zscore": vol_zscore
    }
