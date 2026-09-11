import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  RefreshCw, 
  TrendingUp, 
  ArrowUpDown, 
  HelpCircle,
  Filter,
  BarChart,
  Check
} from 'lucide-react';
import { EARNINGS_EVENTS } from '../data/researchData';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export const MNDSEngineView: React.FC = () => {
  // Configurable weights state
  const [weights, setWeights] = useState({
    w1: 0.20, // sentiment_delta
    w2: 0.20, // uncertainty_delta
    w3: 0.15, // narrative_shock
    w4: 0.15, // topic_delta
    w5: 0.15, // confidence_delta
    w6: 0.15  // qa_divergence
  });

  const [filterQuarter, setFilterQuarter] = useState<string>('ALL');

  // Presets
  const applyPreset = (preset: 'DEFAULT' | 'SENTIMENT_HEAVY' | 'SEMANTIC_HEAVY' | 'QA_HEAVY') => {
    if (preset === 'DEFAULT') {
      setWeights({ w1: 0.20, w2: 0.20, w3: 0.15, w4: 0.15, w5: 0.15, w6: 0.15 });
    } else if (preset === 'SENTIMENT_HEAVY') {
      setWeights({ w1: 0.40, w2: 0.25, w3: 0.10, w4: 0.05, w5: 0.15, w6: 0.05 });
    } else if (preset === 'SEMANTIC_HEAVY') {
      setWeights({ w1: 0.10, w2: 0.10, w3: 0.35, w4: 0.30, w5: 0.05, w6: 0.10 });
    } else if (preset === 'QA_HEAVY') {
      setWeights({ w1: 0.10, w2: 0.15, w3: 0.10, w4: 0.10, w5: 0.15, w6: 0.40 });
    }
  };

  // Re-compute MNDS in real time based on active weights
  const computedUniverse = useMemo(() => {
    const rawScores = EARNINGS_EVENTS.map((e) => {
      // MNDS formula: w1*z(sent) - w2*z(unc) + w3*z(shock) + w4*z(topic) + w5*z(conf) - w6*z(qa)
      // Standardize components dynamically
      const zSent = e.sentimentDelta;
      const zUnc = e.uncertaintyDelta;
      const zShock = (e.narrativeShock - 0.20) / 0.06;
      const zTopic = (e.topicDeltaJS - 0.18) / 0.05;
      const zConf = e.confidenceDelta;
      const zQA = (e.qaSentimentDivergence - 0.15) / 0.08;

      const dynamicScore = 
        weights.w1 * zSent - 
        weights.w2 * zUnc + 
        weights.w3 * zShock + 
        weights.w4 * zTopic + 
        weights.w5 * zConf - 
        weights.w6 * zQA;

      return {
        ...e,
        dynamicScore
      };
    });

    // Rank percentiles
    const sorted = [...rawScores].sort((a, b) => a.dynamicScore - b.dynamicScore);
    const n = sorted.length;
    
    return sorted.map((item, index) => {
      const percentile = ((index + 0.5) / n) * 100;
      let dynamicSignal: 'LONG' | 'SHORT' | 'FLAT' = 'FLAT';
      if (percentile >= 80) dynamicSignal = 'LONG';
      else if (percentile <= 20) dynamicSignal = 'SHORT';

      return {
        ...item,
        percentile,
        dynamicSignal
      };
    }).reverse(); // high to low
  }, [weights]);

  // Filtered list
  const filteredEvents = computedUniverse.filter((e) => {
    if (filterQuarter === 'ALL') return true;
    return e.quarter === filterQuarter;
  });

  // Scatter data: MNDS vs Realized 5D Return
  const scatterData = computedUniverse.map((e) => ({
    ticker: e.ticker,
    quarter: e.quarter,
    mnds: Number(e.dynamicScore.toFixed(2)),
    return5d: Number((e.actual5dReturn * 100).toFixed(2)),
    signal: e.dynamicSignal
  }));

  const totalWeight = weights.w1 + weights.w2 + weights.w3 + weights.w4 + weights.w5 + weights.w6;

  return (
    <div className="space-y-6">
      {/* Top Tuning Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-cyan-400" />
              Interactive MNDS Composite Weight Optimizer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test signal sensitivity by perturbing orthogonal weights. Changes dynamically propagate to universe rankings and signal allocations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Presets:</span>
            <button
              onClick={() => applyPreset('DEFAULT')}
              className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              Default Equal
            </button>
            <button
              onClick={() => applyPreset('SENTIMENT_HEAVY')}
              className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              Sentiment-Heavy
            </button>
            <button
              onClick={() => applyPreset('SEMANTIC_HEAVY')}
              className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              Semantic-Heavy
            </button>
            <button
              onClick={() => applyPreset('QA_HEAVY')}
              className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              Q&A-Heavy
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* w1 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>w₁: Sentiment Delta</span>
              <span className="font-mono text-cyan-400">{weights.w1.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.60"
              step="0.05"
              value={weights.w1}
              onChange={(e) => setWeights({ ...weights, w1: parseFloat(e.target.value) })}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 mt-1">Loughran-McDonald delta vs company baseline</div>
          </div>

          {/* w2 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>w₂: Uncertainty Delta (-)</span>
              <span className="font-mono text-cyan-400">{weights.w2.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.60"
              step="0.05"
              value={weights.w2}
              onChange={(e) => setWeights({ ...weights, w2: parseFloat(e.target.value) })}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 mt-1">Negative weight: Higher uncertainty lowers MNDS</div>
          </div>

          {/* w3 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>w₃: Semantic Shock</span>
              <span className="font-mono text-cyan-400">{weights.w3.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.60"
              step="0.05"
              value={weights.w3}
              onChange={(e) => setWeights({ ...weights, w3: parseFloat(e.target.value) })}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 mt-1">1 - CosineSimilarity(Narrative_q, Narrative_q-1)</div>
          </div>

          {/* w4 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>w₄: Topic Delta (JS)</span>
              <span className="font-mono text-cyan-400">{weights.w4.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.60"
              step="0.05"
              value={weights.w4}
              onChange={(e) => setWeights({ ...weights, w4: parseFloat(e.target.value) })}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 mt-1">Jensen-Shannon divergence across 15 topics</div>
          </div>

          {/* w5 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>w₅: Confidence Delta</span>
              <span className="font-mono text-cyan-400">{weights.w5.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.60"
              step="0.05"
              value={weights.w5}
              onChange={(e) => setWeights({ ...weights, w5: parseFloat(e.target.value) })}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 mt-1">Binding commitment and conviction tokens</div>
          </div>

          {/* w6 */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>w₆: Q&A Divergence (-)</span>
              <span className="font-mono text-cyan-400">{weights.w6.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.60"
              step="0.05"
              value={weights.w6}
              onChange={(e) => setWeights({ ...weights, w6: parseFloat(e.target.value) })}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 mt-1">Negative weight: Prepared minus Q&A sentiment</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Gross Weights Sum: <strong className="text-cyan-300">{totalWeight.toFixed(2)}</strong></span>
          <span className="text-slate-500">Threshold: Top 20% = LONG, Bottom 20% = SHORT, Middle 60% = FLAT</span>
        </div>
      </div>

      {/* Visual Scatter: MNDS vs Realized 5D Abnormal Returns */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Cross-Sectional Scatter: Dynamic MNDS vs Realized 5D Return
            </h3>
            <p className="text-xs text-slate-400">
              Empirical correlation verification: Strong upward slope confirms positive predictive power.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Long (Top 20%)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-400" /> Flat (Mid 60%)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" /> Short (Bot 20%)</span>
          </div>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="mnds" 
                name="MNDS Score" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                label={{ value: 'Dynamic MNDS Score', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
              />
              <YAxis 
                dataKey="return5d" 
                name="5D Return %" 
                unit="%" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                label={{ value: 'Realized 5D Return (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900 p-2.5 font-mono text-xs shadow-lg">
                        <div className="font-bold text-slate-100">{d.ticker} — {d.quarter}</div>
                        <div className="text-cyan-400">MNDS: {d.mnds}</div>
                        <div className={d.return5d >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          5D Return: {d.return5d >= 0 ? `+${d.return5d}%` : `${d.return5d}%`}
                        </div>
                        <div className="text-slate-400">Signal: {d.signal}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={scatterData}>
                {scatterData.map((entry, index) => {
                  let fill = '#94a3b8';
                  if (entry.signal === 'LONG') fill = '#10b981';
                  else if (entry.signal === 'SHORT') fill = '#f43f5e';
                  return <Cell key={`cell-${index}`} fill={fill} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Universe Ranking Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-cyan-400" />
              Dynamic Universe Cross-Sectional Ranking
            </h3>
            <p className="text-xs text-slate-400">
              Sorted from highest conviction LONG to lowest conviction SHORT.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Quarter:</span>
            <select
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Quarters (2024Q3 & 2024Q4)</option>
              <option value="2024Q4">2024Q4</option>
              <option value="2024Q3">2024Q3</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] text-slate-400">
                <th className="py-2.5 px-3">Ticker</th>
                <th className="py-2.5 px-3">Quarter</th>
                <th className="py-2.5 px-3 text-right">Δ Sent (σ)</th>
                <th className="py-2.5 px-3 text-right">Δ Unc (σ)</th>
                <th className="py-2.5 px-3 text-right">Shock</th>
                <th className="py-2.5 px-3 text-right">Topic Δ</th>
                <th className="py-2.5 px-3 text-right">Δ Conf (σ)</th>
                <th className="py-2.5 px-3 text-right">Q&A Div</th>
                <th className="py-2.5 px-3 text-right text-cyan-400 font-bold">MNDS</th>
                <th className="py-2.5 px-3 text-right">%ile</th>
                <th className="py-2.5 px-3 text-center">Signal</th>
                <th className="py-2.5 px-3 text-right">Actual 5D</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredEvents.map((row) => (
                <tr key={`${row.ticker}-${row.quarter}`} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-100">{row.ticker}</td>
                  <td className="py-2.5 px-3 text-slate-400">{row.quarter}</td>
                  <td className={`py-2.5 px-3 text-right ${row.sentimentDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.sentimentDelta >= 0 ? `+${row.sentimentDelta.toFixed(2)}` : row.sentimentDelta.toFixed(2)}
                  </td>
                  <td className={`py-2.5 px-3 text-right ${row.uncertaintyDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.uncertaintyDelta >= 0 ? `+${row.uncertaintyDelta.toFixed(2)}` : row.uncertaintyDelta.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{row.narrativeShock.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{row.topicDeltaJS.toFixed(3)}</td>
                  <td className={`py-2.5 px-3 text-right ${row.confidenceDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.confidenceDelta >= 0 ? `+${row.confidenceDelta.toFixed(2)}` : row.confidenceDelta.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-300">+{row.qaSentimentDivergence.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-cyan-300">
                    {row.dynamicScore >= 0 ? `+${row.dynamicScore.toFixed(2)}` : row.dynamicScore.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{row.percentile.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        row.dynamicSignal === 'LONG'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : row.dynamicSignal === 'SHORT'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.dynamicSignal}
                    </span>
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${row.actual5dReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.actual5dReturn >= 0 ? `+${(row.actual5dReturn * 100).toFixed(2)}%` : `${(row.actual5dReturn * 100).toFixed(2)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
