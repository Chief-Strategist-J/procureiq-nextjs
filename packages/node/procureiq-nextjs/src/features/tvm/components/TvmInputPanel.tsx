/**
 * TvmInputPanel — Direct controlled inputs for TVM parameters.
 *
 * WHY NOT DataForm here:
 *   DataForm seeds internal state once from `initial`. TvmStudio's params come
 *   from Redux; if we pass Redux params as `initial` and also call updateParams
 *   in onChange, we get: Redux→params→initial→DataForm.useEffect→setValues→
 *   onChange→updateParams→Redux→params→…∞.
 *   Direct controlled inputs bypass that entirely — each <input> reads directly
 *   from Redux `params` and writes only on user interaction.
 *
 * ALGORITHM (data-driven):
 *   FIELD_GROUPS is the single source of truth for input layout.
 *   Each group has a title and a list of field descriptors.
 *   Adding a new field = add one entry to FIELD_GROUPS, no JSX changes.
 *
 * LOOP-001: uses Array.map, no for-loops.
 * UI-LOGIC-001: no business logic — pure render + event delegation.
 */
"use client";

import React, { useCallback } from "react";
import type { TvmParams } from "../store/tvm-slice";

// ── Field descriptor (DATA, not logic) ────────────────────────────────────────
interface NumberField {
  kind: "number";
  key: keyof TvmParams;
  label: string;
  hint: string;
  step: number;
  min: number;
  max: number;
  format?: (v: number) => string; // display transformer (e.g. % display)
  parse?: (s: string) => number;  // input → store transformer
}
interface SelectField {
  kind: "select";
  key: keyof TvmParams;
  label: string;
  hint: string;
  options: { label: string; value: string | number }[];
}
type Field = NumberField | SelectField;

interface FieldGroup {
  title: string;
  color: string; // Tailwind accent color token
  fields: Field[];
}

// ── Field groups — ALL layout config lives here ───────────────────────────────
const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Core Parameters",
    color: "emerald",
    fields: [
      {
        kind: "select",
        key: "currencySymbol",
        label: "Currency",
        hint: "Symbol displayed on results",
        options: [
          { label: "USD ($)", value: "$" },
          { label: "EUR (€)", value: "€" },
          { label: "GBP (£)", value: "£" },
          { label: "INR (₹)", value: "₹" },
          { label: "JPY (¥)", value: "¥" },
          { label: "AUD (A$)", value: "A$" },
          { label: "CAD (C$)", value: "C$" },
        ],
      },
      {
        kind: "select",
        key: "calculationType",
        label: "Calculation Model",
        hint: "TVM formula variant to apply",
        options: [
          { label: "Single Sum (FV/PV)", value: "SINGLE_SUM" },
          { label: "Ordinary Annuity", value: "ORDINARY_ANNUITY" },
          { label: "Annuity Due", value: "ANNUITY_DUE" },
          { label: "Perpetuity (PV only)", value: "PERPETUITY" },
          { label: "Unequal Cash Flows", value: "UNEQUAL_FLOWS" },
        ],
      },
      {
        kind: "number",
        key: "statedRate",
        label: "Stated Annual Rate (rₛ)",
        hint: "e.g. 0.08 = 8% per year",
        step: 0.001,
        min: 0,
        max: 1,
      },
      {
        kind: "select",
        key: "frequency",
        label: "Compounding (m)",
        hint: "Periods per year; 0 = continuous",
        options: [
          { label: "Annual (m = 1)", value: 1 },
          { label: "Semi-Annual (m = 2)", value: 2 },
          { label: "Quarterly (m = 4)", value: 4 },
          { label: "Monthly (m = 12)", value: 12 },
          { label: "Daily (m = 365)", value: 365 },
          { label: "Continuous (m → ∞)", value: 0 },
        ],
      },
      {
        kind: "number",
        key: "pmt",
        label: "Payment per Period (PMT)",
        hint: "Cash flow each period",
        step: 100,
        min: 0,
        max: 10_000_000,
      },
      {
        kind: "number",
        key: "years",
        label: "Investment Horizon (N)",
        hint: "Number of years",
        step: 0.5,
        min: 0.5,
        max: 50,
      },
      {
        kind: "number",
        key: "horizon",
        label: "TimesFM Forecast Steps",
        hint: "Periods ahead for AI model",
        step: 1,
        min: 1,
        max: 120,
      },
    ],
  },
  {
    title: "CFA Risk Premium Decomposition",
    color: "amber",
    fields: [
      {
        kind: "number",
        key: "riskFreeRate",
        label: "Risk-Free Rate (r*)",
        hint: "Real risk-free rate",
        step: 0.001,
        min: 0,
        max: 0.5,
      },
      {
        kind: "number",
        key: "inflationPremium",
        label: "Inflation Premium (IP)",
        hint: "Expected inflation component",
        step: 0.001,
        min: 0,
        max: 0.5,
      },
      {
        kind: "number",
        key: "defaultPremium",
        label: "Default Risk Premium (DRP)",
        hint: "Credit/default risk",
        step: 0.001,
        min: 0,
        max: 0.5,
      },
      {
        kind: "number",
        key: "liquidityPremium",
        label: "Liquidity Premium (LP)",
        hint: "Marketability discount",
        step: 0.001,
        min: 0,
        max: 0.5,
      },
      {
        kind: "number",
        key: "maturityPremium",
        label: "Maturity Premium (MP)",
        hint: "Compensation for longer duration",
        step: 0.001,
        min: 0,
        max: 0.5,
      },
    ],
  },
];

