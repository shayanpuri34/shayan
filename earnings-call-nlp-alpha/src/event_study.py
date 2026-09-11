import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from scipy import stats
from src.logging_config import logger

class EventStudyEngine:
    """
    Implements standard financial market model event study methodology:
    R_{i,t} = alpha_i + beta_i * R_{m,t} + epsilon_{i,t}
    Estimated over [-252, -30] trading day window.
    Computes AR, CAR[-1,+1], CAR[0,+1], CAR[0,+5], CAR[0,+20], CAAR, and t-statistics.
    """
    def __init__(self, estimation_window: Tuple[int, int] = (-252, -30)):
        self.est_start, self.est_end = estimation_window

    def fit_market_model(self, stock_returns: pd.Series, market_returns: pd.Series) -> Dict[str, float]:
        """Estimates market model parameters (alpha, beta, residual variance)."""
        clean_df = pd.concat([stock_returns, market_returns], axis=1).dropna()
        if len(clean_df) < 30:
            logger.warning(f"Insufficient estimation history ({len(clean_df)} observations). Using default CAPM beta=1.0.")
            return {"alpha": 0.0, "beta": 1.0, "sigma_eps": 0.02}

        y = clean_df.iloc[:, 0].values
        x = clean_df.iloc[:, 1].values

        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
        residuals = y - (intercept + slope * x)
        sigma_eps = float(np.std(residuals, ddof=2))

        return {
            "alpha": float(intercept),
            "beta": float(slope),
            "sigma_eps": max(1e-4, sigma_eps),
            "r_squared": float(r_value ** 2)
        }

    def compute_car(
        self,
        stock_returns: pd.Series,
        market_returns: pd.Series,
        alpha: float,
        beta: float,
        event_idx: int,
        window: Tuple[int, int]
    ) -> float:
        """Computes Cumulative Abnormal Return (CAR) for an event window relative to event index."""
        w_start, w_end = window
        start_pos = event_idx + w_start
        end_pos = event_idx + w_end + 1

        if start_pos < 0 or end_pos > len(stock_returns):
            return 0.0

        r_stock = stock_returns.iloc[start_pos:end_pos].values
        r_market = market_returns.iloc[start_pos:end_pos].values

        expected_return = alpha + beta * r_market
        abnormal_return = r_stock - expected_return
        return float(np.sum(abnormal_return))

    @staticmethod
    def compute_caar_stats(car_series: pd.Series) -> Dict[str, Any]:
        """Calculates Average CAR (CAAR), standard error, t-stat, and p-value."""
        n = len(car_series.dropna())
        if n == 0:
            return {"caar": 0.0, "t_stat": 0.0, "p_val": 1.0}
        caar = float(car_series.mean())
        std_err = float(car_series.std() / np.sqrt(n)) if n > 1 else 0.01
        t_stat = caar / std_err if std_err > 0 else 0.0
        p_val = float(2 * (1 - stats.t.cdf(abs(t_stat), df=n - 1)))
        return {
            "caar": caar,
            "std_err": std_err,
            "t_stat": t_stat,
            "p_val": p_val,
            "n": n
        }
