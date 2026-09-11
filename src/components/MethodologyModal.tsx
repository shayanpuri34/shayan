import React from 'react';
import { X, BookOpen, Calculator, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Quantitative Methodology & Formulation Specification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-6 text-xs leading-relaxed text-slate-300">
          {/* Section 1: Core Research Philosophy */}
          <div className="rounded-lg bg-slate-950/60 p-4 border border-slate-850">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-cyan-400" />
              1. Narrative Change vs. Static Sentiment
            </h3>
            <p className="mt-1 text-slate-400">
              Commercial NLP systems typically count positive minus negative words in isolation. However, corporate communications are heavily conditioned by firm-specific styles (e.g. executive charisma or legal conservativism). We evaluate all linguistic variables relative to a firm's own historical rolling centroid.
            </p>
          </div>

          {/* Section 2: Mathematical Formulations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100">2. Mathematical Definitions</h3>

            {/* Formula 1 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono">
              <div className="text-cyan-400 font-bold">A. Sentiment Delta (ΔSent)</div>
              <div className="mt-1 text-slate-200">
                ΔSent_{`{i,q}`} = (Sent_{`{i,q}`} - μ_{`{i,baseline}`}) / σ_{`{i,baseline}`}
              </div>
              <p className="mt-1 text-[11px] font-sans text-slate-400">
                Loughran-McDonald financial dictionary polarity standardized against company-specific 4-quarter rolling baseline.
              </p>
            </div>

            {/* Formula 2 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono">
              <div className="text-cyan-400 font-bold">B. Semantic Narrative Shock</div>
              <div className="mt-1 text-slate-200">
                NarrativeShock_{`{i,q}`} = 1 - CosineSimilarity(v_{`{i,q}`}, v_{`{i,q-1}`})
              </div>
              <p className="mt-1 text-[11px] font-sans text-slate-400">
                Measures how far the semantic vector space has shifted relative to immediate prior disclosure.
              </p>
            </div>

            {/* Formula 3 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono">
              <div className="text-cyan-400 font-bold">C. Topic Delta (Jensen-Shannon Divergence)</div>
              <div className="mt-1 text-slate-200">
                TopicDelta_{`{i,q}`} = D_JS(P_q || P_{`{q-1}`}) = 0.5 * D_KL(P_q || M) + 0.5 * D_KL(P_{`{q-1}`} || M)
              </div>
              <p className="mt-1 text-[11px] font-sans text-slate-400">
                Symmetric, finite distance between probability distributions across 15 standardized corporate operational topics.
              </p>
            </div>

            {/* Formula 4 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono">
              <div className="text-cyan-400 font-bold">D. Prepared Remarks vs. Q&A Divergence</div>
              <div className="mt-1 text-slate-200">
                QADiv_{`{i,q}`} = Sentiment_{`{Prepared}`} - Sentiment_{`{QA}`}
              </div>
              <p className="mt-1 text-[11px] font-sans text-slate-400">
                Positive divergence indicates management prepared script was substantially more optimistic than impromptu answers given during live analyst questioning.
              </p>
            </div>

            {/* Formula 5 */}
            <div className="rounded-lg border border-cyan-500/40 bg-cyan-950/20 p-3 font-mono">
              <div className="text-cyan-300 font-bold">E. Management Narrative Delta Score (MNDS Composite)</div>
              <div className="mt-1 text-slate-100 font-bold">
                MNDS = w₁·z(ΔSent) - w₂·z(ΔUnc) + w₃·z(Shock) + w₄·z(TopicΔ) + w₅·z(ΔConf) - w₆·z(QADiv)
              </div>
              <p className="mt-1 text-[11px] font-sans text-slate-300">
                Default research weights: w = [0.20, 0.20, 0.15, 0.15, 0.15, 0.15].
              </p>
            </div>
          </div>

          {/* Section 3: Event Study & Market Model */}
          <div className="rounded-lg bg-slate-950/60 p-4 border border-slate-850">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              3. Market Model Benchmark & Leakage Guarantees
            </h3>
            <p className="mt-1 text-slate-400">
              The benchmark market parameters (alpha and beta) are estimated over [-252, -30] trading days prior to the call date. The 30-day gap prevents pre-earnings run-up from biasing abnormal return expectations. Trade execution occurs strictly at next-day open (t+1 09:30 ET).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 cursor-pointer"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
