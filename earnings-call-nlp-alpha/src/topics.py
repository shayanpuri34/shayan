import numpy as np
from typing import Dict, List, Tuple, Any
from scipy.spatial.distance import jensenshannon
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import NMF
from src.logging_config import logger

CORE_FINANCIAL_TOPICS = [
    "AI & Compute",
    "Demand & Booking",
    "Pricing Power",
    "Operating Margins",
    "CapEx Allocation",
    "Hiring & Labor",
    "Cloud Infrastructure",
    "Advertising Dynamics",
    "Consumer Health",
    "Inventory Turnover",
    "Supply Chain Lead-Time",
    "Regulatory Scrutiny",
    "Competitive Moats",
    "International Markets",
    "Shareholder Returns"
]

TOPIC_KEYWORDS = {
    "AI & Compute": ["ai", "artificial intelligence", "gpu", "compute", "training", "inference", "model", "llm", "accelerator"],
    "Demand & Booking": ["demand", "bookings", "backlog", "orders", "pipeline", "guidance", "trajectory", "reaccelerate"],
    "Pricing Power": ["pricing", "price increases", "elasticity", "realization", "average selling price", "asp"],
    "Operating Margins": ["gross margin", "operating margin", "ebitda", "profitability", "operating leverage", "expansion"],
    "CapEx Allocation": ["capex", "capital expenditure", "datacenter", "infrastructure", "investment", "buildout"],
    "Hiring & Labor": ["hiring", "headcount", "labor", "workforce", "attrition", "compensation", "recruitment"],
    "Cloud Infrastructure": ["cloud", "azure", "aws", "workloads", "migration", "consumption", "multitenant"],
    "Advertising Dynamics": ["advertising", "ad spend", "impressions", "cpm", "clicks", "monetization", "reels"],
    "Consumer Health": ["consumer", "discretionary", "household", "wallet", "spending", "trade-down", "affluent"],
    "Inventory Turnover": ["inventory", "stock", "turnover", "markdowns", "destocking", "channel inventory"],
    "Supply Chain Lead-Time": ["supply chain", "lead time", "wafer", "packaging", "supplier", "components", "logistics"],
    "Regulatory Scrutiny": ["regulatory", "regulation", "doj", "ftc", "compliance", "investigation", "antitrust", "basel"],
    "Competitive Moats": ["competitor", "competition", "market share", "moat", "differentiation", "barrier to entry"],
    "International Markets": ["china", "europe", "fx", "currency", "foreign exchange", "geopolitical", "tariffs", "latin america"],
    "Shareholder Returns": ["dividend", "buyback", "share repurchase", "free cash flow", "capital return", "yield"]
}

class TopicModelEngine:
    """
    Topic modeling engine using NMF + TF-IDF with keyword-guided topic anchors
    and Jensen-Shannon divergence tracking across quarters.
    """
    def __init__(self, n_topics: int = 15):
        self.n_topics = n_topics
        self.topic_names = CORE_FINANCIAL_TOPICS[:n_topics]
        self.vectorizer = TfidfVectorizer(max_features=2500, stop_words="english")
        self.nmf = NMF(n_components=n_topics, random_state=42, max_iter=200)

    def extract_topic_distribution(self, text: str) -> Dict[str, float]:
        """
        Calculates topic probability distribution over the predefined financial topics.
        Uses keyword density normalized as a discrete probability distribution.
        """
        words = text.lower()
        scores = {}
        for topic, kws in TOPIC_KEYWORDS.items():
            count = sum(words.count(kw) for kw in kws)
            scores[topic] = count + 0.1  # Laplace smoothing

        total = sum(scores.values())
        prob_dist = {topic: score / total for topic, score in scores.items()}
        return prob_dist

    @staticmethod
    def compute_jensen_shannon_divergence(dist_p: Dict[str, float], dist_q: Dict[str, float]) -> float:
        """
        Computes Jensen-Shannon divergence between two topic distributions.
        Returns value bounded in [0, 1].
        """
        keys = sorted(list(set(dist_p.keys()) | set(dist_q.keys())))
        p = np.array([dist_p.get(k, 1e-6) for k in keys])
        q = np.array([dist_q.get(k, 1e-6) for k in keys])
        p /= p.sum()
        q /= q.sum()
        return float(jensenshannon(p, q, base=2))

    @staticmethod
    def identify_topic_shifts(
        dist_current: Dict[str, float],
        dist_prior: Dict[str, float],
        emergence_threshold: float = 0.05,
        shift_threshold: float = 0.04
    ) -> Dict[str, List[str]]:
        """
        Identifies:
        - New/Emerging Topics (low prior, high current)
        - Disappearing Topics (moderate prior, near-zero current)
        - Accelerating Topics (positive delta > shift_threshold)
        - Declining Topics (negative delta < -shift_threshold)
        """
        emerging = []
        disappearing = []
        accelerating = []
        declining = []

        all_keys = set(dist_current.keys()) | set(dist_prior.keys())
        for k in all_keys:
            p_cur = dist_current.get(k, 0.0)
            p_pri = dist_prior.get(k, 0.0)
            delta = p_cur - p_pri

            if p_pri < 0.03 and p_cur >= emergence_threshold:
                emerging.append(k)
            elif p_pri >= emergence_threshold and p_cur < 0.02:
                disappearing.append(k)

            if delta > shift_threshold:
                accelerating.append(k)
            elif delta < -shift_threshold:
                declining.append(k)

        return {
            "emerging": emerging,
            "disappearing": disappearing,
            "accelerating": accelerating,
            "declining": declining
        }
