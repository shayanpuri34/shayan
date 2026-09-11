import React, { useState } from 'react';
import { 
  Layers, 
  Table, 
  BarChart, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Cpu,
  FileCheck
} from 'lucide-react';
import { CROSS_SECTIONAL_REGRESSION_DATA, ABLATION_STUDY_DATA } from '../data/researchData';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export const RegressionsView: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'r2' | 'sharpe' | 'auc'>('r2');

  const chartData = ABLATION_STUDY_DATA.map((m) => ({
    name: m.modelId,
    fullName: m.modelName,
    r2: Number((m.r2 * 100).toFixed(1)),
    auc: Number((m.auc * 100).toFixed(1)),
    sharpe: Number(m.sharpe.toFixed(2)),
    accuracy: Number((m.dirAccuracy * 100).toFixed(1))
  }));

  return (
    <div className="space-y-6">
      {/* Overview & Regression Diagnostics */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              Cross-Sectional Multi-Factor Regressions & Control Testing
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dependent Variable: <span className="font-mono text-cyan-400 font-bold">{CROSS_SECTIONAL_REGRESSION_DATA.dependentVariable}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="rounded bg-slate-950 px-2.5 py-1 text-slate-300 border border-slate-800">
              R² = <strong className="text-cyan-400">{CROSS_SECTIONAL_REGRESSION_DATA.rSquared.toFixed(3)}</strong>
            </span>
            <span className="rounded bg-slate-950 px-2.5 py-1 text-slate-300 border border-slate-800">
              Adj. R² = <strong className="text-cyan-400">{CROSS_SECTIONAL_REGRESSION_DATA.adjRSquared.toFixed(3)}</strong>
            </span>
            <span className="rounded bg-slate-950 px-2.5 py-1 text-slate-300 border border-slate-800">
              F-Stat = <strong className="text-emerald-400">{CROSS_SECTIONAL_REGRESSION_DATA.fStat.toFixed(2)}***</strong>
            </span>
          </div>
        </div>

        {/* Coefficients Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] text-slate-400">
                <th className="py-2.5 px-3">Explanatory Factor</th>
                <th className="py-2.5 px-3 text-right">Coefficient (β)</th>
                <th className="py-2.5 px-3 text-right">Std. Error</th>
                <th className="py-2.5 px-3 text-right text-cyan-400">t-Statistic</th>
                <th className="py-2.5 px-3 text-right">p-Value</th>
                <th className="py-2.5 px-3 text-right">95% Conf. Interval</th>
                <th className="py-2.5 px-3 text-center">Sig. Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {CROSS_SECTIONAL_REGRESSION_DATA.coefficients.map((row) => (
                <tr
                  key={row.variable}
                  className={`hover:bg-slate-850/50 transition-colors ${
                    row.variable.includes('MNDS') ? 'bg-cyan-950/20 font-bold' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-200 flex items-center gap-1.5">
                    {row.variable.includes('MNDS') && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                    {row.variable}
                  </td>
                  <td className={`py-2.5 px-3 text-right ${row.coef >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.coef >= 0 ? `+${row.coef.toFixed(4)}` : row.coef.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{row.stdErr.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-cyan-300">
                    {row.tStat >= 0 ? `+${row.tStat.toFixed(2)}` : row.tStat.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    {row.pValue < 0.0001 ? '< 0.0001' : row.pValue.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-mono text-[11px]">
                    [{row.ci95Lower.toFixed(4)}, {row.ci95Upper.toFixed(4)}]
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.significant ? (
                      <span className="rounded bg-emerald-950 px-1.5 py-0.2 text-[10px] text-emerald-400 border border-emerald-800">
                        {row.pValue < 0.001 ? 'p < 0.001 ***' : 'p < 0.05 *'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">n.s.</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fama-MacBeth Summary Note */}
        {CROSS_SECTIONAL_REGRESSION_DATA.famaMacBethAvgCoefficients && (
          <div className="mt-4 rounded-lg bg-slate-950/60 p-3 text-xs text-slate-400 border border-slate-850 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Fama-MacBeth Cross-Sectional Validation: </strong>
              {CROSS_SECTIONAL_REGRESSION_DATA.famaMacBethAvgCoefficients.map((f, i) => (
                <span key={f.variable} className="mr-3">
                  {f.variable}: <span className="font-mono text-cyan-300 font-bold">+{f.avgBeta.toFixed(4)}</span> (t = {f.tStat.toFixed(2)}, p = {f.pValue.toFixed(4)})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ablation Study: Model A through Model E */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              Ablation Study: Incremental Explanatory Power (Model A → Model E)
            </h3>
            <p className="text-xs text-slate-400">
              Isolates the exact alpha contribution of Self-Baseline Narrative Delta and Q&A Divergence beyond pure sentiment.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Chart Metric:</span>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              <button
                onClick={() => setSelectedMetric('r2')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${selectedMetric === 'r2' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                R² (%)
              </button>
              <button
                onClick={() => setSelectedMetric('sharpe')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${selectedMetric === 'sharpe' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                Sharpe Ratio
              </button>
              <button
                onClick={() => setSelectedMetric('auc')}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${selectedMetric === 'auc' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                AUC ROC (%)
              </button>
            </div>
          </div>
        </div>

        {/* Ablation Chart */}
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 font-mono text-xs shadow-lg space-y-1">
                        <div className="font-bold text-slate-100">{d.fullName}</div>
                        <div className="text-cyan-400">R²: {d.r2}%</div>
                        <div className="text-emerald-400">5D Sharpe Ratio: {d.sharpe}</div>
                        <div className="text-purple-400">Directional Accuracy: {d.accuracy}%</div>
                        <div className="text-slate-300">AUC ROC: {d.auc}%</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey={selectedMetric} 
                fill="#06b6d4" 
                radius={[4, 4, 0, 0]} 
                name={selectedMetric === 'r2' ? 'R² (%)' : selectedMetric === 'sharpe' ? 'Sharpe Ratio' : 'AUC ROC (%)'} 
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        {/* Ablation Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] text-slate-400">
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3 text-right">R²</th>
                <th className="py-2.5 px-3 text-right">MAE</th>
                <th className="py-2.5 px-3 text-right">AUC ROC</th>
                <th className="py-2.5 px-3 text-right">Accuracy</th>
                <th className="py-2.5 px-3 text-right text-cyan-400 font-bold">Sharpe (5D)</th>
                <th className="py-2.5 px-3 text-right">Max DD</th>
                <th className="py-2.5 px-3">Feature Set Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {ABLATION_STUDY_DATA.map((m) => (
                <tr
                  key={m.modelId}
                  className={`hover:bg-slate-850/50 transition-colors ${
                    m.modelId === 'MODEL_E' ? 'bg-cyan-950/30 font-bold' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-200 flex items-center gap-1.5">
                    {m.modelId === 'MODEL_E' && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                    {m.modelName}
                  </td>
                  <td className="py-2.5 px-3 text-right text-cyan-300 font-bold">{m.r2.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{m.mae.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{m.auc.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{(m.dirAccuracy * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{m.sharpe.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-rose-400">{(m.maxDrawdown * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-400 font-sans">{m.featuresIncluded.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
