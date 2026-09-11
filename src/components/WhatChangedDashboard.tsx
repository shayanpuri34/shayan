import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { EARNINGS_EVENTS, UNIVERSE_COMPANIES } from '../data/researchData';
import { EarningsEventData } from '../types';

interface Props {
  onOpenMethodology: () => void;
}

export const WhatChangedDashboard: React.FC<Props> = ({ onOpenMethodology }) => {
  const [selectedTicker, setSelectedTicker] = useState<string>('NVDA');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('2024Q4');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<'ALL' | 'PREPARED_REMARKS' | 'Q_AND_A'>('ALL');

  // Find matching event or fallback to first
  const event: EarningsEventData = EARNINGS_EVENTS.find(
    (e) => e.ticker === selectedTicker && e.quarter === selectedQuarter
  ) || EARNINGS_EVENTS[0];

  const companyProfile = UNIVERSE_COMPANIES.find((c) => c.ticker === selectedTicker);

  // Available quarters for current company in data
  const availableQuarters = Array.from(
    new Set(EARNINGS_EVENTS.filter((e) => e.ticker === selectedTicker).map((e) => e.quarter))
  );

  const filteredSentences = event.sampleSentences.filter((s) => {
    if (selectedSectionFilter === 'ALL') return true;
    return s.section === selectedSectionFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Selection bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <label htmlFor="ticker-select" className="sr-only">Select Company</label>
              <select
                id="ticker-select"
                value={selectedTicker}
                onChange={(e) => {
                  setSelectedTicker(e.target.value);
                  const matchingQuarters = EARNINGS_EVENTS.filter((ev) => ev.ticker === e.target.value);
                  if (matchingQuarters.length > 0) {
                    setSelectedQuarter(matchingQuarters[0].quarter);
                  }
                }}
                className="bg-transparent text-sm font-bold text-slate-100 focus:outline-none cursor-pointer"
              >
                {UNIVERSE_COMPANIES.map((comp) => (
                  <option key={comp.ticker} value={comp.ticker} className="bg-slate-900 text-slate-100">
                    {comp.ticker} — {comp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <label htmlFor="quarter-select" className="sr-only">Select Quarter</label>
              <select
                id="quarter-select"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer"
              >
                {availableQuarters.map((q) => (
                  <option key={q} value={q} className="bg-slate-900 text-slate-100">
                    Quarter: {q}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono">Call Date: {event.date}</span>
              <span>•</span>
              <span className="font-mono">{event.time}</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{companyProfile?.sector}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs">
              <span className="text-slate-400">Signal:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  event.mndsSignal === 'LONG'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : event.mndsSignal === 'SHORT'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {event.mndsSignal}
              </span>
              <span className="text-slate-500 font-mono">({event.mndsPercentile.toFixed(1)}th %ile)</span>
            </div>

            <button
              onClick={onOpenMethodology}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Methodology Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Comparative Panels: "What Changed in Management's Story?" */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. Earnings Surprise Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Reported Fundamentals
            </span>
            <span className="text-[10px] font-mono text-slate-500">Source: SEC Form 8-K</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-slate-400">EPS (Act vs Est)</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-100">
                ${event.epsActual.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">vs ${event.epsEstimate.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 font-mono text-xs">
                {event.epsSurprise >= 0 ? (
                  <span className="flex items-center text-emerald-400">
                    <ArrowUpRight className="h-3.5 w-3.5" /> +{event.epsSurprise.toFixed(2)}%
                  </span>
                ) : (
                  <span className="flex items-center text-rose-400">
                    <ArrowDownRight className="h-3.5 w-3.5" /> {event.epsSurprise.toFixed(2)}%
                  </span>
                )}
                <span className="text-[10px] text-slate-500">Surprise</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Revenue (Act vs Est)</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-100">
                ${event.revActual.toFixed(2)}B{' '}
                <span className="text-xs font-normal text-slate-400">vs ${event.revEstimate.toFixed(2)}B</span>
              </div>
              <div className="mt-1 flex items-center gap-1 font-mono text-xs">
                {event.revSurprise >= 0 ? (
                  <span className="flex items-center text-emerald-400">
                    <ArrowUpRight className="h-3.5 w-3.5" /> +{event.revSurprise.toFixed(2)}%
                  </span>
                ) : (
                  <span className="flex items-center text-rose-400">
                    <ArrowDownRight className="h-3.5 w-3.5" /> {event.revSurprise.toFixed(2)}%
                  </span>
                )}
                <span className="text-[10px] text-slate-500">Surprise</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-950/60 p-2.5 text-[11px] text-slate-400 border border-slate-850">
            <span className="font-semibold text-slate-300">Hypothesis H5 Check:</span> Does narrative shift contain
            alpha beyond these surprise numbers?
          </div>
        </div>

        {/* 2. Sentiment Delta Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sentiment vs Historical Baseline
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Loughran-McDonald</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-slate-400">Current Quarter</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-100">
                {(event.sentimentCurrent * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Prior: {(event.sentimentPrior * 100).toFixed(1)}%</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Sentiment Shift (Δ)</div>
              <div className="mt-1 font-mono text-lg font-bold">
                {event.sentimentDelta >= 0 ? (
                  <span className="text-emerald-400">+{event.sentimentDelta.toFixed(2)}σ</span>
                ) : (
                  <span className="text-rose-400">{event.sentimentDelta.toFixed(2)}σ</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">Relative to Self Baseline</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-950/60 p-2 text-xs border border-slate-850 font-mono">
            <span className="text-slate-400">Prepared Remarks Sentiment:</span>
            <span className="font-bold text-slate-200">{(event.preparedSentiment * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* 3. Uncertainty & Confidence Shifts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Uncertainty & Conviction
            </span>
            <span className="text-[10px] font-mono text-amber-400">Linguistic Ratio</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-slate-400">Uncertainty Shift (Δ)</div>
              <div className="mt-1 font-mono text-lg font-bold">
                {event.uncertaintyDelta <= 0 ? (
                  <span className="text-emerald-400">{event.uncertaintyDelta.toFixed(2)}σ</span>
                ) : (
                  <span className="text-rose-400">+{event.uncertaintyDelta.toFixed(2)}σ</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">Hedging token frequency</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Confidence Shift (Δ)</div>
              <div className="mt-1 font-mono text-lg font-bold">
                {event.confidenceDelta >= 0 ? (
                  <span className="text-emerald-400">+{event.confidenceDelta.toFixed(2)}σ</span>
                ) : (
                  <span className="text-rose-400">{event.confidenceDelta.toFixed(2)}σ</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500">Binding commitment verbs</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-950/60 p-2 text-xs border border-slate-850 font-mono">
            <span className="text-slate-400">Uncertainty Rate:</span>
            <span className="font-bold text-slate-200">{(event.uncertaintyCurrent * 100).toFixed(2)}% of words</span>
          </div>
        </div>

        {/* 4. Semantic Narrative Shock */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Semantic Narrative Shock
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Embedding Cosine</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-slate-400">Similarity vs Prior Quarter</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-100">
                {event.semanticSimilarityPrior.toFixed(3)}
              </div>
              <div className="text-[10px] text-slate-500">Cosine similarity</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Narrative Shock (1 - Sim)</div>
              <div className="mt-1 font-mono text-lg font-bold text-cyan-400">
                {event.narrativeShock.toFixed(3)}
              </div>
              <div className="text-[10px] text-slate-500">Semantic deviation</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-950/60 p-2 text-xs border border-slate-850 font-mono">
            <span className="text-slate-400">Similarity vs 4Q Centroid:</span>
            <span className="font-bold text-slate-200">{event.semanticSimilarityCentroid.toFixed(3)}</span>
          </div>
        </div>

        {/* 5. Topic Evolution (Jensen-Shannon) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Topic Evolution & Shifts
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Jensen-Shannon Δ</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">Topic Distribution Divergence:</span>
            <span className="font-mono text-sm font-bold text-cyan-400">{event.topicDeltaJS.toFixed(3)}</span>
          </div>

          {/* New / Emerging Topics */}
          <div className="mt-3 space-y-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Emerging Topics:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {event.newTopics.length > 0 ? (
                  event.newTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-800"
                    >
                      + {top}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-500 italic">None above threshold</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Fading / Declining:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {event.decliningTopics.length > 0 ? (
                  event.decliningTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-rose-950/80 px-2 py-0.5 text-[10px] font-medium text-rose-300 border border-rose-800"
                    >
                      - {top}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-500 italic">None above threshold</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Scripted vs Q&A Divergence */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prepared Remarks vs Q&A
            </span>
            <span className="text-[10px] font-mono text-amber-400">Executive Friction</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-slate-400">Q&A Sentiment Divergence</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-100">
                +{event.qaSentimentDivergence.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500">Prepared - Q&A</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Q&A Uncertainty Spike</div>
              <div className="mt-1 font-mono text-lg font-bold text-amber-400">
                +{event.qaUncertaintyDivergence.toFixed(3)}
              </div>
              <div className="text-[10px] text-slate-500">Q&A - Prepared</div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-950/60 p-2.5 text-[11px] text-slate-400 border border-slate-850">
            {event.qaSentimentDivergence > 0.18 ? (
              <span className="text-amber-300">
                ⚠️ High Divergence: Executive prepared script was substantially rosier than unscripted analyst Q&A answers.
              </span>
            ) : (
              <span className="text-slate-400">
                Balanced: Management maintained steady demeanor across prepared and live interrogation.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary Scorecard Strip: Final MNDS Signal vs Realization */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-400 border border-cyan-800">
                MNDS COMPOSITE SCORE
              </span>
              <span className="font-mono text-2xl font-extrabold text-slate-100">
                {event.mndsScore >= 0 ? `+${event.mndsScore.toFixed(2)}` : event.mndsScore.toFixed(2)}
              </span>
              <span className="font-mono text-sm text-slate-400">
                (z = {event.mndsZScore >= 0 ? `+${event.mndsZScore.toFixed(2)}` : event.mndsZScore.toFixed(2)})
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Combines 6 narrative orthogonal dimensions into a cross-sectional equity alpha signal.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Alpha Signal</div>
              <div className="font-mono text-sm font-bold text-slate-200">{event.mndsSignal}</div>
            </div>

            <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Predicted 5D Drift</div>
              <div className="font-mono text-sm font-bold text-cyan-400">
                {event.mlPredictedReturn >= 0 ? `+${(event.mlPredictedReturn * 100).toFixed(2)}%` : `${(event.mlPredictedReturn * 100).toFixed(2)}%`}
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Realized 5D Return</div>
              <div className="font-mono text-sm font-bold text-slate-100">
                {event.actual5dReturn >= 0 ? (
                  <span className="text-emerald-400">+{(event.actual5dReturn * 100).toFixed(2)}%</span>
                ) : (
                  <span className="text-rose-400">{(event.actual5dReturn * 100).toFixed(2)}%</span>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">CAR [0, +5]</div>
              <div className="font-mono text-sm font-bold text-emerald-400">
                {event.carZeroPlus5 >= 0 ? `+${(event.carZeroPlus5 * 100).toFixed(2)}%` : `${(event.carZeroPlus5 * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Sentence Level Linguistic Deep-Dive */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              Verbatim Transcript Linguistic Extraction
            </h2>
            <p className="text-xs text-slate-400">
              Auditable sentence segmentation mapped to speaker roles, sections, sentiment polarity, and topic markers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Section:</span>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
              {(['ALL', 'PREPARED_REMARKS', 'Q_AND_A'] as const).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSectionFilter(sec)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    selectedSectionFilter === sec
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sec === 'ALL' ? 'All' : sec === 'PREPARED_REMARKS' ? 'Prepared' : 'Q&A'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredSentences.map((sent) => (
            <div
              key={sent.id}
              className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-200">{sent.speaker}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold ${
                      sent.role === 'CEO'
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                        : sent.role === 'CFO'
                        ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                        : sent.role === 'Analyst'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {sent.role}
                  </span>
                  <span className="rounded bg-slate-900 px-1.5 py-0.2 font-mono text-[10px] text-slate-400 border border-slate-800">
                    {sent.section}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-slate-400">
                    Sentiment:{' '}
                    <strong className={sent.sentiment >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {sent.sentiment >= 0 ? `+${sent.sentiment.toFixed(2)}` : sent.sentiment.toFixed(2)}
                    </strong>
                  </span>
                  {sent.uncertaintyCount > 0 && (
                    <span className="text-amber-400">⚠️ {sent.uncertaintyCount} Uncertain</span>
                  )}
                  {sent.confidenceCount > 0 && (
                    <span className="text-emerald-400">✓ {sent.confidenceCount} Conviction</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">"{sent.text}"</p>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-mono">Topics Identified:</span>
                {sent.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-cyan-950/60 px-2 py-0.5 font-mono text-[10px] text-cyan-300 border border-cyan-800/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
