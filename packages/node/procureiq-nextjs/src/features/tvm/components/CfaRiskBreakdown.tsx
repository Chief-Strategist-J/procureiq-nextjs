"use client";

import React from "react";
import { TimesfmForecastData } from "./TvmTimesfmVisualizer";
import { Percent, TrendingUp, DollarSign, Clock } from "lucide-react";

export function CfaRiskBreakdown({
  data,
  currencySymbol = "$",
}: {
  data: TimesfmForecastData | null;
  currencySymbol?: string;
}) {
  if (!data) return null;

  const realRiskFree = (data.riskFreeRate * 100).toFixed(2);
  const inflationPrem = (data.inflationPremium * 100).toFixed(2);
  const defaultPrem = (data.defaultPremium * 100).toFixed(2);
  const liquidityPrem = (data.liquidityPremium * 100).toFixed(2);
  const maturityPrem = (data.maturityPremium * 100).toFixed(2);
  const statedRatePct = (
    (data.riskFreeRate + data.inflationPremium + data.defaultPremium + data.liquidityPremium + data.maturityPremium) * 100
  ).toFixed(2);
  const nominalRiskFree = ((data.riskFreeRate + data.inflationPremium) * 100).toFixed(2);

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                CFA Quantitative Interest Rate Decomposition Formula
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                r = Real Risk-Free Rate + Inflation Premium + Default Risk Premium + Liquidity Premium + Maturity Premium
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 font-mono text-sm text-indigo-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto">
          <span>r ({statedRatePct}%) = {realRiskFree}% + {inflationPrem}% + {defaultPrem}% + {liquidityPrem}% + {maturityPrem}%</span>
          <span className="text-xs font-sans px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
            Nominal Risk-Free Rate (r* + IP) = {nominalRiskFree}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <TrendingUp className="h-4 w-4" /> 1. Required Rate of Return
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The minimum threshold return required by investors to supply capital and forego current consumption.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <DollarSign className="h-4 w-4" /> 2. Discount Rate
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The rate used to discount future cash flows back to present value today ({currencySymbol}{data.presentValue.toLocaleString()}).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="h-4 w-4" /> 3. Opportunity Cost
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The forgone yield rate of current consumption when deploying funds into multi-period investments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Real Risk-Free Rate (r*)</span>
            <span className="text-lg font-bold text-slate-100">{realRiskFree}%</span>
            <p className="text-[10px] text-slate-500">Pure time preference without inflation</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Inflation Premium (IP)</span>
            <span className="text-lg font-bold text-slate-100">{inflationPrem}%</span>
            <p className="text-[10px] text-slate-500">Expected purchasing power loss</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Default Risk Premium (DRP)</span>
            <span className="text-lg font-bold text-slate-100">{defaultPrem}%</span>
            <p className="text-[10px] text-slate-500">Borrower default failure risk</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Liquidity Premium (LP)</span>
            <span className="text-lg font-bold text-slate-100">{liquidityPrem}%</span>
            <p className="text-[10px] text-slate-500">Quick cash conversion loss risk</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Maturity Premium (MP)</span>
            <span className="text-lg font-bold text-slate-100">{maturityPrem}%</span>
            <p className="text-[10px] text-slate-500">Interest rate sensitivity over time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
