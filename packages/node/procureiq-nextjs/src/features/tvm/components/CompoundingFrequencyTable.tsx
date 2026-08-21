"use client";

import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Types — all compute inputs described as data, no inline magic values
// ---------------------------------------------------------------------------
interface FrequencyRow {
  label: string;
  m: number; // 0 = continuous
  color: string;
  badge: string;
}

interface CompoundingFrequencyTableProps {
  presentValue: number;
  statedRate: number;
  years: number;
  currencySymbol?: string;
}

// CFA Table 1 — fixed frequency descriptors (data, not logic)
const FREQUENCY_ROWS: FrequencyRow[] = [
  { label: "Annual",       m: 1,   color: "#6366f1", badge: "m = 1"   },
  { label: "Semiannual",   m: 2,   color: "#8b5cf6", badge: "m = 2"   },
  { label: "Quarterly",    m: 4,   color: "#06b6d4", badge: "m = 4"   },
  { label: "Monthly",      m: 12,  color: "#10b981", badge: "m = 12"  },
  { label: "Daily",        m: 365, color: "#f59e0b", badge: "m = 365" },
  { label: "Continuous",   m: 0,   color: "#ec4899", badge: "m = ∞"   },
];

// ---------------------------------------------------------------------------
// Pure math helpers (no side effects, no loops allowed per LOOP-001)
// ---------------------------------------------------------------------------
function computeFv(pv: number, rs: number, n: number, m: number): number {
  if (m === 0) {
    // CFA Equation 4: FVN = PV * e^(rs * N)
    return pv * Math.exp(rs * n);
  }
  // CFA Equation 3: FVN = PV * (1 + rs/m)^(m*N)
  return pv * Math.pow(1 + rs / m, m * n);
}

function computeEar(rs: number, m: number): number {
  if (m === 0) {
    // CFA Equation 6: EAR = e^rs − 1
    return Math.exp(rs) - 1;
  }
  // CFA Equation 5: EAR = (1 + rs/m)^m − 1
  return Math.pow(1 + rs / m, m) - 1;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function CompoundingFrequencyTable({
  presentValue,
  statedRate,
  years,
  currencySymbol = "$",
}: CompoundingFrequencyTableProps) {
  const rows = useMemo(
    () =>
      FREQUENCY_ROWS.map((row) => ({
        ...row,
        fv:  computeFv(presentValue, statedRate, years, row.m),
        ear: computeEar(statedRate, row.m),
      })),
    [presentValue, statedRate, years]
  );

  const maxFv = Math.max(...rows.map((r) => r.fv));
  const minFv = Math.min(...rows.map((r) => r.fv));
  const fvRange = maxFv - minFv || 1;

  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 md:p-5 backdrop-blur-2xl shadow-xl space-y-3 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-pink-400" />
          CFA Table 1 — Effect of Compounding Frequency on Future Value
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono shrink-0">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            PV = {currencySymbol}{fmt(presentValue)}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            r<sub>s</sub> = {(statedRate * 100).toFixed(2)}%
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            N = {years}y
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-sans border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500">
              <th className="text-left py-2 px-3 font-semibold">Frequency</th>
              <th className="text-center py-2 px-3 font-semibold">Periods / Year</th>
              <th className="text-right py-2 px-3 font-semibold">EAR</th>
              <th className="text-right py-2 px-3 font-semibold">Future Value</th>
              <th className="text-left py-2 px-3 font-semibold w-32">Growth Bar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const barPct = ((row.fv - minFv) / fvRange) * 100;
              const isContinuous = row.m === 0;
              return (
                <tr
                  key={row.label}
                  className={`border-t border-slate-800/60 transition-colors hover:bg-slate-800/30 ${
                    isContinuous ? "bg-pink-500/5" : idx % 2 === 0 ? "bg-slate-950/30" : ""
                  }`}
                >
                  {/* Frequency label */}
                  <td className="py-2.5 px-3 font-semibold" style={{ color: row.color }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: row.color }}
                      />
                      {row.label}
                      {isContinuous && (
                        <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 font-bold tracking-wider">
                          CONT
                        </span>
                      )}
                    </div>
                  </td>

                  {/* m badge */}
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                      {row.badge}
                    </span>
                  </td>

                  {/* EAR */}
                  <td className="py-2.5 px-3 text-right font-mono text-slate-200">
                    {(row.ear * 100).toFixed(4)}%
                  </td>

                  {/* FV */}
                  <td
                    className="py-2.5 px-3 text-right font-bold font-mono"
                    style={{ color: row.color }}
                  >
                    {currencySymbol}{fmt(row.fv)}
                  </td>

                  {/* Growth bar */}
                  <td className="py-2.5 px-3">
                    <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(barPct, 2)}%`,
                          background: row.color,
                          boxShadow: `0 0 6px ${row.color}60`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CFA insight callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
        <div className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-[10px] text-slate-400 leading-relaxed">
          <span className="text-indigo-400 font-semibold block mb-0.5">CFA Principle</span>
          For a given interest rate, FV increases with compounding frequency. Continuous
          compounding (m → ∞) gives the theoretical maximum via FV = PV · e^(r<sub>s</sub>·N).
        </div>
        <div className="p-2.5 rounded-xl bg-pink-500/5 border border-pink-500/20 text-[10px] text-slate-400 leading-relaxed">
          <span className="text-pink-400 font-semibold block mb-0.5">Continuous EAR</span>
          EAR = e^r<sub>s</sub> − 1. At r<sub>s</sub> = {(statedRate * 100).toFixed(2)}%,
          continuous compounding yields EAR ={" "}
          <span className="text-pink-300 font-bold">
            {(computeEar(statedRate, 0) * 100).toFixed(4)}%
          </span>{" "}
          vs annual EAR ={" "}
          <span className="text-indigo-300 font-bold">
            {(computeEar(statedRate, 1) * 100).toFixed(4)}%
          </span>.
        </div>
      </div>
    </div>
  );
}
