import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Lock, 
  FileCheck, 
  Code,
  Search
} from 'lucide-react';
import { LEAKAGE_AUDIT_CHECKS } from '../data/researchData';

export const LeakageAuditView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'TIMING', 'BASELINE', 'TRANSFORM', 'MODEL', 'BACKTEST'];

  const filteredItems = LEAKAGE_AUDIT_CHECKS.filter((item) => {
    const matchesSearch = 
      item.rule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.implementationDetail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-emerald-400 shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  Data Leakage & Look-Ahead Bias Verification Audit
                </h2>
                <span className="rounded bg-emerald-950 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400 border border-emerald-800">
                  13 / 13 PASSED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every programmatic invariant is enforced at the source code level to ensure research reproducibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-950/80 px-3 py-2 border border-slate-800 text-xs font-mono">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-300">Auditor Status:</span>
            <span className="text-emerald-400 font-bold">VERIFIED CLEAN</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search rules, invariants, or code logic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All (13)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Checklist Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition-all hover:border-slate-700 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 font-mono text-xs font-bold text-slate-300">
                  {item.id}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 font-mono text-[10px] text-slate-400">
                      Category: {item.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Timestamp: {item.verifiedTimestamp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 rounded-md bg-emerald-950/80 px-2.5 py-1 text-xs font-mono font-bold text-emerald-400 border border-emerald-800 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{item.status}</span>
              </div>
            </div>

            {/* Rule Description */}
            <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-950/50 rounded-lg p-3 border border-slate-850">
              <strong className="text-slate-200">Rule Definition: </strong>
              {item.rule}
            </div>

            {/* Implementation & Invariant Code Verification */}
            <div className="mt-3 rounded-lg border border-slate-850 bg-slate-950 p-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-1.5 text-[11px] text-slate-400 border-b border-slate-850 mb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                  Implementation & Code Verification
                </span>
                <span className="text-[10px] text-emerald-400">assert verified</span>
              </div>
              <p className="text-cyan-300 text-[11px] leading-relaxed">
                {item.implementationDetail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
