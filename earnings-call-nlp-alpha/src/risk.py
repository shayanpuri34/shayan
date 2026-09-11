import numpy as np
import pandas as pd
from typing import Dict, Any

def compute_risk_metrics(returns: np.ndarray, alpha_levels: List[float] = [0.05, 0.01]) -> Dict[str, float]:
    """
    Computes parametric and historical Value-at-Risk (VaR) and
    Conditional Value-at-Risk (CVaR / Expected Shortfall).
    """
    clean_rets = returns[~np.isnan(returns)]
    if len(clean_rets) == 0:
        return {"var_95": 0.0, "cvar_95": 0.0, "var_99": 0.0, "cvar_99": 0.0}

    # Historical VaR and CVaR
    var_95 = float(np.percentile(clean_rets, 5.0))
    cvar_95 = float(clean_rets[clean_rets <= var_95].mean()) if len(clean_rets[clean_rets <= var_95]) > 0 else var_95

    var_99 = float(np.percentile(clean_rets, 1.0))
    cvar_99 = float(clean_rets[clean_rets <= var_99].mean()) if len(clean_rets[clean_rets <= var_99]) > 0 else var_99

    return {
        "var_95": var_95,
        "cvar_95": cvar_95,
        "var_99": var_99,
        "cvar_99": cvar_99,
        "skewness": float(pd.Series(clean_rets).skew()),
        "kurtosis": float(pd.Series(clean_rets).kurtosis())
    }

def compute_drawdown_duration(equity_curve: np.ndarray) -> int:
    """Calculates max duration in periods that portfolio stayed underwater."""
    running_max = np.maximum.accumulate(equity_curve)
    underwater = equity_curve < running_max
    max_duration = 0
    current_duration = 0
    for is_under in underwater:
        if is_under:
            current_duration += 1
            if current_duration > max_duration:
                max_duration = current_duration
        else:
            current_duration = 0
    return max_duration
