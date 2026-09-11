import numpy as np
import pandas as pd
from typing import Dict, Any, List
from src.backtest import simulate_event_backtest

def run_transaction_cost_sensitivity(
    trade_events: pd.DataFrame,
    cost_levels_bps: List[float] = [0.0, 5.0, 10.0, 25.0, 50.0],
    holding_days: int = 5
) -> pd.DataFrame:
    """Evaluates strategy performance decay across increasing execution cost levels."""
    records = []
    for bps in cost_levels_bps:
        res = simulate_event_backtest(trade_events, cost_bps=bps, holding_days=holding_days)
        records.append({
            "cost_bps": bps,
            "cagr": res.get("cagr", 0.0),
            "sharpe_ratio": res.get("sharpe_ratio", 0.0),
            "max_drawdown": res.get("max_drawdown", 0.0),
            "win_rate": res.get("win_rate", 0.0),
            "profit_factor": res.get("profit_factor", 0.0)
        })
    return pd.DataFrame(records)

def run_holding_period_sensitivity(
    trade_events: pd.DataFrame,
    holding_periods: List[int] = [1, 5, 10, 20],
    cost_bps: float = 10.0
) -> pd.DataFrame:
    """Evaluates strategy performance across varying post-announcement holding horizons."""
    records = []
    for hp in holding_periods:
        res = simulate_event_backtest(trade_events, cost_bps=cost_bps, holding_days=hp)
        records.append({
            "holding_days": hp,
            "cagr": res.get("cagr", 0.0),
            "sharpe_ratio": res.get("sharpe_ratio", 0.0),
            "sortino_ratio": res.get("sortino_ratio", 0.0),
            "max_drawdown": res.get("max_drawdown", 0.0),
            "win_rate": res.get("win_rate", 0.0)
        })
    return pd.DataFrame(records)
