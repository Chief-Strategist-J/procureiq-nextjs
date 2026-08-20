"use client";

import React, { useState } from "react";
import { TimesfmForecastData } from "./TvmTimesfmVisualizer";

export function SingleSumCompoundingChart({
  data,
  currencySymbol = "$",
}: {
  data: TimesfmForecastData | null;
  currencySymbol?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || !data.timeline || data.timeline.length === 0) return null;

  const timeline = data.timeline;
  const initialPV = data.presentValue || 100;
  const rate = data.effectiveAnnualRate || 0.05;

  const chartData = timeline.map((pt) => {
    const simpleInterest = initialPV * rate * pt.period;
    const compoundInterest = pt.periodValue - initialPV - simpleInterest;
    return {
      period: pt.period,
      fv: pt.periodValue,
      principal: initialPV,
      simpleInterest: Math.max(0, simpleInterest),
      compoundInterest: Math.max(0, compoundInterest),
      discountFactor: pt.discountFactor,
    };
  });

  const maxVal = Math.max(...chartData.map((d) => d.fv)) * 1.05 || 1;
  const minVal = 0;
  const rangeY = maxVal - minVal;

  const svgWidth = 800;
  const svgHeight = 300;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / (chartData.length - 1 || 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minVal) / rangeY) * chartHeight;

  const pts = chartData.map((d, idx) => ({ x: getX(idx), y: getY(d.fv), d }));

  const buildPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, "");
  };

  const linePath = buildPath(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x},${svgHeight - paddingBottom} L ${pts[0].x},${svgHeight - paddingBottom} Z`;

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            Single Sum Compounding Trajectory (FV = PV × (1 + r)ᴺ)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing interest-on-interest exponential compounding growth over time
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" /> Compound Interest
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400" /> Total Future Value
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden bg-slate-950/60 rounded-2xl border border-slate-800/60 p-4 shadow-inner">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto text-xs font-sans">
          <defs>
            <linearGradient id="compoundingArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={svgHeight - paddingBottom} stroke="#1e293b" strokeWidth="1" />
          <line x1={paddingLeft} y1={svgHeight - paddingBottom} x2={svgWidth - paddingRight} y2={svgHeight - paddingBottom} stroke="#1e293b" strokeWidth="1" />

          <line x1={paddingLeft} y1={paddingTop + chartHeight * 0.33} x2={svgWidth - paddingRight} y2={paddingTop + chartHeight * 0.33} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={paddingLeft} y1={paddingTop + chartHeight * 0.66} x2={svgWidth - paddingRight} y2={paddingTop + chartHeight * 0.66} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

          <path d={areaPath} fill="url(#compoundingArea)" />
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="3.5" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />

          {pts.map((pt, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#10b981" stroke="#0f172a" strokeWidth="2.5" className="cursor-pointer hover:r-7 transition-all" />
              {hoveredIdx === idx && (
                <g>
                  <line x1={pt.x} y1={paddingTop} x2={pt.x} y2={svgHeight - paddingBottom} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                  <rect x={Math.min(pt.x - 70, svgWidth - 155)} y={pt.y - 75} width="150" height="65" rx="8" fill="#020617" stroke="#10b981" strokeWidth="1.5" className="shadow-2xl" />
                  <text x={Math.min(pt.x - 62, svgWidth - 147)} y={pt.y - 56} fill="#f8fafc" fontSize="11" fontWeight="bold">
                    Period t={pt.d.period}: {currencySymbol}{pt.d.fv.toFixed(2)}
                  </text>
                  <text x={Math.min(pt.d.principal - 62, svgWidth - 147)} y={pt.y - 40} fill="#94a3b8" fontSize="9">
                    Principal: {currencySymbol}{pt.d.principal.toFixed(2)}
                  </text>
                  <text x={Math.min(pt.d.principal - 62, svgWidth - 147)} y={pt.y - 26} fill="#34d399" fontSize="9">
                    Compound Growth: {currencySymbol}{(pt.d.fv - pt.d.principal).toFixed(2)}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
