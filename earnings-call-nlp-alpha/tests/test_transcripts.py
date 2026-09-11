import unittest
from src.api_utils import validate_transcript, clean_transcript_text

class TestAPIAndTranscripts(unittest.TestCase):
    def test_clean_transcript_text(self):
        raw = "<p>Hello&nbsp;world! This is a test.\r\n</p>"
        cleaned = clean_transcript_text(raw)
        self.assertNotIn("<p>", cleaned)
        self.assertNotIn("&nbsp;", cleaned)
        self.assertEqual(cleaned, "Hello world! This is a test.")

    def test_validate_transcript_empty(self):
        report = validate_transcript({})
        self.assertFalse(report["valid"])
        self.assertIn("Empty or malformed transcript field", report["issues"])

    def test_validate_transcript_valid(self):
        sample = {
            "symbol": "AAPL",
            "quarter": "2024Q4",
            "transcript": [
                {"speaker": "Tim Cook", "role": "CEO", "text": "Good afternoon everyone. We delivered record results this quarter across our services ecosystem with significant growth."},
                {"speaker": "Luca Maestri", "role": "CFO", "text": "Let me provide further details on gross margin and operating performance across geographic segments today."}
            ] * 30
        }
        report = validate_transcript(sample, min_words=100)
        self.assertTrue(report["valid"])
        self.assertGreater(report["word_count"], 100)
        self.assertGreaterEqual(report["speaker_count"], 2)

if __name__ == "__main__":
    unittest.main()
