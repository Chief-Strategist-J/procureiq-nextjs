/**
 * TvmStudio — CA & Financial Studio root page component.
 *
 * UX DESIGN PRINCIPLES:
 *   - NO full-page scroll. The entire studio fits in the viewport (100vh).
 *   - Header: fixed at top, compact (48px).
 *   - Body: fills remaining height using flex-1 + overflow-hidden.
 *   - Sidebar: scrolls independently (overflow-y-auto) so inputs never go offscreen.
 *   - Content: scrolls independently per-panel.
 *   - Self-contained tabs (Annuity, PV, Ledger): full-width, still no page scroll.
 *
 * ARCHITECTURE:
 *   - State: Redux (params + forecastData) via useTvmManagement
 *   - Tab routing: TAB_PANEL_MAP maps StudioTab → JSX (data-driven, no switch)
 *   - No infinite loops: TvmInputPanel reads directly from Redux, never from `initial` prop
 *
 * UI-LOGIC-001: No business logic in JSX.
 * UI-FETCH-001: All fetches in hooks.
 */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CaHeader, type StudioTab }     from "../components/CaHeader";
import { TvmInputPanel }                 from "../components/TvmInputPanel";
import { TvmTimesfmVisualizer }         from "../components/TvmTimesfmVisualizer";
import { SingleSumCompoundingChart }     from "../components/SingleSumCompoundingChart";
import { CompoundingFrequencyTable }     from "../components/CompoundingFrequencyTable";
import { CfaRiskBreakdown }             from "../components/CfaRiskBreakdown";
import { AnnuityCalculator }            from "../components/AnnuityCalculator";
import { PvLumpSumCalculator }          from "../components/PvLumpSumCalculator";
import { CaLedgerPanel }                from "../components/CaLedgerPanel";
import { useTvmManagement }             from "../hooks/use-tvm-management";
import { useCaLedger }                  from "../hooks/use-ca-ledger";
import type { TvmParams }               from "../store/tvm-slice";
import { Badge }                         from "@/components/ui/badge";

// ── Tabs that show the input sidebar (left) + content panel (right) ───────────
const SIDEBAR_TABS: StudioTab[] = ["tvm", "forecasting", "risk"];

// ── Access denied ─────────────────────────────────────────────────────────────
function AccessDenied() {
  return (
    <div className="h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/90 border border-red-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center text-2xl border border-red-500/20">🔒</div>
        <h2 className="text-xl font-bold text-white">Accountant Access Required</h2>
        <p className="text-sm text-slate-400">The CA & Financial Studio is restricted to Accountants and Finance Administrators.</p>
      </div>
    </div>
  );
}

// ── Live status strip (compact, 1 line) ───────────────────────────────────────
function StatusStrip({
  forecastData,
  isLoading,
  error,
  currencySymbol,
}: {
  forecastData: ReturnType<typeof useTvmManagement>["forecastData"];
  isLoading: boolean;
  error: string | null;
  currencySymbol: string;
}) {
  const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 2 });

  if (!forecastData && !isLoading && !error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/60 text-[10px] text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        Ready — click ▶ Run Quantitative Model to compute
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/60">
      {isLoading && (
        <span className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono">
          <Badge variant="pending" className="py-0 px-1.5 text-[9px]">Computing</Badge>
          Running TimesFM Model…
        </span>
      )}
      {error && <span className="text-[10px] text-red-400 font-mono">⚠ {error}</span>}
      {forecastData && !isLoading && (
        <>
          <span className="text-[10px] font-mono text-slate-500">
            PV <span className="text-emerald-400 font-bold">{currencySymbol}{fmt(forecastData.presentValue)}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            FV <span className="text-cyan-400 font-bold">{currencySymbol}{fmt(forecastData.futureValue)}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            EAR <span className="text-indigo-400 font-bold">{(forecastData.effectiveAnnualRate * 100).toFixed(4)}%</span>
          </span>
          <span className="text-[10px] font-mono text-slate-600 ml-auto">{forecastData.modelName}</span>
        </>
      )}
    </div>
  );
}

