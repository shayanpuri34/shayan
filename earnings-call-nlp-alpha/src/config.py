import os
from pathlib import Path
from typing import Any, Dict
import yaml

ROOT_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT_DIR / "config" / "config.yaml"

def load_config(config_path: Path = CONFIG_PATH) -> Dict[str, Any]:
    """Loads YAML configuration defensively with environment variable fallbacks."""
    if not config_path.exists():
        # Fallback default configuration dictionary
        return {
            "project": {"name": "Earnings-Call NLP Alpha Engine", "random_seed": 42, "run_mode": "DEMO"},
            "universe": {"primary": ["AAPL", "MSFT", "AMZN", "GOOGL", "META", "NVDA", "JPM", "BAC", "XOM", "CVX", "WMT", "COST"]},
            "mnds": {
                "weights": {
                    "w1_sentiment_delta": 0.20,
                    "w2_uncertainty_delta": 0.20,
                    "w3_narrative_shock": 0.15,
                    "w4_topic_delta": 0.15,
                    "w5_confidence_delta": 0.15,
                    "w6_qa_divergence": 0.15
                }
            }
        }
    with open(config_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)
    return cfg

CONFIG = load_config()
RANDOM_STATE = CONFIG.get("project", {}).get("random_seed", 42)
RUN_MODE = os.getenv("RUN_MODE", CONFIG.get("project", {}).get("run_mode", "DEMO"))
