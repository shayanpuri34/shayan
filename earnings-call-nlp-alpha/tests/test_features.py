import unittest
from src.sentiment import compute_dictionary_sentiment
from src.linguistic_features import compute_linguistic_features

class TestFeatures(unittest.TestCase):
    def test_sentiment_lexicon(self):
        bullish_text = "We achieved record revenue growth and exceptional operating profit across our strong business."
        s_bullish = compute_dictionary_sentiment(bullish_text)
        self.assertGreater(s_bullish["net_sentiment"], 0.4)

        bearish_text = "We face severe headwinds, compressed margins, declining demand, and substantial risk of impairment."
        s_bearish = compute_dictionary_sentiment(bearish_text)
        self.assertLess(s_bearish["net_sentiment"], -0.4)

    def test_linguistic_uncertainty_and_confidence(self):
        text = "We are confident and committed to our target, but we might encounter potentially uncertain conditions."
        ling = compute_linguistic_features(text)
        self.assertGreater(ling["uncertainty_count"], 0)
        self.assertGreater(ling["confidence_count"], 0)
        self.assertGreater(ling["confidence_rate"], 0.0)

if __name__ == "__main__":
    unittest.main()
