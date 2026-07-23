"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Briefcase, Plus, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useWorkOrdersPageState } from "@/features/workOrders/WorkOrdersPageState";

export default function WorkOrdersPage() {
  const state = useWorkOrdersPageState();

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-md">
              <Briefcase className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Field Service Work Orders
              </h1>
              <p className="text-xs text-zinc-505 mt-1">
                Manage accounts, log cases, and track operational execution items.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={state.fetchWorkOrders}
            disabled={state.refreshing || state.loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-850 bg-zinc-950/60 backdrop-blur-md px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/80 hover:border-zinc-800 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${state.refreshing ? "animate-spin" : ""}`} />
            Sync Records
          </button>

          <button
            onClick={() => state.router.push("/work-orders/create")}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            <Plus className="h-4 w-4" />
            Create Work Order
          </button>
        </div>
      </div>

      {state.error && (
        <div className="mb-6 p-3.5 text-xs bg-red-955/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}
      
      {state.success && (
        <div className="mb-6 p-3.5 text-xs bg-emerald-955/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-505" />
          <span className="font-medium">{state.success}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1.5 p-1 rounded-lg border border-zinc-850/80 bg-zinc-950/80 backdrop-blur-md w-fit">
          {["all", "new", "in_progress", "completed"].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => state.dispatch(workOrdersActions.setFormField({ field: "statusFilter", value: statusOption }))}
              className={`px-4 py-1.5 text-xs rounded-md capitalize transition-all duration-300 cursor-pointer ${
                state.statusFilter === statusOption
                  ? "bg-zinc-900 text-white font-medium border border-zinc-800 shadow-lg"
                  : "text-zinc-505 hover:text-zinc-350 border border-transparent"
              }`}
            >
              {statusOption === "all" ? "All Orders" : statusOption.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search work order ID, case..."
            value={state.query}
            onChange={(e) => state.dispatch(workOrdersActions.setSearchQuery(e.target.value))}
            className="w-full sm:w-72 rounded-lg bg-zinc-900/60 border border-zinc-800 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300 focus:border-zinc-750"
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          {state.loading && !state.refreshing && state.workOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-505">
              <RefreshCw className="h-8 w-8 animate-spin text-zinc-650 mb-3" />
              <p className="text-xs tracking-wider">Syncing database work orders...</p>
            </div>
          ) : (
            <table className="w-full min-w-[800px] text-sm text-left">
              <thead>
                <tr className="bg-zinc-955/80 text-left text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-850">
                  <th className="px-5 py-4 font-medium w-24">Work Order ID</th>
                  <th className="px-5 py-4 font-medium w-36">Account ID</th>
                  <th className="px-5 py-4 font-medium w-32">Case ID</th>
                  <th className="px-5 py-4 font-medium w-32">Work Type ID</th>
                  <th className="px-5 py-4 font-medium w-28">Priority</th>
                  <th className="px-5 py-4 font-medium w-32">Status</th>
                  <th className="px-5 py-4 font-medium">Logged Date</th>
                </tr>
              </thead>
              <tbody>
                {state.filteredWorkOrders.map((workOrder) => (
                  <tr
                    key={workOrder.id}
                    className="hover:bg-zinc-900/20 transition-all duration-300 border-b border-zinc-900 text-zinc-300"
                  >
                    <td className="px-5 py-4 text-xs font-mono font-semibold text-white">
                      #{workOrder.id}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-zinc-500">
                      Account #{workOrder.accountId}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-zinc-400">
                      {workOrder.caseId ? `Case #${workOrder.caseId}` : "N/A"}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-zinc-400">
                      {workOrder.workTypeId ? `Type #${workOrder.workTypeId}` : "Default"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium transition-all ${state.getPriorityStyles(workOrder.priority)}`}>
                        {state.getPriorityLabel(workOrder.priority)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${state.getStatusStyles(workOrder.status)}`}>
                        {workOrder.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-500 font-mono">
                      {workOrder.createdAt ? new Date(workOrder.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }) : "-"}
                    </td>
                  </tr>
                ))}

                {state.filteredWorkOrders.length === 0 && !state.loading && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-zinc-500 text-xs">
                      No work orders registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
