import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from src.logging_config import logger

def simulate_event_backtest(
    trade_events: pd.DataFrame,
    cost_bps: float = 10.0,
    holding_days: int = 5,
    risk_free_rate: float = 0.04
) -> Dict[str, Any]:
    """
    Simulates event-driven trades with execution lagging and transaction cost accounting.
    Net Return = Gross Return - (2 * cost_bps / 10,000)
    """
    df = trade_events.copy()
    if df.empty:
        return {"status": "NO_TRADES"}

    # Transaction cost in decimal
    tc = (2.0 * cost_bps) / 10000.0

    # Trade return: sign(signal) * return_period - tc
    df["trade_gross_return"] = df["signal"] * df[f"return_{holding_days}d"]
    df["trade_net_return"] = np.where(df["signal"] != 0, df["trade_gross_return"] - tc, 0.0)

    # Performance metrics
    active_trades = df[df["signal"] != 0]
    n_trades = len(active_trades)

    if n_trades == 0:
        return {"status": "ZERO_SIGNALS"}

    net_returns = active_trades["trade_net_return"].values
    win_trades = net_returns[net_returns > 0]
    loss_trades = net_returns[net_returns < 0]

    win_rate = len(win_trades) / n_trades if n_trades > 0 else 0.0
    gross_gains = win_trades.sum() if len(win_trades) > 0 else 0.0
    gross_losses = abs(loss_trades.sum()) if len(loss_trades) > 0 else 1e-4
    profit_factor = gross_gains / gross_losses

    # Annualized statistics assuming 252 trading days / holding period
    periods_per_year = 252.0 / holding_days
    mean_ret = float(np.mean(net_returns))
    std_ret = float(np.std(net_returns, ddof=1)) if len(net_returns) > 1 else 0.01

    ann_return = mean_ret * periods_per_year
    ann_vol = std_ret * np.sqrt(periods_per_year)
    sharpe = (ann_return - risk_free_rate) / ann_vol if ann_vol > 0 else 0.0

    # Downside deviation for Sortino
    downside_rets = net_returns[net_returns < 0]
    downside_vol = (np.std(downside_rets) * np.sqrt(periods_per_year)) if len(downside_rets) > 1 else 0.01
    sortino = (ann_return - risk_free_rate) / downside_vol if downside_vol > 0 else 0.0

    # Cumulative equity curve & Max Drawdown
    equity = np.cumprod(1.0 + net_returns)
    running_max = np.maximum.accumulate(equity)
    drawdowns = (equity - running_max) / running_max
    max_dd = float(np.min(drawdowns)) if len(drawdowns) > 0 else 0.0
    calmar = ann_return / abs(max_dd) if abs(max_dd) > 0 else 0.0

    return {
        "n_trades": n_trades,
        "holding_days": holding_days,
        "cost_bps": cost_bps,
        "total_net_return": float(equity[-1] - 1.0) if len(equity) > 0 else 0.0,
        "cagr": ann_return,
        "annualized_vol": ann_vol,
        "sharpe_ratio": sharpe,
        "sortino_ratio": sortino,
        "calmar_ratio": calmar,
        "max_drawdown": max_dd,
        "win_rate": win_rate,
        "profit_factor": profit_factor,
        "avg_trade_net": mean_ret,
        "best_trade": float(np.max(net_returns)) if len(net_returns) > 0 else 0.0,
        "worst_trade": float(np.min(net_returns)) if len(net_returns) > 0 else 0.0,
        "turnover": float(n_trades * 2.0 / len(df))
    }
