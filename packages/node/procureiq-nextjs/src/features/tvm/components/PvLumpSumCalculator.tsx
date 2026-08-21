"use client";

import React, { useState, useCallback } from "react";
import { TrendingDown, BarChart2 } from "lucide-react";
import { PYTHON_AI_BASE_URL, API_ENDPOINTS } from "@/lib/api-endpoints";

// ---------------------------------------------------------------------------
// Constants (UI-MAGIC-VALUES-001)
// ---------------------------------------------------------------------------
const FREQUENCY_OPTIONS = [
  { value: 1,   label: "Annual (m=1)"      },
  { value: 2,   label: "Semiannual (m=2)"  },
  { value: 4,   label: "Quarterly (m=4)"   },
  { value: 12,  label: "Monthly (m=12)"    },
  { value: 365, label: "Daily (m=365)"     },
  { value: 0,   label: "Continuous (m=∞)"  },
] as const;

interface PvResult {
  presentValue: number;
  futureValue: number;
  effectiveAnnualRate: number;
  discountFactor: number;
  timeline: Array<{ period: number; periodValue: number; discountFactor: number }>;
}

// ---------------------------------------------------------------------------
// Sensitivity computation (pure, no side effects — LOOP-001: uses map)
// ---------------------------------------------------------------------------
function buildSensitivityRows(
  fv: number,
  baseRate: number,
  years: number,
  freq: number
): Array<{ label: string; rate: number; pv: number; change: number }> {
  const deltas = [-0.03, -0.02, -0.01, 0, 0.01, 0.02, 0.03];
  return deltas.map((d) => {
    const r = Math.max(0.001, baseRate + d);
    const pv =
      freq === 0
        ? fv / Math.exp(r * years)
        : fv / Math.pow(1 + r / Math.max(1, freq), Math.max(1, freq) * years);
    return { label: d === 0 ? "Base" : `${d > 0 ? "+" : ""}${(d * 100).toFixed(0)}%`, rate: r, pv, change: pv - (fv / Math.pow(1 + baseRate / Math.max(1, freq), Math.max(1, freq) * years)) };
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function SensitivityTable({
  rows, currencySymbol,
}: {
  rows: ReturnType<typeof buildSensitivityRows>;
  currencySymbol: string;
}) {
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const maxPv = Math.max(...rows.map((r) => r.pv));

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr className="bg-slate-900/80">
            <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">Rate Δ</th>
            <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">Rate</th>
            <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">PV</th>
            <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">Δ vs Base</th>
            <th className="px-3 py-2 w-24">Bar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isBase = row.label === "Base";
            const barPct = (row.pv / maxPv) * 100;
            const isPositive = row.change >= 0;
            return (
              <tr
                key={row.label}
                className={`border-t border-slate-800/60 ${isBase ? "bg-emerald-500/5" : ""}`}
              >
                <td className={`px-3 py-2 font-semibold ${isBase ? "text-emerald-400" : "text-slate-400"}`}>
                  {row.label}
                </td>
                <td className="px-3 py-2 text-right text-slate-300">{(row.rate * 100).toFixed(2)}%</td>
                <td className={`px-3 py-2 text-right font-bold ${isBase ? "text-emerald-400" : "text-slate-200"}`}>
                  {currencySymbol}{fmt(row.pv)}
                </td>
                <td className={`px-3 py-2 text-right text-xs ${isBase ? "text-slate-500" : isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {isBase ? "—" : `${isPositive ? "+" : ""}${currencySymbol}${fmt(Math.abs(row.change))}`}
                </td>
                <td className="px-3 py-2">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isBase ? "bg-emerald-500" : "bg-indigo-500"}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DiscountTimeline({ result, currencySymbol }: { result: PvResult; currencySymbol: string }) {
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pts = result.timeline.slice(0, 8);
  const maxVal = Math.max(...pts.map((p) => p.periodValue), 1);

  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Discount Timeline</span>
      <div className="flex items-end gap-1 h-20 bg-slate-950/60 rounded-xl border border-slate-800/60 p-3">
        {pts.map((pt, idx) => {
          const height = (pt.periodValue / maxVal) * 100;
          const isLast = idx === pts.length - 1;
          return (
            <div key={pt.period} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div
                className={`w-full rounded-sm transition-all ${isLast ? "bg-emerald-500" : "bg-indigo-500/60 group-hover:bg-indigo-400"}`}
                style={{ height: `${height}%` }}
              />
              <span className="text-[8px] text-slate-600 font-mono">t{pt.period}</span>
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[9px] text-white whitespace-nowrap z-10 shadow-xl">
                {currencySymbol}{fmt(pt.periodValue)} · DF={pt.discountFactor.toFixed(4)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function PvLumpSumCalculator({ currencySymbol = "$" }: { currencySymbol?: string }) {
  const [fv, setFv] = useState(100000);
  const [rate, setRate] = useState(0.08);
  const [years, setYears] = useState(6);
  const [freq, setFreq] = useState(1);
  const [result, setResult] = useState<PvResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"sensitivity" | "timeline">("sensitivity");

  const sensitivity = result ? buildSensitivityRows(fv, rate, years, freq) : [];

  const handleCalculate = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${PYTHON_AI_BASE_URL}${API_ENDPOINTS.TVM_AI.FORECAST}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Role": "accountant" },
        body: JSON.stringify({
          calculationType: "SINGLE_SUM",
          statedRate: rate,
          frequency: freq,
          years,
          pmt: 0,
          pv: 0,
          fv,
        }),
      });
      const json = await res.json();
      const d = json.data;
      const df = d.timeline?.[d.timeline.length - 1]?.discountFactor ?? 0;
      setResult({
        presentValue: d.presentValue,
        futureValue: d.futureValue,
        effectiveAnnualRate: d.effectiveAnnualRate,
        discountFactor: df,
        timeline: d.timeline ?? [],
      });
    } catch (err) {
      console.error("PV calculation failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fv, rate, years, freq]);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 md:p-5 backdrop-blur-2xl shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-emerald-400" />
          CFA §8–10 — Present Value of a Single Lump Sum
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">PV = FV·(1+r)⁻ᴺ</span>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Future Value (FV)</label>
          <input
            type="number" value={fv}
            onChange={(e) => setFv(Number(e.target.value))}
            className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Stated Rate (r)</label>
          <input
            type="number" step="0.001" value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Years (N)</label>
          <input
            type="number" min={1} value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Compounding</label>
          <select
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            {FREQUENCY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button" onClick={handleCalculate} disabled={isLoading}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
      >
        {isLoading ? "Discounting..." : "Calculate PV"}
      </button>

      {result && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Result cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-emerald-900/20 border border-emerald-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Present Value</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono mt-1 block truncate">
                {currencySymbol}{fmt(result.presentValue)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-900/20 border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Future Value</span>
              <span className="text-base font-extrabold text-cyan-400 font-mono mt-1 block truncate">
                {currencySymbol}{fmt(result.futureValue)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">EAR</span>
              <span className="text-base font-extrabold text-indigo-400 font-mono mt-1 block">
                {(result.effectiveAnnualRate * 100).toFixed(4)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Discount Factor</span>
              <span className="text-base font-extrabold text-purple-400 font-mono mt-1 block">
                {result.discountFactor.toFixed(6)}
              </span>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex gap-2">
            {(["sensitivity", "timeline"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setActiveView(v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === v
                    ? "bg-slate-700 text-white border border-slate-600"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <BarChart2 className="h-3 w-3" />
                {v === "sensitivity" ? "Rate Sensitivity" : "Discount Timeline"}
              </button>
            ))}
          </div>

          {activeView === "sensitivity" && (
            <SensitivityTable rows={sensitivity} currencySymbol={currencySymbol} />
          )}
          {activeView === "timeline" && (
            <DiscountTimeline result={result} currencySymbol={currencySymbol} />
          )}

          {/* CFA insight */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
            <span className="text-emerald-400 font-semibold">CFA Principle: </span>
            PV = {currencySymbol}{fmt(result.presentValue)} invested today at{" "}
            {(result.effectiveAnnualRate * 100).toFixed(2)}% EAR for {years} years
            grows to {currencySymbol}{fmt(result.futureValue)}. The discount factor (1+r)⁻ᴺ ={" "}
            {result.discountFactor.toFixed(6)} is the reciprocal of the compound factor.
          </div>
        </div>
      )}
    </div>
  );
}