// ── Color class maps (avoids dynamic Tailwind class generation) ───────────────
const COLOR_MAP: Record<string, { border: string; title: string; input: string }> = {
  emerald: {
    border: "border-emerald-500/20",
    title: "text-emerald-400",
    input:  "focus:border-emerald-500",
  },
  amber: {
    border: "border-amber-500/20",
    title: "text-amber-400",
    input:  "focus:border-amber-500",
  },
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface TvmInputPanelProps {
  params: TvmParams;
  isLoading: boolean;
  onParamChange: (key: keyof TvmParams, value: unknown) => void;
  onRunModel: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function TvmInputPanel({
  params,
  isLoading,
  onParamChange,
  onRunModel,
}: TvmInputPanelProps) {
  // handleChange: delegates to parent, no local state (avoids DataForm loop).
  const handleChange = useCallback(
    (key: keyof TvmParams, raw: string) => {
      const field = FIELD_GROUPS.flatMap((g) => g.fields).find((f) => f.key === key);
      if (!field) return;
      if (field.kind === "number") {
        const n = parseFloat(raw);
        if (!Number.isNaN(n)) onParamChange(key, n);
      } else {
        // select — check if numeric option
        const n = Number(raw);
        onParamChange(key, Number.isNaN(n) ? raw : n);
      }
    },
    [onParamChange]
  );

  return (
    <aside className="space-y-4">
      {/* Render each group (data-driven) */}
      {FIELD_GROUPS.map((group) => {
        const colors = COLOR_MAP[group.color] ?? COLOR_MAP.emerald;
        return (
          <div
            key={group.title}
            className={`rounded-xl border ${colors.border} bg-slate-900/60 p-3 space-y-3`}
          >
            <h4 className={`text-[10px] font-bold uppercase tracking-wider ${colors.title}`}>
              {group.title}
            </h4>

            {/* Render each field within the group (data-driven) */}
            {group.fields.map((field) => {
              const rawValue = params[field.key as keyof TvmParams];
              return (
                <div key={field.key} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`tvm-input-${field.key}`}
                      className="text-[10px] font-semibold text-slate-400 leading-tight"
                    >
                      {field.label}
                    </label>
                    <span className="text-[9px] text-slate-600 italic truncate max-w-[100px]">
                      {field.hint}
                    </span>
                  </div>

                  {field.kind === "select" ? (
                    <select
                      id={`tvm-input-${field.key}`}
                      value={String(rawValue ?? "")}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`bg-slate-950/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white ${colors.input} focus:outline-none transition-colors`}
                    >
                      {field.options.map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`tvm-input-${field.key}`}
                      type="number"
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      value={rawValue != null ? String(rawValue) : ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`bg-slate-950/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono ${colors.input} focus:outline-none transition-colors`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Run model button */}
      <button
        type="button"
        onClick={onRunModel}
        disabled={isLoading}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Running Model…
          </>
        ) : (
          "▶ Run Quantitative Model"
        )}
      </button>
    </aside>
  );
}
