"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { EarFormulaDialog } from "./dialogs/EarFormulaDialog";
import { PvFormulaDialog } from "./dialogs/PvFormulaDialog";
import { FvFormulaDialog } from "./dialogs/FvFormulaDialog";
import { HorizonFormulaDialog } from "./dialogs/HorizonFormulaDialog";

export interface TimelinePoint {
  period: number;
  periodValue: number;
  discountFactor: number;
  compoundFactor: number;
}

export interface TimesfmForecastData {
  eventId: string;
  timestamp: string;
  modelName: string;
  horizon: number;
  historicalData: number[];
  forecastPoint: number[];
  quantile10: number[];
  quantile90: number[];
  effectiveAnnualRate: number;
  riskFreeRate: number;
  inflationPremium: number;
  defaultPremium: number;
  liquidityPremium: number;
  maturityPremium: number;
  presentValue: number;
  futureValue: number;
  timeline: TimelinePoint[];
}

export function TvmTimesfmVisualizer({
  data,
  currencySymbol = "$",
}: {
  data: TimesfmForecastData | null;
  currencySymbol?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeFormulaModal, setActiveFormulaModal] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl text-slate-400 shadow-2xl space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute w-8 h-8 rounded-full bg-indigo-500/10 blur-sm" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Running Financial Cash Flow AI Engine...
        </p>
      </div>
    );
  }

  const forecast = data.forecastPoint || [];
  const q10 = data.quantile10 || forecast;
  const q90 = data.quantile90 || forecast;
  const history = data.historicalData || [100, 102, 104, 106];

  const allPoints = [...history, ...forecast, ...q90, ...q10];
  const minY = Math.min(...allPoints) * 0.95;
  const maxY = Math.max(...allPoints) * 1.05;
  const rangeY = maxY - minY || 1;

  const svgWidth = 800;
  const svgHeight = 180;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const totalPoints = history.length + forecast.length;
  const getX = (index: number) => paddingLeft + (index / (totalPoints - 1 || 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minY) / rangeY) * chartHeight;

  const historyPoints = history.map((val, idx) => ({ x: getX(idx), y: getY(val), val }));
  const forecastPoints = forecast.map((val, idx) => ({
    x: getX(history.length - 1 + idx),
    y: getY(val),
    val,
    q10: q10[idx] ?? val,
    q90: q90[idx] ?? val,
  }));

  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    return pts.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = pts[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, "");
  };

  const historyPath = buildSmoothPath(historyPoints);
  const forecastPath = buildSmoothPath([historyPoints[historyPoints.length - 1], ...forecastPoints]);

  const q90SmoothPts = forecastPoints.map((p) => ({ x: p.x, y: getY(p.q90) }));
  const q10SmoothPtsRev = forecastPoints.map((p) => ({ x: p.x, y: getY(p.q10) })).reverse();

  const confidencePath = `${buildSmoothPath(q90SmoothPts)} L ${q10SmoothPtsRev[0].x},${q10SmoothPtsRev[0].y} ${buildSmoothPath(q10SmoothPtsRev).replace('M', 'L')} Z`;

  return (
    <div className="space-y-6 font-sans">
      <EarFormulaDialog
        isOpen={activeFormulaModal === "EAR"}
        onClose={() => setActiveFormulaModal(null)}
      />
      <PvFormulaDialog
        isOpen={activeFormulaModal === "PV"}
        onClose={() => setActiveFormulaModal(null)}
      />
      <FvFormulaDialog
        isOpen={activeFormulaModal === "FV"}
        onClose={() => setActiveFormulaModal(null)}
      />
      <HorizonFormulaDialog
        isOpen={activeFormulaModal === "N"}
        onClose={() => setActiveFormulaModal(null)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-5 border border-indigo-500/20 shadow-xl backdrop-blur-xl group hover:border-indigo-500/40 transition-all flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Effective Annual Rate</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveFormulaModal("EAR");
              }}
              className="relative z-10 p-1.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors cursor-pointer"
              title="Click to view EAR formula"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-400 mt-2 tracking-tight truncate">
            {(data.effectiveAnnualRate * 100).toFixed(2)}%
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Compounded Yield Model</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-5 border border-emerald-500/20 shadow-xl backdrop-blur-xl group hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Present Value (PV)</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveFormulaModal("PV");
              }}
              className="relative z-10 p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
              title="Click to view PV formula"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-2 tracking-tight truncate" title={`${currencySymbol}${data.presentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}>
            {currencySymbol}{data.presentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Discounted Cash Flow Sum</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-5 border border-cyan-500/20 shadow-xl backdrop-blur-xl group hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Future Value (FV)</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveFormulaModal("FV");
              }}
              className="relative z-10 p-1.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
              title="Click to view FV formula"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-cyan-400 mt-2 tracking-tight truncate" title={`${currencySymbol}${data.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}>
            {currencySymbol}{data.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Compounded Growth Value</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-5 border border-purple-500/20 shadow-xl backdrop-blur-xl group hover:border-purple-500/40 transition-all flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Forecast Horizon</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveFormulaModal("N");
              }}
              className="relative z-10 p-1.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-colors cursor-pointer"
              title="Click to view Horizon formula"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-400 mt-2 tracking-tight truncate">
            {data.horizon} Periods
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Quantitative Projection Steps</span>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 md:p-5 backdrop-blur-2xl shadow-xl space-y-3 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            Cash Flow Trajectory & Quantile Uncertainty
          </h3>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-400 border border-slate-400 border-dashed" /> Historical
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400" /> AI Forecast
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500/20 border border-indigo-500/30" /> 90% Confidence
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden bg-slate-950/60 rounded-2xl border border-slate-800/60 p-4 shadow-inner">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto text-xs font-sans">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="confidenceGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={svgHeight - paddingBottom} stroke="#1e293b" strokeWidth="1" />
            <line x1={paddingLeft} y1={svgHeight - paddingBottom} x2={svgWidth - paddingRight} y2={svgHeight - paddingBottom} stroke="#1e293b" strokeWidth="1" />

            <line x1={paddingLeft} y1={paddingTop + chartHeight * 0.25} x2={svgWidth - paddingRight} y2={paddingTop + chartHeight * 0.25} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={paddingLeft} y1={paddingTop + chartHeight * 0.5} x2={svgWidth - paddingRight} y2={paddingTop + chartHeight * 0.5} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={paddingLeft} y1={paddingTop + chartHeight * 0.75} x2={svgWidth - paddingRight} y2={paddingTop + chartHeight * 0.75} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

            <path d={confidencePath} fill="url(#confidenceGlow)" />

            <path d={historyPath} fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="6 4" />

            <path d={forecastPath} fill="none" stroke="#38bdf8" strokeWidth="3.5" className="drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />

            {forecastPoints.map((pt, idx) => (
              <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2.5" className="cursor-pointer hover:r-7 transition-all" />
                {hoveredIdx === idx && (
                  <g>
                    <line x1={pt.x} y1={paddingTop} x2={pt.x} y2={svgHeight - paddingBottom} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <rect x={Math.min(pt.x - 60, svgWidth - 135)} y={pt.y - 65} width="130" height="55" rx="8" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" className="shadow-2xl" />
                    <text x={Math.min(pt.x - 52, svgWidth - 127)} y={pt.y - 48} fill="#f8fafc" fontSize="11" fontWeight="bold">
                      t={idx + 1}: {currencySymbol}{pt.val.toFixed(2)}
                    </text>
                    <text x={Math.min(pt.x - 52, svgWidth - 127)} y={pt.y - 34} fill="#c084fc" fontSize="9">
                      q90: {currencySymbol}{pt.q90.toFixed(2)}
                    </text>
                    <text x={Math.min(pt.x - 52, svgWidth - 127)} y={pt.y - 20} fill="#818cf8" fontSize="9">
                      q10: {currencySymbol}{pt.q10.toFixed(2)}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Risk-Free (r*)</span>
            <span className="text-xs font-bold text-slate-100 mt-0.5 block">{(data.riskFreeRate * 100).toFixed(2)}%</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Inflation</span>
            <span className="text-xs font-bold text-slate-100 mt-0.5 block">{(data.inflationPremium * 100).toFixed(2)}%</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Default Risk</span>
            <span className="text-xs font-bold text-slate-100 mt-0.5 block">{(data.defaultPremium * 100).toFixed(2)}%</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Liquidity</span>
            <span className="text-xs font-bold text-slate-100 mt-0.5 block">{(data.liquidityPremium * 100).toFixed(2)}%</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Maturity</span>
            <span className="text-xs font-bold text-slate-100 mt-0.5 block">{(data.maturityPremium * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
