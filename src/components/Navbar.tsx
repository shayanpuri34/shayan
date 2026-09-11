import React from 'react';
import { 
  BarChart3, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Cpu, 
  Download, 
  FileCode,
  Terminal,
  Activity
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  runMode: 'DEMO' | 'FULL';
  setRunMode: (mode: 'DEMO' | 'FULL') => void;
  onOpenMethodology: () => void;
  onExportAllCSVs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  runMode,
  setRunMode,
  onOpenMethodology,
  onExportAllCSVs
}) => {
  const navItems = [
    { id: 'dashboard', label: "Management's Story", icon: Cpu },
    { id: 'mnds', label: 'MNDS Signal Engine', icon: Activity },
    { id: 'event_study', label: 'Event Study & CAR', icon: BarChart3 },
    { id: 'regression', label: 'Regressions & Ablation', icon: Layers },
    { id: 'backtest', label: 'Backtester & Risk', icon: TrendingUp },
    { id: 'audit', label: 'Leakage Audit', icon: ShieldCheck, badge: '13/13 PASS' },
    { id: 'code', label: 'Python & Notebook', icon: FileCode }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-inner">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-bold tracking-wider text-slate-100 uppercase">
                Earnings-Call NLP Alpha Engine
              </span>
              <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-400 border border-cyan-800/60">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Management Narrative Intelligence & Predictive Equity Research
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Run Mode Switcher */}
          <div className="hidden sm:flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            <button
              onClick={() => setRunMode('DEMO')}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                runMode === 'DEMO'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Demo (8 Tickers)
            </button>
            <button
              onClick={() => setRunMode('FULL')}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                runMode === 'FULL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full (12 Mega-Caps)
            </button>
          </div>

          {/* Methodology Button */}
          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline">Methodology</span>
          </button>

          {/* Export CSVs */}
          <button
            onClick={onExportAllCSVs}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export CSVs</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="border-t border-slate-850 bg-slate-950/70 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 rounded-full bg-emerald-950 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-emerald-400 border border-emerald-800/80">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
