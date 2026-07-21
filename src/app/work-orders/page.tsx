"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Briefcase, Plus, RefreshCw, CheckCircle2, AlertCircle, X, Send, Calendar, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { workOrdersActions } from "@/features/workOrders/workOrdersSlice";

export default function WorkOrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { data: workOrders = [], status: listStatus, error } = useAppSelector((state) => state.workOrders.items);
  const loading = listStatus === 'loading';
  const refreshing = loading;

  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchWorkOrders = useCallback((isRefresh = false) => {
    dispatch(workOrdersActions.fetchRequest());
  }, [dispatch]);

  // Load initial data
  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  // Filter local state by query string search or status
  const filteredWorkOrders = workOrders.filter((w) => {
    const matchesStatus = statusFilter === "all" || w.status.toLowerCase() === statusFilter.toLowerCase();
    
    if (!matchesStatus) return false;
    if (!query) return true;
    
    const q = query.toLowerCase();
    return (
      w.id.toString().includes(q) ||
      w.status.toLowerCase().includes(q) ||
      (w.caseId && w.caseId.toString().includes(q))
    );
  });

  const getPriorityStyles = (p: number) => {
    if (p >= 3) return "text-red-400 bg-red-950/30 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.07)]";
    if (p === 2) return "text-amber-400 bg-amber-950/30 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.07)]";
    return "text-blue-400 bg-blue-950/20 border-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.05)]";
  };

  const getPriorityLabel = (p: number) => {
    if (p >= 3) return "High";
    if (p === 2) return "Medium";
    return "Low";
  };

  const getStatusStyles = (s: string) => {
    const statusLower = s.toLowerCase();
    if (statusLower === "new") return "bg-blue-950/60 text-blue-400 border-blue-800/40";
    if (statusLower === "completed") return "bg-emerald-950/60 text-emerald-400 border-emerald-800/40";
    if (statusLower === "in_progress" || statusLower === "in progress") return "bg-amber-950/60 text-amber-400 border-amber-800/40";
    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative">
      
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar */}
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
              <p className="text-xs text-zinc-500 mt-1">
                Manage accounts, log cases, and track operational execution items.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => fetchWorkOrders(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-850 bg-zinc-950/60 backdrop-blur-md px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/80 hover:border-zinc-800 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Sync Records
          </button>

          <button
            onClick={() => router.push("/work-orders/create")}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            <Plus className="h-4 w-4" />
            Create Work Order
          </button>
        </div>
      </div>

      {/* Alert logs */}
      {error && (
        <div className="mb-6 p-3.5 text-xs bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-3.5 text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Filters and search inputs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1.5 p-1 rounded-lg border border-zinc-850/80 bg-zinc-950/80 backdrop-blur-md w-fit">
          {["all", "new", "in_progress", "completed"].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => setStatusFilter(statusOption)}
              className={`px-4 py-1.5 text-xs rounded-md capitalize transition-all duration-300 cursor-pointer ${
                statusFilter === statusOption
                  ? "bg-zinc-900 text-white font-medium border border-zinc-800 shadow-lg"
                  : "text-zinc-500 hover:text-zinc-350 border border-transparent"
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72 rounded-lg bg-zinc-900/60 border border-zinc-800 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          {loading && !refreshing && workOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <RefreshCw className="h-8 w-8 animate-spin text-zinc-600 mb-3" />
              <p className="text-xs tracking-wider">Syncing database work orders...</p>
            </div>
          ) : (
            <table className="w-full min-w-[800px] text-sm text-left">
              <thead>
                <tr className="bg-zinc-950/80 text-left text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-850">
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
                {filteredWorkOrders.map((workOrder, i) => (
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
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium transition-all ${getPriorityStyles(workOrder.priority)}`}>
                        {getPriorityLabel(workOrder.priority)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${getStatusStyles(workOrder.status)}`}>
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

                {filteredWorkOrders.length === 0 && !loading && (
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
