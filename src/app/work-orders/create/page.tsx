"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useCreateWorkOrderPageState } from "@/features/workOrders/CreateWorkOrderPageState";
import { workOrdersActions } from "@/features/workOrders/workOrdersSlice";

export default function CreateWorkOrderPage() {
  const state = useCreateWorkOrderPageState();

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative flex flex-col">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4 mb-8 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/work-orders"
            className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-505 bg-clip-text text-transparent">
              Work Order Creation Console
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Log client cases, technical issues, and dispatch instructions into the database.
            </p>
          </div>
        </div>
      </div>

      {state.error && (
        <div className="mb-6 p-4 text-xs bg-red-955/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}
      
      {state.success && (
        <div className="mb-6 p-4 text-xs bg-emerald-955/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-505" />
          <span className="font-medium">{state.success}</span>
        </div>
      )}

      <form onSubmit={state.handleCreateWorkOrder} className="space-y-8 flex-1 flex flex-col justify-between w-full">
        <div className="space-y-8 w-full">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-450">Record Properties</h3>
            <p className="text-[11px] text-zinc-555 mt-0.5">Define metadata associations for the logged task.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Case ID (Optional)</label>
              <input
                type="number"
                value={state.caseId}
                onChange={(e) => state.dispatch(workOrdersActions.setFormField({ field: "caseId", value: e.target.value }))}
                placeholder="1"
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Contact ID (Optional)</label>
              <input
                type="number"
                value={state.contactId}
                onChange={(e) => state.dispatch(workOrdersActions.setFormField({ field: "contactId", value: e.target.value }))}
                placeholder="1"
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Asset ID (Optional)</label>
              <input
                type="number"
                value={state.assetId}
                onChange={(e) => state.dispatch(workOrdersActions.setFormField({ field: "assetId", value: e.target.value }))}
                placeholder="1"
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Work Type ID</label>
              <input
                type="number"
                value={state.workTypeId}
                onChange={(e) => state.dispatch(workOrdersActions.setFormField({ field: "workTypeId", value: e.target.value }))}
                placeholder="1"
                required
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Status</label>
            <select
              value={state.status}
              onChange={(e) => state.dispatch(workOrdersActions.setFormField({ field: "status", value: e.target.value }))}
              className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700"
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Priority Level</label>
            <div className="grid grid-cols-3 gap-4 max-w-xl">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => state.dispatch(workOrdersActions.setFormField({ field: "priority", value: level }))}
                  className={`py-3 rounded-lg border text-xs cursor-pointer text-center font-medium transition-all duration-300 ${
                    state.priority === level
                      ? level === 3
                        ? "border-red-500/40 bg-red-950/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                        : level === 2
                        ? "border-amber-500/40 bg-amber-955/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                        : "border-blue-500/40 bg-blue-955/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                      : "border-zinc-850 bg-zinc-900/20 text-zinc-505 hover:text-zinc-350 hover:border-zinc-750"
                  }`}
                >
                  {level === 3 ? "High" : level === 2 ? "Medium" : "Low"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 mt-12 border-t border-zinc-900">
          <Link
            href="/work-orders"
            className="px-8 py-3 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-xs font-semibold cursor-pointer transition-all text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={state.creating}
            className="px-10 py-3 rounded-lg bg-white text-black hover:bg-zinc-150 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            {state.creating && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
