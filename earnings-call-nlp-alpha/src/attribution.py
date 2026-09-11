import numpy as np
import pandas as pd
from typing import Dict, Any

def analyze_by_market_regime(df_trades: pd.DataFrame) -> pd.DataFrame:
    """
    Groups strategy trade returns by market volatility regime:
    - Low Volatility: VIX < 15
    - Normal: 15 <= VIX < 22
    - High Volatility: 22 <= VIX < 32
    - Crisis: VIX >= 32
    """
    df = df_trades.copy()
    if "vix" not in df.columns:
        # Synthesize regime proxy from 21-day market volatility if VIX is not mapped
        df["vix"] = df.get("volatility_21d", 0.20) * 100.0

    conditions = [
        (df["vix"] < 15.0),
        (df["vix"] >= 15.0) & (df["vix"] < 22.0),
        (df["vix"] >= 22.0) & (df["vix"] < 32.0),
        (df["vix"] >= 32.0)
    ]
    regime_labels = ["Low Volatility", "Normal", "High Volatility", "Crisis"]
    df["regime"] = np.select(conditions, regime_labels, default="Normal")

    grouped = df.groupby("regime").agg(
        event_count=("mnds_score", "count"),
        avg_mnds=("mnds_score", "mean"),
        avg_trade_return=("trade_net_return", "mean"),
        win_rate=("trade_net_return", lambda x: (x > 0).mean()),
        return_std=("trade_net_return", "std")
    ).reset_index()

    grouped["sharpe"] = np.where(
        grouped["return_std"] > 0,
        (grouped["avg_trade_return"] * np.sqrt(50)) / grouped["return_std"],
        0.0
    )
    return grouped

def analyze_by_sector(df_trades: pd.DataFrame) -> pd.DataFrame:
    """Computes event counts, mean MNDS, CAR, strategy return, and win rate grouped by sector."""
    grouped = df_trades.groupby("sector").agg(
        event_count=("mnds_score", "count"),
        avg_mnds=("mnds_score", "mean"),
        avg_sentiment_delta=("sentiment_delta", "mean"),
        avg_car0_5=("car_0_5", "mean"),
        strategy_return=("trade_net_return", "mean"),
        win_rate=("trade_net_return", lambda x: (x > 0).mean())
    ).reset_index()

    return grouped.sort_values(by="strategy_return", ascending=False)
