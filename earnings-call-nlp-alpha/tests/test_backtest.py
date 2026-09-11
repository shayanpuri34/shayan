import unittest
import pandas as pd
import numpy as np
from src.backtest import simulate_event_backtest
from src.risk import compute_risk_metrics

class TestBacktestAndRisk(unittest.TestCase):
    def test_backtest_with_transaction_costs(self):
        df_trades = pd.DataFrame([
            {"signal": 1, "return_5d": 0.05},
            {"signal": -1, "return_5d": -0.04},
            {"signal": 1, "return_5d": 0.02},
            {"signal": 0, "return_5d": 0.10} # flat
        ])
        res_zero_cost = simulate_event_backtest(df_trades, cost_bps=0.0, holding_days=5)
        res_high_cost = simulate_event_backtest(df_trades, cost_bps=25.0, holding_days=5)

        self.assertGreater(res_zero_cost["total_net_return"], res_high_cost["total_net_return"])
        self.assertEqual(res_zero_cost["n_trades"], 3)

    def test_risk_metrics_var_and_cvar(self):
        returns = np.array([-0.05, -0.03, -0.02, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07])
        risk = compute_risk_metrics(returns)
        self.assertLess(risk["var_95"], 0.0)
        self.assertLessEqual(risk["cvar_95"], risk["var_95"])

if __name__ == "__main__":
    unittest.main()
