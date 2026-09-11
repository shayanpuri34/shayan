import numpy as np
from typing import List, Optional, Union
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from src.logging_config import logger

class NarrativeEmbeddingEngine:
    """
    Computes semantic document embeddings and narrative shocks.
    Uses sentence-transformers if available, with robust scikit-learn TF-IDF fallback.
    """
    def __init__(self, use_transformer: bool = False, model_name: str = "all-MiniLM-L6-v2"):
        self.use_transformer = use_transformer
        self.transformer_model = None
        self.tfidf_vectorizer = None

        if use_transformer:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading SentenceTransformer model: {model_name}")
                self.transformer_model = SentenceTransformer(model_name)
            except Exception as exc:
                logger.warning(f"sentence-transformers could not be loaded ({exc}). Falling back to TF-IDF.")
                self.use_transformer = False

        if not self.use_transformer:
            self.tfidf_vectorizer = TfidfVectorizer(
                max_features=5000,
                stop_words="english",
                ngram_range=(1, 2)
            )

    def fit_corpus(self, corpus: List[str]) -> None:
        """Fits TF-IDF vocabulary on in-sample historical documents."""
        if not self.use_transformer and self.tfidf_vectorizer is not None:
            self.tfidf_vectorizer.fit(corpus)

    def encode(self, texts: Union[str, List[str]]) -> np.ndarray:
        """Encodes single text or list of texts into dense normalized vectors."""
        if isinstance(texts, str):
            texts = [texts]

        if self.use_transformer and self.transformer_model is not None:
            embeddings = self.transformer_model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
            return embeddings

        # Fallback to TF-IDF
        if self.tfidf_vectorizer is None:
            self.tfidf_vectorizer = TfidfVectorizer(max_features=5000, stop_words="english")
            dense = self.tfidf_vectorizer.fit_transform(texts).toarray()
        else:
            dense = self.tfidf_vectorizer.transform(texts).toarray()

        # L2-normalize
        norms = np.linalg.norm(dense, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        return dense / norms

    @staticmethod
    def compute_cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
        """Calculates cosine similarity between two 1D or 2D vector arrays."""
        a = np.atleast_2d(vec_a)
        b = np.atleast_2d(vec_b)
        sim = float(cosine_similarity(a, b)[0, 0])
        # Clip numerical precision bounds
        return max(-1.0, min(1.0, sim))

    @staticmethod
    def compute_narrative_shock(similarity: float) -> float:
        """
        Narrative Shock is defined as:
        Shock = 1 - CosineSimilarity(Narrative_t, Baseline)
        Bounded in [0, 2].
        """
        return 1.0 - similarity
