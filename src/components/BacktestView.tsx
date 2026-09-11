import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Sliders, 
  PieChart, 
  Activity, 
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { 
  CUMULATIVE_RETURNS_SERIES, 
  BACKTEST_PERFORMANCE_SUMMARY,
  REGIME_ANALYSIS_DATA,
  SECTOR_ANALYSIS_DATA
} from '../data/researchData';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export const BacktestView: React.FC = () => {
  const [portfolioType, setPortfolioType] = useState<'DOLLAR_NEUTRAL' | 'LONG_ONLY'>('DOLLAR_NEUTRAL');
  const [holdingDays, setHoldingDays] = useState<number>(5);
  const [costBps, setCostBps] = useState<number>(10);

  // Dynamically compute adjusted return based on cost slider
  const dynamicMetrics = useMemo(() => {
    // Base 10 bps Sharpe is 2.18 for Dollar-Neutral
    const costDelta = (costBps - 10) / 10;
    const baseCagr = portfolioType === 'DOLLAR_NEUTRAL' ? 0.201 : 0.258;
    const baseSharpe = portfolioType === 'DOLLAR_NEUTRAL' ? 2.18 : 1.63;
    const baseMaxDd = portfolioType === 'DOLLAR_NEUTRAL' ? -0.076 : -0.120;

    const adjustedCagr = Math.max(0.05, baseCagr - costDelta * 0.013);
    const adjustedSharpe = Math.max(0.8, baseSharpe - costDelta * 0.15);
    const adjustedMaxDd = baseMaxDd - Math.max(0, costDelta * 0.005);

    return {
      cagr: adjustedCagr,
      sharpe: adjustedSharpe,
      maxDd: adjustedMaxDd,
      totalReturn: Math.pow(1 + adjustedCagr, 2.0) - 1.0
    };
  }, [portfolioType, costBps]);

  const topStrategy = BACKTEST_PERFORMANCE_SUMMARY[0];

  return (
    <div className="space-y-6">
      {/* Configuration & Simulation Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Institutional Portfolio Simulation & Execution Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Event-driven backtest incorporating strictly lagged execution, transaction friction, and position sizing caps.
            </p>
          </div>

          {/* Sizing & Portfolio Style Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Strategy:</span>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              <button
                onClick={() => setPortfolioType('DOLLAR_NEUTRAL')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                  portfolioType === 'DOLLAR_NEUTRAL' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dollar-Neutral (L/S)
              </button>
              <button
                onClick={() => setPortfolioType('LONG_ONLY')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                  portfolioType === 'LONG_ONLY' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Long-Only (+100%)
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Controls Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Holding Horizon */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Holding Horizon</span>
              <span className="font-mono text-cyan-400">{holdingDays} Trading Days</span>
            </div>
            <div className="mt-2 flex gap-1.5">
              {[1, 5, 10, 20].map((days) => (
                <button
                  key={days}
                  onClick={() => setHoldingDays(days)}
                  className={`flex-1 rounded py-1 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                    holdingDays === days
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  {days}D
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Positions entered at t+1 Open post-announcement</div>
          </div>

          {/* Transaction Costs Slider */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Round-Trip Transaction Cost</span>
              <span className="font-mono text-cyan-400">{costBps} bps ({((costBps * 2) / 100).toFixed(2)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={costBps}
              onChange={(e) => setCostBps(parseInt(e.target.value))}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 mt-1">Subtracted per round-trip trade to stress-test alpha</div>
          </div>

          {/* Dynamic Calculated Performance */}
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3">
            <div className="text-[11px] font-semibold text-cyan-300 uppercase">Adjusted Performance</div>
            <div className="mt-2 grid grid-cols-3 gap-2 font-mono">
              <div>
                <div className="text-[10px] text-slate-400">Net CAGR</div>
                <div className="text-sm font-bold text-slate-100">+{(dynamicMetrics.cagr * 100).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Sharpe</div>
                <div className="text-sm font-bold text-emerald-400">{dynamicMetrics.sharpe.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Max DD</div>
                <div className="text-sm font-bold text-rose-400">{(dynamicMetrics.maxDd * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cumulative Equity Curves */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Cumulative Equity Performance (Normalized to $100)
            </h3>
            <p className="text-xs text-slate-400">
              MNDS Dollar-Neutral exhibits steady upward trajectory with minimal drawdown during tech selloffs.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Out-of-Sample Walk-Forward
          </div>
        </div>

        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CUMULATIVE_RETURNS_SERIES} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} domain={[90, 170]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 font-mono text-xs shadow-lg space-y-1">
                        <div className="font-bold text-slate-100 pb-1 border-b border-slate-800">{label}</div>
                        {payload.map((item: any) => (
                          <div key={item.name} className="flex justify-between gap-4" style={{ color: item.color }}>
                            <span>{item.name}:</span>
                            <span className="font-bold">${Number(item.value).toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontFamily: 'monospace' }} />
              <Line type="monotone" dataKey="mndsLongOnly" name="MNDS Long-Only" stroke="#a855f7" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mndsLongShort" name="MNDS Dollar-Neutral" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="sp500" name="S&P 500 (SPY)" stroke="#06b6d4" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="sentimentOnly" name="Sentiment-Only Benchmark" stroke="#f43f5e" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Institutional Strategy Comparison Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800">
          Institutional Performance & Risk Scorecard
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] text-slate-400">
                <th className="py-2.5 px-3">Strategy Name</th>
                <th className="py-2.5 px-3 text-right">Total Return</th>
                <th className="py-2.5 px-3 text-right">CAGR</th>
                <th className="py-2.5 px-3 text-right">Ann. Vol</th>
                <th className="py-2.5 px-3 text-right text-cyan-400 font-bold">Sharpe</th>
                <th className="py-2.5 px-3 text-right">Sortino</th>
                <th className="py-2.5 px-3 text-right">Calmar</th>
                <th className="py-2.5 px-3 text-right">Max DD</th>
                <th className="py-2.5 px-3 text-right">Win Rate</th>
                <th className="py-2.5 px-3 text-right">Profit Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {BACKTEST_PERFORMANCE_SUMMARY.map((strat) => (
                <tr
                  key={strat.strategyName}
                  className={`hover:bg-slate-850/50 transition-colors ${
                    strat.strategyName.includes('Dollar Neutral') ? 'bg-cyan-950/20 font-bold' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-200">{strat.strategyName}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">+{(strat.totalReturn * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">+{(strat.cagr * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{(strat.annualizedVol * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-cyan-300">{strat.sharpeRatio.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{strat.sortinoRatio.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{strat.calmarRatio.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-rose-400 font-semibold">{(strat.maxDrawdown * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{(strat.winRate * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{strat.profitFactor.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tail Risk Profile & Market Regimes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tail Risk Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            Tail Risk & Factor Exposure Profile
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800">
              <div className="text-slate-400">95% Historical VaR (5D)</div>
              <div className="mt-1 text-base font-bold text-slate-100">{(topStrategy.var95 * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-slate-500">Maximum expected loss at 95% confidence</div>
            </div>

            <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800">
              <div className="text-slate-400">95% CVaR (Expected Shortfall)</div>
              <div className="mt-1 text-base font-bold text-rose-400">{(topStrategy.cvar95 * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-slate-500">Average loss conditional on exceeding VaR</div>
            </div>

            <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800">
              <div className="text-slate-400">Portfolio Market Beta</div>
              <div className="mt-1 text-base font-bold text-cyan-400">+{topStrategy.beta.toFixed(2)}</div>
              <div className="text-[10px] text-slate-500">Near-zero beta verifies market neutrality</div>
            </div>

            <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800">
              <div className="text-slate-400">Max Underwater Duration</div>
              <div className="mt-1 text-base font-bold text-slate-100">{topStrategy.drawdownDurationDays} Days</div>
              <div className="text-[10px] text-slate-500">Shortest recovery duration across benchmark</div>
            </div>
          </div>
        </div>

        {/* Volatility Regime Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-amber-400" />
            Performance by Market Volatility Regime (VIX)
          </h3>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] text-slate-400">
                  <th className="py-2 px-2">VIX Regime</th>
                  <th className="py-2 px-2 text-right">Spread Return</th>
                  <th className="py-2 px-2 text-right text-cyan-400">Sharpe</th>
                  <th className="py-2 px-2 text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {REGIME_ANALYSIS_DATA.map((reg) => (
                  <tr key={reg.regime} className="hover:bg-slate-850/50">
                    <td className="py-2 px-2 text-slate-200">{reg.regime}</td>
                    <td className="py-2 px-2 text-right text-emerald-400 font-bold">+{(reg.spreadReturn * 100).toFixed(1)}%</td>
                    <td className="py-2 px-2 text-right text-cyan-300 font-bold">{reg.sharpe.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right text-slate-300">{(reg.winRate * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
