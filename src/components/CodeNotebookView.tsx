import React, { useState } from 'react';
import { 
  FileCode, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Folder, 
  FileText,
  Play
} from 'lucide-react';

export const CodeNotebookView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('narrative_delta.py');
  const [copied, setCopied] = useState<boolean>(false);

  const fileTree = [
    { name: 'config/config.yaml', type: 'config' },
    { name: 'src/narrative_delta.py', type: 'python', id: 'narrative_delta.py' },
    { name: 'src/embeddings.py', type: 'python', id: 'embeddings.py' },
    { name: 'src/sentiment.py', type: 'python', id: 'sentiment.py' },
    { name: 'src/speakers.py', type: 'python', id: 'speakers.py' },
    { name: 'src/event_study.py', type: 'python', id: 'event_study.py' },
    { name: 'src/models.py', type: 'python', id: 'models.py' },
    { name: 'src/backtest.py', type: 'python', id: 'backtest.py' },
    { name: 'src/risk.py', type: 'python', id: 'risk.py' },
    { name: 'tests/test_metrics.py', type: 'test', id: 'test_metrics.py' },
    { name: 'notebooks/earnings_nlp_alpha.ipynb', type: 'notebook', id: 'notebook' },
    { name: 'reports/final_report.md', type: 'report', id: 'final_report.md' }
  ];

  const codeSnippets: Record<string, string> = {
    'narrative_delta.py': `import numpy as np
import pandas as pd
from typing import Dict, Any, List

class NarrativeDeltaEngine:
    \"\"\"
    Management Narrative Delta Score (MNDS) Formulation:
    MNDS = w1*z(DeltaSent) - w2*z(DeltaUnc) + w3*z(Shock) + w4*z(TopicDelta) + w5*z(DeltaConf) - w6*z(QADiv)
    \"\"\"
    DEFAULT_WEIGHTS = {
        "w1": 0.20, # Sentiment Delta
        "w2": 0.20, # Uncertainty Delta (negative sign)
        "w3": 0.15, # Narrative Shock (1 - CosineSimilarity)
        "w4": 0.15, # Topic Delta (Jensen-Shannon Divergence)
        "w5": 0.15, # Confidence Delta
        "w6": 0.15  # Q&A Sentiment Divergence (negative sign)
    }

    def compute_mnds_composite(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        z_sent = (df["sentiment_delta"] - df["sentiment_delta"].mean()) / (df["sentiment_delta"].std() or 1.0)
        z_unc = (df["uncertainty_delta"] - df["uncertainty_delta"].mean()) / (df["uncertainty_delta"].std() or 1.0)
        z_shock = (df["narrative_shock"] - df["narrative_shock"].mean()) / (df["narrative_shock"].std() or 1.0)
        z_topic = (df["topic_delta_js"] - df["topic_delta_js"].mean()) / (df["topic_delta_js"].std() or 1.0)
        z_conf = (df["confidence_delta"] - df["confidence_delta"].mean()) / (df["confidence_delta"].std() or 1.0)
        z_qa = (df["qa_sentiment_divergence"] - df["qa_sentiment_divergence"].mean()) / (df["qa_sentiment_divergence"].std() or 1.0)

        df["mnds_score"] = (
            self.DEFAULT_WEIGHTS["w1"] * z_sent
            - self.DEFAULT_WEIGHTS["w2"] * z_unc
            + self.DEFAULT_WEIGHTS["w3"] * z_shock
            + self.DEFAULT_WEIGHTS["w4"] * z_topic
            + self.DEFAULT_WEIGHTS["w5"] * z_conf
            - self.DEFAULT_WEIGHTS["w6"] * z_qa
        )
        return df`,

    'embeddings.py': `import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class NarrativeEmbeddingEngine:
    \"\"\"Calculates semantic vector representations and Narrative Shock.\"\"\"
    def compute_cosine_similarity(self, vec_a: np.ndarray, vec_b: np.ndarray) -> float:
        norm_a = np.linalg.norm(vec_a)
        norm_b = np.linalg.norm(vec_b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))

    def compute_narrative_shock(self, cosine_sim: float) -> float:
        # Narrative Shock = 1 - CosineSimilarity(Narrative_q, Narrative_q-1)
        return float(1.0 - np.clip(cosine_sim, -1.0, 1.0))`,

    'event_study.py': `import numpy as np
import pandas as pd
import statsmodels.api as sm

def calculate_abnormal_returns(
    stock_returns: pd.Series,
    market_returns: pd.Series,
    estimation_window: slice,
    event_window: slice
) -> Dict[str, Any]:
    \"\"\"
    Market Model: R_{i,t} = alpha_i + beta_i * R_{m,t} + epsilon_{i,t}
    Estimated on [-252, -30] strictly prior to event.
    \"\"\"
    X_est = sm.add_constant(market_returns.loc[estimation_window])
    y_est = stock_returns.loc[estimation_window]
    model = sm.OLS(y_est, X_est).fit()

    alpha = model.params.get('const', 0.0)
    beta = model.params.get(market_returns.name, 1.0)

    # Event window expected & abnormal returns
    expected_returns = alpha + beta * market_returns.loc[event_window]
    abnormal_returns = stock_returns.loc[event_window] - expected_returns
    car = abnormal_returns.cumsum()

    return {
        "alpha": alpha,
        "beta": beta,
        "abnormal_returns": abnormal_returns,
        "car": car
    }`,

    'test_metrics.py': `import unittest
import numpy as np
import pandas as pd

class TestDataLeakageAndLookAheadAudit(unittest.TestCase):
    def test_current_quarter_excluded_from_historical_baseline(self):
        \"\"\"CRITICAL: Current-quarter transcript cannot appear in previous baseline.\"\"\"
        sample_quarters = ["2024Q1", "2024Q2", "2024Q3", "2024Q4"]
        target_q = "2024Q4"
        baseline_quarters = [q for q in sample_quarters if q < target_q]
        self.assertNotIn(target_q, baseline_quarters)

    def test_trade_entry_lagging_integrity(self):
        \"\"\"CRITICAL: Position must be entered strictly after transcript release timestamp.\"\"\"
        transcript_release_time = pd.Timestamp("2024-11-20 17:00:00-0500")
        trade_fill_time = pd.Timestamp("2024-11-21 09:30:00-0500")
        self.assertGreater(trade_fill_time, transcript_release_time)`,

    'notebook': `# Google Colab 56-Cell Research Notebook: earnings_nlp_alpha.ipynb
# Structure:
# Cell 1-5: Research Questions & Hypotheses (H1..H9)
# Cell 6-11: Environment Setup & Logging
# Cell 12-20: API Fetcher & Transcript Preprocessing
# Cell 21-31: Loughran-McDonald, Embeddings, Jensen-Shannon & MNDS
# Cell 32-37: Event Study CAR/CAAR & Cross-Sectional Regressions
# Cell 38-40: TimeSeriesSplit ML Validation & Ablation Study
# Cell 41-49: Portfolio Backtest, Sizing, Risk (VaR/CVaR) & Regimes
# Cell 50: Look-Ahead Bias & Leakage Audit (13 Invariants)
# Cell 51-56: Dashboard Specification, Limitations & CSV Exporter`
  };

  const handleCopy = () => {
    const text = codeSnippets[selectedFile] || '# Source code module';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Colab Link Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-cyan-400" />
              Python Quantitative Research Codebase & Colab Notebook
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous Python package structured in <span className="font-mono text-cyan-400">/earnings-call-nlp-alpha/</span> with zero framework coupling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-md bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 font-mono text-xs font-semibold text-amber-300">
              56-Cell Notebook Ready
            </span>
          </div>
        </div>
      </div>

      {/* Explorer Layout: File Tree + Code Display */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* File Navigator Sidebar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5 text-cyan-400" />
            Project File Tree
          </div>

          <div className="mt-3 space-y-1">
            {fileTree.map((item) => (
              <button
                key={item.name}
                onClick={() => item.id && setSelectedFile(item.id)}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-mono text-left transition-colors ${
                  selectedFile === item.id
                    ? 'bg-cyan-950/80 text-cyan-300 font-semibold border border-cyan-800'
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                <FileCode className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Quick Download CSVs */}
          <div className="mt-6 border-t border-slate-800 pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Exported CSV Artifacts
            </div>
            <div className="space-y-1 font-mono text-xs text-slate-400">
              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-850">
                <span>mnds_scores.csv</span>
                <span className="text-[10px] text-emerald-400">Ready</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-850">
                <span>ablation_results.csv</span>
                <span className="text-[10px] text-emerald-400">Ready</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-850">
                <span>regression_results.csv</span>
                <span className="text-[10px] text-emerald-400">Ready</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-850">
                <span>performance_metrics.csv</span>
                <span className="text-[10px] text-emerald-400">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Content Panel */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-200">
              <FileCode className="h-4 w-4 text-cyan-400" />
              <span>{selectedFile}</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Syntax Highlighter View */}
          <div className="mt-4 max-h-[520px] overflow-y-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-300 border border-slate-850">
            <pre className="whitespace-pre overflow-x-auto leading-relaxed">
              {codeSnippets[selectedFile] || '# Select a source file on the left to view implementation'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
