/**
 * CaHeader — Top navigation bar for the CA & Financial Studio.
 *
 * ALGORITHM (data-driven):
 *   TAB_CONFIG is the single source of truth for all navigation tabs.
 *   Adding a new tab = add one entry to TAB_CONFIG. No other changes needed.
 *   Active styling is computed from activeTab === tab.id comparison.
 */
"use client";

import React from "react";
import { Calculator, LineChart, ShieldCheck, Cpu, BookOpen, TrendingDown } from "lucide-react";

// ── Tab configuration (DATA — not logic) ──────────────────────────────────────
// Each tab: id (string literal), label (display text), Icon (lucide component),
// activeColor (Tailwind classes applied when this tab is selected).
export type StudioTab = "tvm" | "forecasting" | "risk" | "annuity" | "pv" | "ledger";

interface TabConfig {
  id: StudioTab;
  label: string;
  shortLabel: string;
  Icon: React.ElementType;
  activeColor: string;
}

const TAB_CONFIG: TabConfig[] = [
  {
    id: "tvm",
    label: "Time Value of Money",
    shortLabel: "TVM",
    Icon: LineChart,
    activeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "annuity",
    label: "FV Annuities",
    shortLabel: "Annuity",
    Icon: Calculator,
    activeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  },
  {
    id: "pv",
    label: "PV Lump Sum",
    shortLabel: "PV",
    Icon: TrendingDown,
    activeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  {
    id: "forecasting",
    label: "TimesFM AI",
    shortLabel: "AI",
    Icon: Cpu,
    activeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    id: "risk",
    label: "Risk Premium",
    shortLabel: "Risk",
    Icon: ShieldCheck,
    activeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: "ledger",
    label: "CA Ledger",
    shortLabel: "Ledger",
    Icon: BookOpen,
    activeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
];

export interface CaHeaderProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
}

export function CaHeader({ activeTab, onSelectTab }: CaHeaderProps) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-xl">
      <div className="flex flex-col gap-4">
        {/* Brand row */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              CA & Financial Studio
            </h1>
            <p className="text-[11px] text-slate-500">
              Chartered Accountant · CFA Level 1 Quantitative Toolkit · Powered by Google TimesFM
            </p>
          </div>
        </div>

        {/* Tab navigation — rendered from TAB_CONFIG data array */}
        <nav className="flex items-center gap-1 flex-wrap bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isActive
                    ? `${tab.activeColor} shadow-md`
                    : "text-slate-500 border-transparent hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <tab.Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
