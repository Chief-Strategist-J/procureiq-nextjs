'use client';

import React from 'react';
import { Calculator, LineChart, ShieldCheck, Cpu } from 'lucide-react';

export interface CaHeaderProps {
  activeTab: 'tvm' | 'forecasting' | 'risk';
  onSelectTab: (tab: 'tvm' | 'forecasting' | 'risk') => void;
}

export function CaHeader({ activeTab, onSelectTab }: CaHeaderProps) {
  return (
    <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border mb-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                CA & Financial Studio
              </h1>
              <p className="text-xs text-slate-400">
                Chartered Accountant & Finance Quantitative Toolkit
              </p>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => onSelectTab('tvm')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tvm'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LineChart className="h-3.5 w-3.5" /> Time Value of Money (TVM)
          </button>
          <button
            onClick={() => onSelectTab('forecasting')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'forecasting'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" /> Google TimesFM AI
          </button>
          <button
            onClick={() => onSelectTab('risk')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'risk'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" /> CFA Risk Premium
          </button>
        </nav>
      </div>
    </div>
  );
}
