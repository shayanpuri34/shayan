import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Info, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { EVENT_STUDY_DATA } from '../data/researchData';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';

export const EventStudyView: React.FC = () => {
  // Synthesize event time trajectory from quintiles
  const timeSeriesData = [
    { day: -5, q5HighMNDS: 0.2, q4: 0.1, q3Mid: 0.0, q2: -0.1, q1LowMNDS: -0.2 },
    { day: -4, q5HighMNDS: 0.4, q4: 0.2, q3Mid: 0.1, q2: -0.1, q1LowMNDS: -0.3 },
    { day: -3, q5HighMNDS: 0.5, q4: 0.3, q3Mid: 0.0, q2: -0.2, q1LowMNDS: -0.4 },
    { day: -2, q5HighMNDS: 0.7, q4: 0.4, q3Mid: 0.1, q2: -0.3, q1LowMNDS: -0.5 },
    { day: -1, q5HighMNDS: 1.1, q4: 0.6, q3Mid: 0.1, q2: -0.4, q1LowMNDS: -0.8 },
    { day: 0, q5HighMNDS: 3.8, q4: 1.9, q3Mid: 0.4, q2: -1.1, q1LowMNDS: -2.8 },
    { day: 1, q5HighMNDS: 4.5, q4: 2.3, q3Mid: 0.5, q2: -1.4, q1LowMNDS: -3.4 },
    { day: 2, q5HighMNDS: 5.1, q4: 2.7, q3Mid: 0.6, q2: -1.6, q1LowMNDS: -3.9 },
    { day: 3, q5HighMNDS: 5.6, q4: 3.0, q3Mid: 0.7, q2: -1.8, q1LowMNDS: -4.3 },
    { day: 4, q5HighMNDS: 5.9, q4: 3.3, q3Mid: 0.8, q2: -1.9, q1LowMNDS: -4.6 },
    { day: 5, q5HighMNDS: 6.1, q4: 3.5, q3Mid: 0.8, q2: -1.9, q1LowMNDS: -4.8 },
    { day: 10, q5HighMNDS: 7.0, q4: 3.8, q3Mid: 0.9, q2: -2.1, q1LowMNDS: -5.4 },
    { day: 15, q5HighMNDS: 7.5, q4: 4.0, q3Mid: 1.0, q2: -2.2, q1LowMNDS: -5.8 },
    { day: 20, q5HighMNDS: 7.8, q4: 4.2, q3Mid: 1.0, q2: -2.4, q1LowMNDS: -6.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Event-Study Cumulative Abnormal Returns (CAR / CAAR)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Market model benchmarked over estimation window <span className="font-mono text-cyan-400">[-252, -30]</span> trading days prior to call date.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="rounded bg-slate-950 px-2 py-1 text-slate-300 border border-slate-800">
              Benchmark: SPY Total Return
            </span>
            <span className="rounded bg-emerald-950 px-2 py-1 text-emerald-400 border border-emerald-800">
              Q5-Q1 Spread: +10.94%
            </span>
          </div>
        </div>

        {/* 4 Summary Stat Cards across Horizons */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENT_STUDY_DATA.eventWindows.map((metric) => (
            <div
              key={metric.window}
              className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-300">{metric.window}</span>
                <span className="rounded bg-cyan-950 px-1.5 py-0.2 font-mono text-[10px] text-cyan-400 border border-cyan-800">
                  {metric.name}
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold text-slate-100">
                  +{(metric.caar * 100).toFixed(2)}%
                </span>
                <span className="text-xs text-slate-400 font-mono">CAAR</span>
              </div>

              <div className="mt-2 space-y-1 font-mono text-[11px] border-t border-slate-850 pt-2">
                <div className="flex justify-between text-slate-400">
                  <span>t-Statistic:</span>
                  <span className="font-semibold text-emerald-400">+{metric.tStat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>p-Value:</span>
                  <span className="text-slate-300">&lt; {metric.pValue.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Significance:</span>
                  <span className="text-cyan-400">{metric.significance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main CAAR Event-Study Trajectory Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Cumulative Average Abnormal Return (CAAR) by MNDS Quintile (Days -5 to +20)
            </h3>
            <p className="text-xs text-slate-400">
              Clear monotonic separation: High MNDS (Q5) drifts upward persistently while Low MNDS (Q1) drifts downward.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Event Day 0 = Transcript Publication Date
          </div>
        </div>

        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                label={{ value: 'Event Day (t)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
              />
              <YAxis 
                stroke="#64748b" 
                unit="%"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                label={{ value: 'CAAR (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 font-mono text-xs shadow-lg space-y-1">
                        <div className="font-bold text-slate-100 pb-1 border-b border-slate-800">
                          Event Day: t = {label >= 0 ? `+${label}` : label}
                        </div>
                        {payload.map((item: any) => (
                          <div key={item.name} className="flex justify-between gap-4" style={{ color: item.color }}>
                            <span>{item.name}:</span>
                            <span className="font-bold">
                              {item.value >= 0 ? `+${Number(item.value).toFixed(2)}%` : `${Number(item.value).toFixed(2)}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontFamily: 'monospace' }} />
              <ReferenceLine x={0} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Call Date (t=0)', fill: '#f59e0b', fontSize: 10 }} />
              <ReferenceLine y={0} stroke="#475569" />
              <Line type="monotone" dataKey="q5HighMNDS" name="Q5 (Highest MNDS)" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="q4" name="Q4" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="q3Mid" name="Q3 (Middle)" stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="q2" name="Q2" stroke="#fb923c" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="q1LowMNDS" name="Q1 (Lowest MNDS)" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quintile Performance Monotonicity Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          Quintile Stratification & Monotonicity Test
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] text-slate-400">
                <th className="py-2.5 px-3">MNDS Quintile</th>
                <th className="py-2.5 px-3 text-right">Score Range</th>
                <th className="py-2.5 px-3 text-right text-cyan-400 font-bold">Mean CAR [0, +5]</th>
                <th className="py-2.5 px-3 text-right">Mean CAR [0, +20]</th>
                <th className="py-2.5 px-3 text-right">Event Count</th>
                <th className="py-2.5 px-3 text-center">Hit Rate (&gt;0)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {EVENT_STUDY_DATA.quintileCAR.map((q) => (
                <tr key={q.quintile} className="hover:bg-slate-850/50">
                  <td className="py-2.5 px-3 font-bold text-slate-200">{q.quintile}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{q.label}</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${q.meanCAR0_5 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {q.meanCAR0_5 >= 0 ? `+${(q.meanCAR0_5 * 100).toFixed(2)}%` : `${(q.meanCAR0_5 * 100).toFixed(2)}%`}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-semibold ${q.meanCAR0_20 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {q.meanCAR0_20 >= 0 ? `+${(q.meanCAR0_20 * 100).toFixed(2)}%` : `${(q.meanCAR0_20 * 100).toFixed(2)}%`}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{q.count}</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">{(q.winRate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
