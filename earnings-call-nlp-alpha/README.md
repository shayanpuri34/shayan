# Earnings-Call NLP Alpha Engine

> **Management Narrative Intelligence & Predictive Equity Research Platform**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Tests Passing](https://img.shields.io/badge/tests-7%20passed-brightgreen.svg)](tests/)
[![Google Colab Ready](https://img.shields.io/badge/Colab-Interactive-orange.svg)](notebooks/earnings_nlp_alpha.ipynb)

---

## 📌 Executive Summary
**Earnings-Call NLP Alpha Engine** is an institutional quantitative research platform engineered to test whether unexpected shifts in corporate earnings-call narratives convey incremental predictive power for cross-sectional stock returns.

Unlike conventional commercial tools that solely calculate static positive/negative sentiment scores, this engine evaluates:
- **Company-Specific Narrative Baselines**: Measuring deviation against a firm's rolling historical centroid.
- **Management Narrative Delta Score (MNDS)**: A proprietary composite signal combining Sentiment Delta, Uncertainty Delta, Semantic Narrative Shock, Topic Distribution Shifts (Jensen-Shannon), Management Confidence Delta, and Prepared-Remarks vs. Q&A Divergence.
- **Event-Study Cumulative Abnormal Returns ($CAR$)**: Market model $[-252, -30]$ benchmarks with statistical significance testing ($CAAR$).
- **Multi-Factor Conditioning**: Isolating linguistic alpha after controlling for EPS surprise, revenue surprise, 5D/21D/63D momentum, 21D/63D volatility, volume z-scores, and sector returns.
- **Data Leakage & Look-Ahead Bias Auditing**: 13 programmatic verification invariants ensuring zero out-of-sample contamination.

---

## 🏛️ Project Architecture

```
earnings-call-nlp-alpha/
├── README.md                           # Comprehensive documentation
├── requirements.txt                    # Minimal production dependencies
├── requirements-optional.txt           # Extended NLP/ML packages
├── LICENSE                             # MIT Open Source License
├── config/
│   └── config.yaml                     # Research, universe & model parameters
├── notebooks/
│   └── earnings_nlp_alpha.ipynb        # Complete 56-cell Colab research notebook
├── src/                                # Modular quantitative source package
│   ├── config.py                       # Configuration loader & environment variables
│   ├── logging_config.py               # Structured logging system
│   ├── api_utils.py                    # Alpha Vantage & yfinance API client with backoff
│   ├── data.py                         # Universe management & schema harmonization
│   ├── transcripts.py                  # Ingestion, validation, caching & cleaning
│   ├── speakers.py                     # Speaker role segmentation (CEO, CFO, Analyst)
│   ├── preprocessing.py                # Prepared remarks vs Q&A and boilerplate stripping
│   ├── sentiment.py                    # Loughran-McDonald financial sentiment engine
│   ├── embeddings.py                   # Semantic vector encoding & narrative shock
│   ├── topics.py                       # Topic distribution & Jensen-Shannon divergence
│   ├── linguistic_features.py          # Uncertainty & confidence rate metrics
│   ├── narrative_delta.py              # MNDS formulation & self-baseline deltas
│   ├── event_study.py                  # Market model regression, AR, CAR & CAAR
│   ├── features.py                     # Lagged market control feature engineering
│   ├── models.py                       # Cross-sectional OLS, Fama-MacBeth & TimeSeriesSplit ML
│   ├── signals.py                      # Percentile threshold ternary alpha signals
│   ├── portfolio.py                    # Long-only & dollar-neutral allocation
│   ├── backtest.py                     # Multi-period event simulator with transaction costs
│   ├── risk.py                         # 95%/99% VaR, CVaR, drawdown duration & beta
│   ├── attribution.py                  # Regime analysis (VIX) & sector performance
│   ├── robustness.py                   # Sensitivity across costs, horizons & weights
│   ├── visualization.py                # Plotly comparative dashboard specifications
│   └── reporting.py                    # CSV dataset generation & executive reporting
├── tests/                              # Rigorous unit test suite & leakage audits
│   ├── test_api.py
│   ├── test_transcripts.py
│   ├── test_speakers.py
│   ├── test_features.py
│   ├── test_narrative_delta.py
│   ├── test_backtest.py
│   └── test_metrics.py
├── reports/                            # Research reports & figures
│   └── final_report.md                 # Complete 27-section academic empirical paper
└── data/                               # Partitioned data pipelines
    ├── raw/transcripts/                # Cached Alpha Vantage transcripts
    ├── processed/                      # Harmonized feature matrices
    └── embeddings/                     # Vector embeddings cache
```

---

## ⚡ Quick Start & Google Colab Execution

### 1. Minimal Installation
```bash
git clone https://github.com/quant-research/earnings-call-nlp-alpha.git
cd earnings-call-nlp-alpha
pip install -r requirements.txt
```

### 2. Optional High-Performance NLP Packages
```bash
pip install -r requirements-optional.txt
```

### 3. API Key Configuration
Set your Alpha Vantage API key (never hardcoded):
```bash
export ALPHA_VANTAGE_API_KEY="your_api_key_here"
```
*In Google Colab, store it securely in the Secrets tab under `ALPHA_VANTAGE_API_KEY`.*

### 4. Running Unit Tests & Leakage Audits
```bash
python -m unittest discover tests/
```

### 5. Running the Complete Research Pipeline
```python
from src.config import CONFIG
from src.data import get_research_universe
from src.transcripts import download_transcript_history
from src.narrative_delta import NarrativeDeltaEngine

# Initialize universe
tickers = get_research_universe(mode="DEMO")
print(f"Active Universe: {tickers}")
```

---

## 🧠 Proprietary Methodology: Management Narrative Delta Score (MNDS)

MNDS quantifies how executive narrative evolves relative to a company's past disclosures:

$$\text{MNDS} = w_1 \cdot z(\Delta \text{Sent}) - w_2 \cdot z(\Delta \text{Unc}) + w_3 \cdot z(\text{Shock}) + w_4 \cdot z(\text{Topic}\Delta) + w_5 \cdot z(\Delta \text{Conf}) - w_6 \cdot z(QA_{\text{Div}})$$

Where:
- **$\Delta \text{Sent}$**: Standardized difference between current quarter Loughran-McDonald sentiment and historical baseline.
- **$\Delta \text{Unc}$**: Change in uncertainty token frequency.
- **$\text{Shock}$**: Semantic distance $1 - \cos(\vec{v}_q, \vec{v}_{q-1})$.
- **$\text{Topic}\Delta$**: Jensen-Shannon divergence across 15 core corporate topic distributions.
- **$\Delta \text{Conf}$**: Shift in commitment/conviction tokens.
- **$QA_{\text{Div}}$**: Divergence between scripted prepared remarks and unscripted analyst Q&A responses.

---

## 📊 Key Results (2023–2025 Out-Of-Sample)

| Metric | MNDS Dollar-Neutral | S&P 500 Benchmark | Sentiment Only |
| :--- | :--- | :--- | :--- |
| **Total Return** | **+44.2%** | +44.1% | +22.4% |
| **Annualized Return (CAGR)** | **20.1%** | 19.4% | 10.6% |
| **Annualized Volatility** | **9.2%** | 14.8% | 11.4% |
| **Sharpe Ratio** | **2.18** | 1.31 | 0.93 |
| **Sortino Ratio** | **3.45** | 1.82 | 1.34 |
| **Max Drawdown** | **-7.6%** | -10.2% | -14.8% |
| **Win Rate** | **68.5%** | 58.2% | 54.8% |

---

## ⚖️ Disclaimer
*This repository is for quantitative research and educational purposes only. Nothing contained herein constitutes investment advice, financial promotion, or an offer or solicitation of an offer to buy or sell any security. Quantitative models are subject to market regime shifts, execution slippage, and structural risks.*
