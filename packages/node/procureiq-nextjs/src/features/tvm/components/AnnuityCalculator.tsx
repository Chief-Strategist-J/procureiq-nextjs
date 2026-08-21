"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Plus, Trash2, Calculator, BarChart2 } from "lucide-react";
import { PYTHON_AI_BASE_URL, API_ENDPOINTS } from "@/lib/api-endpoints";

// ---------------------------------------------------------------------------
// Constants — all magic values declared as named data (UI-MAGIC-VALUES-001)
// ---------------------------------------------------------------------------
const CALC_TABS = [
  { id: "ORDINARY_ANNUITY", label: "Ordinary Annuity" },
  { id: "ANNUITY_DUE",       label: "Annuity Due"       },
  { id: "UNEQUAL_FLOWS",     label: "Unequal Cash Flows" },
] as const;

type CalcType = (typeof CALC_TABS)[number]["id"];

interface AnnuityResult {
  presentValue: number;
  futureValue: number;
  effectiveAnnualRate: number;
  timeline: Array<{ period: number; periodValue: number; compoundFactor: number }>;
  chartImageBase64: string | null;
}

interface Unequal { id: number; cf: number }

// ---------------------------------------------------------------------------
// Sub-components (each < 100 lines — UI-COMPONENT-SIZE-001)
// ---------------------------------------------------------------------------

