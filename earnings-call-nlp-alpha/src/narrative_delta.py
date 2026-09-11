import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from src.logging_config import logger
from src.config import CONFIG

class NarrativeDeltaEngine:
    """
    Computes Management Narrative Delta Score (MNDS) and its sub-components
    relative to company-specific historical baselines.
    """
    def __init__(self, weights: Optional[Dict[str, float]] = None):
        cfg_weights = CONFIG.get("mnds", {}).get("weights", {})
        self.weights = weights or {
            "w1_sentiment_delta": cfg_weights.get("w1_sentiment_delta", 0.20),
            "w2_uncertainty_delta": cfg_weights.get("w2_uncertainty_delta", 0.20),
            "w3_narrative_shock": cfg_weights.get("w3_narrative_shock", 0.15),
            "w4_topic_delta": cfg_weights.get("w4_topic_delta", 0.15),
            "w5_confidence_delta": cfg_weights.get("w5_confidence_delta", 0.15),
            "w6_qa_divergence": cfg_weights.get("w6_qa_divergence", 0.15),
        }

    @staticmethod
    def calculate_qa_divergence(
        prepared_sentiment: float,
        qa_sentiment: float,
        prepared_uncertainty: float,
        qa_uncertainty: float
    ) -> Dict[str, float]:
        """
        Quantifies divergence between scripted management remarks and live Q&A grilling:
        - Sentiment Divergence: Prepared - QA (higher means management scripted remarks were overly optimistic)
        - Uncertainty Divergence: QA - Prepared (higher means analysts uncovered hidden uncertainty)
        """
        sentiment_div = prepared_sentiment - qa_sentiment
        uncertainty_div = qa_uncertainty - prepared_uncertainty
        combined_divergence = -sentiment_div - (2.0 * uncertainty_div) # higher means worse hidden drag

        return {
            "qa_sentiment_divergence": sentiment_div,
            "qa_uncertainty_divergence": uncertainty_div,
            "combined_qa_divergence": combined_divergence
        }

    def compute_mnds_composite(
        self,
        df_events: pd.DataFrame,
        weights: Optional[Dict[str, float]] = None
    ) -> pd.DataFrame:
        """
        Calculates cross-sectional standardized MNDS:
        MNDS = w1 * z(DeltaSentiment) - w2 * z(DeltaUncertainty) +
               w3 * z(NarrativeShock) + w4 * z(TopicDelta) +
               w5 * z(DeltaConfidence) + w6 * z(QADivergence)
        """
        df = df_events.copy()
        w = weights or self.weights

        # Standardize features cross-sectionally per period or across sample
        def safe_zscore(s: pd.Series) -> pd.Series:
            std = s.std()
            if std == 0 or np.isnan(std):
                return pd.Series(0.0, index=s.index)
            return (s - s.mean()) / std

        z_sent = safe_zscore(df["sentiment_delta"])
        z_unc = safe_zscore(df["uncertainty_delta"])
        z_shock = safe_zscore(df["narrative_shock"])
        z_topic = safe_zscore(df["topic_delta_js"])
        z_conf = safe_zscore(df["confidence_delta"])
        z_qa = safe_zscore(df["qa_sentiment_divergence"])

        # Composite formulation
        mnds = (
            w["w1_sentiment_delta"] * z_sent
            - w["w2_uncertainty_delta"] * z_unc
            + w["w3_narrative_shock"] * z_shock
            + w["w4_topic_delta"] * z_topic
            + w["w5_confidence_delta"] * z_conf
            - w["w6_qa_divergence"] * z_qa
        )

        df["mnds_score"] = mnds
        df["mnds_zscore"] = safe_zscore(mnds)
        df["mnds_percentile"] = df["mnds_score"].rank(pct=True) * 100.0

        return df
