import unittest
import numpy as np
import pandas as pd
from src.embeddings import NarrativeEmbeddingEngine
from src.topics import TopicModelEngine
from src.narrative_delta import NarrativeDeltaEngine

class TestNarrativeDelta(unittest.TestCase):
    def test_cosine_similarity_and_narrative_shock(self):
        engine = NarrativeEmbeddingEngine(use_transformer=False)
        vec_a = np.array([1.0, 0.0, 0.0])
        vec_b = np.array([1.0, 0.0, 0.0])
        sim_identical = engine.compute_cosine_similarity(vec_a, vec_b)
        self.assertAlmostEqual(sim_identical, 1.0, places=4)
        self.assertAlmostEqual(engine.compute_narrative_shock(sim_identical), 0.0, places=4)

        vec_c = np.array([0.0, 1.0, 0.0])
        sim_orthogonal = engine.compute_cosine_similarity(vec_a, vec_c)
        self.assertAlmostEqual(sim_orthogonal, 0.0, places=4)
        self.assertAlmostEqual(engine.compute_narrative_shock(sim_orthogonal), 1.0, places=4)

    def test_jensen_shannon_divergence(self):
        dist_p = {"AI": 0.8, "Cloud": 0.2}
        dist_q = {"AI": 0.8, "Cloud": 0.2}
        js_div = TopicModelEngine.compute_jensen_shannon_divergence(dist_p, dist_q)
        self.assertAlmostEqual(js_div, 0.0, places=4)

        dist_diff = {"AI": 0.1, "Cloud": 0.9}
        js_div_diff = TopicModelEngine.compute_jensen_shannon_divergence(dist_p, dist_diff)
        self.assertGreater(js_div_diff, 0.3)
        self.assertLessEqual(js_div_diff, 1.0)

    def test_qa_divergence(self):
        res = NarrativeDeltaEngine.calculate_qa_divergence(
            prepared_sentiment=0.70,
            qa_sentiment=0.30,
            prepared_uncertainty=0.01,
            qa_uncertainty=0.04
        )
        self.assertAlmostEqual(res["qa_sentiment_divergence"], 0.40, places=4)
        self.assertAlmostEqual(res["qa_uncertainty_divergence"], 0.03, places=4)

    def test_mnds_composite_computation(self):
        df_dummy = pd.DataFrame([
            {
                "sentiment_delta": 1.2,
                "uncertainty_delta": -0.8,
                "narrative_shock": 0.25,
                "topic_delta_js": 0.20,
                "confidence_delta": 1.1,
                "qa_sentiment_divergence": 0.10
            },
            {
                "sentiment_delta": -1.0,
                "uncertainty_delta": 1.2,
                "narrative_shock": 0.15,
                "topic_delta_js": 0.10,
                "confidence_delta": -0.9,
                "qa_sentiment_divergence": 0.35
            }
        ])
        engine = NarrativeDeltaEngine()
        res = engine.compute_mnds_composite(df_dummy)
        self.assertIn("mnds_score", res.columns)
        self.assertGreater(res.iloc[0]["mnds_score"], res.iloc[1]["mnds_score"])

if __name__ == "__main__":
    unittest.main()
