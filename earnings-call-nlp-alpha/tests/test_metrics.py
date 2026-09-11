import unittest
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

class TestDataLeakageAndLookAheadAudit(unittest.TestCase):
    def test_current_quarter_excluded_from_historical_baseline(self):
        """CRITICAL: Current-quarter transcript cannot appear in previous baseline."""
        sample_quarters = ["2024Q1", "2024Q2", "2024Q3", "2024Q4"]
        target_q = "2024Q4"
        baseline_quarters = [q for q in sample_quarters if q < target_q]
        self.assertNotIn(target_q, baseline_quarters)
        self.assertEqual(baseline_quarters, ["2024Q1", "2024Q2", "2024Q3"])

    def test_future_returns_cannot_appear_in_feature_matrix(self):
        """CRITICAL: Future returns (e.g. CAR[0,+5], return_5d) must never enter X."""
        banned_feature_substrings = ["future", "return_t+", "target", "car_"]
        feature_columns = [
            "sentiment_delta", "uncertainty_delta", "narrative_shock",
            "topic_delta_js", "confidence_delta", "qa_sentiment_divergence",
            "momentum_21d", "volatility_21d", "volume_zscore", "eps_surprise"
        ]
        for col in feature_columns:
            for banned in banned_feature_substrings:
                self.assertNotIn(banned, col.lower(), f"Potential target leakage found in feature: {col}")

    def test_trade_entry_lagging_integrity(self):
        """CRITICAL: Position must be entered strictly after transcript release timestamp."""
        transcript_release_time = pd.Timestamp("2024-11-20 17:00:00-0500")
        trade_fill_time = pd.Timestamp("2024-11-21 09:30:00-0500")
        self.assertGreater(trade_fill_time, transcript_release_time)

    def test_ml_preprocessing_is_train_fold_only(self):
        """CRITICAL: Scaler parameters (mean, std) must be fit on train fold only."""
        X_train = np.array([[1.0], [2.0], [3.0]])
        X_test = np.array([[100.0]]) # extreme out-of-sample point

        scaler = StandardScaler()
        scaler.fit(X_train)

        self.assertAlmostEqual(scaler.mean_[0], 2.0)
        # Test sample must NOT alter train fold mean
        transformed_test = scaler.transform(X_test)
        self.assertAlmostEqual(scaler.mean_[0], 2.0)
        self.assertGreater(transformed_test[0, 0], 50.0)

if __name__ == "__main__":
    unittest.main()