// ── TVM tab: 3 stacked visualizers ──────────────────────────────────────────
function TvmTabContent({
  forecastData,
  params,
  isLoading,
  onRunModel,
}: {
  forecastData: ReturnType<typeof useTvmManagement>["forecastData"];
  params: TvmParams;
  isLoading: boolean;
  onRunModel: () => void;
}) {
  const sym = params.currencySymbol || "$";
  return (
    <div className="space-y-3">
      <TvmTimesfmVisualizer data={forecastData} isLoading={isLoading} onRunModel={onRunModel} currencySymbol={sym} />
      <SingleSumCompoundingChart data={forecastData} currencySymbol={sym} />
      <CompoundingFrequencyTable
        presentValue={forecastData?.presentValue ?? 10_000}
        statedRate={params.statedRate ?? 0.08}
        years={params.years ?? 5}
        currencySymbol={sym}
      />
    </div>
  );
}

// ── Main Studio ───────────────────────────────────────────────────────────────
export function TvmStudio() {
  const [activeTab, setActiveTab] = useState<StudioTab>("tvm");

  const {
    params,
    forecastData,
    isLoading,
    error,
    isAccountantAuthorized,
    updateParams,
    triggerForecast,
  } = useTvmManagement();

  const ledger = useCaLedger();

  // Auto-save to ledger when a new forecast result arrives (deduped by eventId)
  const [lastSavedEventId, setLastSavedEventId] = useState<string | null>(null);
  useEffect(() => {
    if (forecastData?.eventId && forecastData.eventId !== lastSavedEventId) {
      ledger.saveLedgerRecord(forecastData, params);
      setLastSavedEventId(forecastData.eventId);
    }
  }, [forecastData, params, ledger, lastSavedEventId]);

  const handleParamChange = useCallback(
    (key: keyof TvmParams, value: unknown) => updateParams({ [key]: value }),
    [updateParams]
  );

  const sym = params.currencySymbol || "$";
  const showSidebar = SIDEBAR_TABS.includes(activeTab);

  // Tab content map (data-driven — no switch/if chains)
  const tabContent: Partial<Record<StudioTab, React.ReactNode>> = {
    tvm: (
      <TvmTabContent
        forecastData={forecastData}
        params={params}
        isLoading={isLoading}
        onRunModel={triggerForecast}
      />
    ),
    forecasting: (
      <TvmTimesfmVisualizer
        data={forecastData}
        isLoading={isLoading}
        onRunModel={triggerForecast}
        currencySymbol={sym}
      />
    ),
    risk:       <CfaRiskBreakdown data={forecastData} currencySymbol={sym} />,
    annuity:    <AnnuityCalculator currencySymbol={sym} />,
    pv:         <PvLumpSumCalculator currencySymbol={sym} />,
    ledger: (
      <CaLedgerPanel
        records={ledger.records}
        onSaveNotes={ledger.updateNotes}
        onExportCsv={ledger.exportCsv}
        currencySymbol={sym}
      />
    ),
  };

  if (!isAccountantAuthorized) return <AccessDenied />;

  return (
    // ── Outer shell: full viewport height, no page scroll ─────────────────────
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">

      {/* ── Compact top header ──────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-xl">
        <div className="px-4 pt-3 pb-0">
          <CaHeader activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>
        <StatusStrip
          forecastData={forecastData}
          isLoading={isLoading}
          error={error ?? null}
          currencySymbol={sym}
        />
      </div>

      {/* ── Body: fills remaining height ────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {showSidebar ? (
          // Two-column layout — both columns scroll independently
          <div className="h-full flex gap-0">
            {/* Sidebar — scrollable */}
            <aside className="w-72 xl:w-80 shrink-0 h-full overflow-y-auto border-r border-slate-800/60 bg-slate-900/40 p-3 space-y-3">
              <TvmInputPanel
                params={params}
                isLoading={isLoading}
                onParamChange={handleParamChange}
                onRunModel={triggerForecast}
              />
            </aside>

            {/* Content — scrollable */}
            <main className="flex-1 h-full overflow-y-auto p-4">
              {tabContent[activeTab]}
            </main>
          </div>
        ) : (
          // Full-width for self-contained calculators — scrollable
          <div className="h-full overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              {tabContent[activeTab]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
