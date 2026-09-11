import unittest
from src.speakers import identify_speaker_role

class TestSpeakerSegmentation(unittest.TestCase):
    def test_identify_ceo(self):
        role = identify_speaker_role("Jensen Huang", "President and Chief Executive Officer")
        self.assertEqual(role, "CEO")

    def test_identify_cfo(self):
        role = identify_speaker_role("Colette Kress", "Executive Vice President and CFO")
        self.assertEqual(role, "CFO")

    def test_identify_analyst(self):
        role = identify_speaker_role("Toshiya Hari", "Goldman Sachs Research Analyst")
        self.assertEqual(role, "Analyst")

    def test_identify_operator(self):
        role = identify_speaker_role("Conference Operator", "")
        self.assertEqual(role, "Operator")

    def test_identify_unknown_fallback(self):
        # Must not force an incorrect role when ambiguous
        role = identify_speaker_role("Random Guest", "Special Participant")
        self.assertEqual(role, "UNKNOWN")

if __name__ == "__main__":
    unittest.main()
