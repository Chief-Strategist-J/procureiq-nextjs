"use client";

import React, { useState } from "react";
import { useTvmManagement } from "../hooks/use-tvm-management";
import { TvmTimesfmVisualizer } from "../components/TvmTimesfmVisualizer";
import { SingleSumCompoundingChart } from "../components/SingleSumCompoundingChart";
import { CaHeader } from "../components/CaHeader";
import { CfaRiskBreakdown } from "../components/CfaRiskBreakdown";
import { DataForm } from "@/shared/ui/DataForm";
import { tvmSchema, TvmEntity } from "../schema/tvm.schema";

export function TvmStudio() {
  const [activeTab, setActiveTab] = useState<'tvm' | 'forecasting' | 'risk'>('tvm');
  const {
    params,
    forecastData,
    isLoading,
    isAccountantAuthorized,
    updateParams,
    triggerForecast,
  } = useTvmManagement();

  if (!isAccountantAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/90 border border-red-500/30 text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center font-bold text-xl border border-red-500/20">
            🔒
          </div>
          <h2 className="text-xl font-bold text-white">Accountant Access Required</h2>
          <p className="text-sm text-slate-400">
            The Time Value of Money & Google TimesFM Quantitative Studio is restricted exclusively to Accountants and Finance Administrators.
          </p>
        </div>
      </div>
    );
  }

  const handleFormChange = (values: Partial<TvmEntity>) => {
    const patch: Record<string, unknown> = {};
    if (values.statedRate !== undefined) patch.statedRate = Number(values.statedRate);
    if (values.frequency !== undefined) patch.frequency = Number(values.frequency);
    if (values.horizon !== undefined) patch.horizon = Number(values.horizon);
    if (values.calculationType !== undefined) patch.calculationType = String(values.calculationType);
    if (values.pmt !== undefined) patch.pmt = Number(values.pmt);
    if (values.years !== undefined) patch.years = Number(values.years);
    if (values.currencySymbol !== undefined) patch.currencySymbol = String(values.currencySymbol);
    if (values.riskFreeRate !== undefined) patch.riskFreeRate = Number(values.riskFreeRate);
    if (values.inflationPremium !== undefined) patch.inflationPremium = Number(values.inflationPremium);
    if (values.defaultPremium !== undefined) patch.defaultPremium = Number(values.defaultPremium);
    if (values.liquidityPremium !== undefined) patch.liquidityPremium = Number(values.liquidityPremium);
    if (values.maturityPremium !== undefined) patch.maturityPremium = Number(values.maturityPremium);
    updateParams(patch);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 font-sans overflow-x-hidden">
      <CaHeader activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {activeTab === 'tvm' && 'Time Value of Money (TVM) Controls'}
            {activeTab === 'forecasting' && 'Google TimesFM Zero-Shot Forecast Engine'}
            {activeTab === 'risk' && 'CFA Quantitative Risk Premium Analysis'}
          </h2>
          <p className="text-xs text-slate-400">
            Schema-Driven DataForm controls synchronized in real-time via Redux-Saga
          </p>
        </div>
        <button
          onClick={triggerForecast}
          disabled={isLoading}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 shrink-0"
        >
          {isLoading ? "Calculating..." : "Re-run Quantitative Model"}
        </button>
      </div>

      {activeTab === 'risk' ? (
        <CfaRiskBreakdown data={forecastData} currencySymbol={params.currencySymbol || "$"} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Quantitative Inputs
              </h3>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-mono">
                DataForm Schema
              </span>
            </div>

            <DataForm<TvmEntity>
              schema={tvmSchema}
              initial={params}
              onChange={handleFormChange}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TvmTimesfmVisualizer data={forecastData} currencySymbol={params.currencySymbol || "$"} />
            <SingleSumCompoundingChart data={forecastData} currencySymbol={params.currencySymbol || "$"} />
          </div>
        </div>
      )}
    </div>
  );
}