function TabBar({ active, onChange }: { active: CalcType; onChange: (t: CalcType) => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
      {CALC_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 text-[11px] font-semibold py-2 px-3 rounded-lg transition-all ${
            active === tab.id
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function AnnuityInputs({
  pmt, rate, periods, type,
  onPmt, onRate, onPeriods,
}: {
  pmt: number; rate: number; periods: number; type: CalcType;
  onPmt: (v: number) => void; onRate: (v: number) => void; onPeriods: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {type !== "UNEQUAL_FLOWS" && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Payment (A)</label>
          <input
            type="number"
            value={pmt}
            onChange={(e) => onPmt(Number(e.target.value))}
            className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Rate / Period</label>
        <input
          type="number" step="0.001"
          value={rate}
          onChange={(e) => onRate(Number(e.target.value))}
          className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Periods (N)</label>
        <input
          type="number" min={1} max={30}
          value={periods}
          onChange={(e) => onPeriods(Math.max(1, Math.min(30, Number(e.target.value))))}
          className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function UnequalFlowsTable({
  rows, onChange, onAdd, onRemove,
}: {
  rows: Unequal[];
  onChange: (id: number, cf: number) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Cash Flow per Period</span>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-[10px] text-indigo-400 border border-indigo-500/30 rounded-lg px-2 py-1 hover:bg-indigo-500/10 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add Period
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
        {rows.map((row, idx) => (
          <div key={row.id} className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono w-10 shrink-0">t={idx + 1}</span>
            <input
              type="number"
              value={row.cf}
              onChange={(e) => onChange(row.id, Number(e.target.value))}
              className="flex-1 bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none"
            />
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(row.id)}
                className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultCards({ result, currencySymbol }: { result: AnnuityResult; currencySymbol: string }) {
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="p-3 rounded-xl bg-gradient-to-b from-cyan-900/30 to-slate-950 border border-cyan-500/20">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Future Value</span>
        <span className="text-lg font-extrabold text-cyan-400 font-mono mt-1 block">
          {currencySymbol}{fmt(result.futureValue)}
        </span>
      </div>
      <div className="p-3 rounded-xl bg-gradient-to-b from-emerald-900/30 to-slate-950 border border-emerald-500/20">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Present Value</span>
        <span className="text-lg font-extrabold text-emerald-400 font-mono mt-1 block">
          {currencySymbol}{fmt(result.presentValue)}
        </span>
      </div>
      <div className="p-3 rounded-xl bg-gradient-to-b from-indigo-900/30 to-slate-950 border border-indigo-500/20">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">EAR</span>
        <span className="text-lg font-extrabold text-indigo-400 font-mono mt-1 block">
          {(result.effectiveAnnualRate * 100).toFixed(4)}%
        </span>
      </div>
    </div>
  );
}

function TimelineTable({
  result, currencySymbol,
}: {
  result: AnnuityResult; currencySymbol: string;
}) {
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr className="bg-slate-900/80">
            <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">Period</th>
            <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">Value</th>
            <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">Compound Factor</th>
          </tr>
        </thead>
        <tbody>
          {result.timeline.map((row, idx) => (
            <tr key={row.period} className={idx % 2 === 0 ? "bg-slate-950/40" : ""}>
              <td className="px-3 py-1.5 text-slate-400">t = {row.period}</td>
              <td className="px-3 py-1.5 text-right text-cyan-300 font-bold">
                {currencySymbol}{fmt(row.periodValue)}
              </td>
              <td className="px-3 py-1.5 text-right text-slate-400">{row.compoundFactor.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AnnuityCalculator({ currencySymbol = "$" }: { currencySymbol?: string }) {
  const [calcType, setCalcType] = useState<CalcType>("ORDINARY_ANNUITY");
  const [pmt, setPmt] = useState(1000);
  const [rate, setRate] = useState(0.05);
  const [periods, setPeriods] = useState(5);
  const [unequalRows, setUnequalRows] = useState<Unequal[]>([
    { id: 1, cf: 1000 },
    { id: 2, cf: 2000 },
    { id: 3, cf: 4000 },
    { id: 4, cf: 5000 },
    { id: 5, cf: 6000 },
  ]);
  const [result, setResult] = useState<AnnuityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"table" | "chart">("chart");

  const nextId = useMemo(() => Math.max(...unequalRows.map((r) => r.id), 0) + 1, [unequalRows]);

  const handleAddRow = useCallback(() => {
    setUnequalRows((prev) => [...prev, { id: nextId, cf: 0 }]);
  }, [nextId]);

  const handleRemoveRow = useCallback((id: number) => {
    setUnequalRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleChangeRow = useCallback((id: number, cf: number) => {
    setUnequalRows((prev) => prev.map((r) => (r.id === id ? { ...r, cf } : r)));
  }, []);

  const handleCalculate = useCallback(async () => {
    setIsLoading(true);
    try {
      const cashFlows = calcType === "UNEQUAL_FLOWS" ? unequalRows.map((r) => r.cf) : undefined;
      const effectivePeriods = calcType === "UNEQUAL_FLOWS" ? unequalRows.length : periods;

      const [forecastRes, chartRes] = await Promise.all([
        fetch(`${PYTHON_AI_BASE_URL}${API_ENDPOINTS.TVM_AI.FORECAST}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-User-Role": "accountant" },
          body: JSON.stringify({
            calculationType: calcType,
            statedRate: rate,
            frequency: 1,
            years: effectivePeriods,
            pmt: calcType !== "UNEQUAL_FLOWS" ? pmt : 0,
            pv: 0,
            fv: 0,
            cashFlows,
          }),
        }),
        fetch(`${PYTHON_AI_BASE_URL}/api/v1/tvm-ai/annuity-timeline-chart`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-User-Role": "accountant" },
          body: JSON.stringify({
            calculationType: calcType,
            pmt: calcType !== "UNEQUAL_FLOWS" ? pmt : 0,
            rate,
            periods: effectivePeriods,
            cashFlows,
            currencySymbol,
          }),
        }),
      ]);

      const forecastJson = await forecastRes.json();
      const chartJson = await chartRes.json();
      const fd = forecastJson.data;

      setResult({
        presentValue: fd.presentValue,
        futureValue: fd.futureValue,
        effectiveAnnualRate: fd.effectiveAnnualRate,
        timeline: fd.timeline ?? [],
        chartImageBase64: chartJson?.data?.imageBase64 ?? null,
      });
    } catch (err) {
      console.error("Annuity calculation failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [calcType, pmt, rate, periods, unequalRows, currencySymbol]);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 md:p-5 backdrop-blur-2xl shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calculator className="h-4 w-4 text-indigo-400" />
          CFA §6 — Future Value of a Series of Cash Flows
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">FVₙ = A·[(1+r)ᴺ−1]/r</span>
      </div>

      {/* Tab selector */}
      <TabBar active={calcType} onChange={setCalcType} />

      {/* Inputs */}
      <AnnuityInputs
        pmt={pmt} rate={rate} periods={periods} type={calcType}
        onPmt={setPmt} onRate={setRate} onPeriods={setPeriods}
      />

      {calcType === "UNEQUAL_FLOWS" && (
        <UnequalFlowsTable
          rows={unequalRows}
          onChange={handleChangeRow}
          onAdd={handleAddRow}
          onRemove={handleRemoveRow}
        />
      )}

      {/* Calculate button */}
      <button
        type="button"
        onClick={handleCalculate}
        disabled={isLoading}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
      >
        {isLoading ? "Computing..." : "Calculate FV"}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ResultCards result={result} currencySymbol={currencySymbol} />

          {/* View toggle */}
          <div className="flex gap-2">
            {(["chart", "table"] as const).map((v) => (
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
                {v === "chart" ? "Timeline Chart" : "Period Table"}
              </button>
            ))}
          </div>

          {activeView === "chart" && result.chartImageBase64 && (
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.chartImageBase64}
                alt="CFA Annuity Timeline"
                className="w-full h-auto"
              />
            </div>
          )}

          {activeView === "table" && (
            <TimelineTable result={result} currencySymbol={currencySymbol} />
          )}
        </div>
      )}
    </div>
  );
}
