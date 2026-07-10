"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Briefcase, Plus, RefreshCw, CheckCircle2, AlertCircle, X, Send, Calendar, Clock } from "lucide-react";

interface WorkOrderResponse {
  id: number;
  parentWorkOrderId?: number;
  caseId?: number;
  accountId: number;
  entitlementId?: number;
  contactId?: number;
  assetId?: number;
  workTypeId?: number;
  priceBookId?: number;
  status: string;
  priority: number;
  createdAt: string;
}

export default function WorkOrdersPage() {
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [contactId, setContactId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [workTypeId, setWorkTypeId] = useState("");
  const [status, setStatus] = useState("new");
  const [priority, setPriority] = useState(2);
  const [creating, setCreating] = useState(false);

  const getMockWorkOrders = useCallback(() => {
    const stored = localStorage.getItem("procureiq_mock_work_orders");
    if (stored) {
      return JSON.parse(stored);
    }
    const seed = [
      {
        id: 1001,
        accountId: 1,
        caseId: 50,
        workTypeId: 10,
        priority: 2,
        status: "new",
        createdAt: new Date().toISOString(),
      },
      {
        id: 1002,
        accountId: 1,
        caseId: 52,
        workTypeId: 12,
        priority: 3,
        status: "in_progress",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      }
    ];
    localStorage.setItem("procureiq_mock_work_orders", JSON.stringify(seed));
    return seed;
  }, []);

  const fetchWorkOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${backendUrl}/api/v1/fieldservice/work-orders`);

      if (!response.ok) {
        throw new Error(`Failed to fetch work orders: ${response.statusText}`);
      }

      const resData = await response.json();
      if (resData.status === "success" && resData.data) {
        setWorkOrders(resData.data || []);
      } else {
        throw new Error(resData.error?.message || "Failed to load work orders");
      }
    } catch (err: any) {
      console.warn("Backend offline. Falling back to local storage work orders database.", err);
      // Fallback
      setWorkOrders(getMockWorkOrders());
      setError("Notice: Backend service is currently unreachable. Operating in local sandbox mode.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getMockWorkOrders]);

  // Load initial data
  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  // Handle Create Work Order
  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const requestPayload: Record<string, any> = {
        status,
        priority,
      };
      if (caseId) requestPayload.caseId = parseInt(caseId);
      if (contactId) requestPayload.contactId = parseInt(contactId);
      if (assetId) requestPayload.assetId = parseInt(assetId);
      if (workTypeId) requestPayload.workTypeId = parseInt(workTypeId);

      const response = await fetch(`${backendUrl}/api/v1/fieldservice/work-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to create work order");
      }

      setSuccess("Work order registered successfully!");
      setIsModalOpen(false);
      
      // Reset form
      setCaseId("");
      setContactId("");
      setAssetId("");
      setWorkTypeId("");
      setStatus("new");
      setPriority(2);
      
      // Reload work orders list
      fetchWorkOrders();
    } catch (err: any) {
      console.warn("Creating work order in offline fallback mode", err);
      const mockList = getMockWorkOrders();
      const newWO = {
        id: mockList.length > 0 ? Math.max(...mockList.map((w: any) => w.id)) + 1 : 1001,
        accountId: 1,
        caseId: caseId ? parseInt(caseId) : undefined,
        contactId: contactId ? parseInt(contactId) : undefined,
        assetId: assetId ? parseInt(assetId) : undefined,
        workTypeId: workTypeId ? parseInt(workTypeId) : undefined,
        priority,
        status,
        createdAt: new Date().toISOString(),
      };
      const updatedList = [newWO, ...mockList];
      localStorage.setItem("procureiq_mock_work_orders", JSON.stringify(updatedList));

      setSuccess("[Offline Sandbox] Work order registered successfully!");
      setIsModalOpen(false);
      
      // Reset form
      setCaseId("");
      setContactId("");
      setAssetId("");
      setWorkTypeId("");
      setStatus("new");
      setPriority(2);
      
      fetchWorkOrders();
    } finally {
      setCreating(false);
    }
  };

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
          {loading && !refreshing ? (
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

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/90 text-white animate-scaleIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-zinc-555 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-light tracking-tight mb-5 flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-indigo-400" />
              New Work Order Registry
            </h2>

            <form onSubmit={handleCreateWorkOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Case ID (Optional)</label>
                  <input
                    type="number"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    placeholder="1"
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Contact ID (Optional)</label>
                  <input
                    type="number"
                    value={contactId}
                    onChange={(e) => setContactId(e.target.value)}
                    placeholder="1"
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Asset ID (Optional)</label>
                  <input
                    type="number"
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    placeholder="1"
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Work Type ID</label>
                  <input
                    type="number"
                    value={workTypeId}
                    onChange={(e) => setWorkTypeId(e.target.value)}
                    placeholder="1"
                    required
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`py-2 rounded-lg border text-xs cursor-pointer text-center font-medium transition-all duration-300 ${
                        priority === level
                          ? level === 3
                            ? "border-red-500/40 bg-red-950/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                            : level === 2
                            ? "border-amber-500/40 bg-amber-950/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                            : "border-blue-500/40 bg-blue-950/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-350 hover:border-zinc-700"
                      }`}
                    >
                      {level === 3 ? "High" : level === 2 ? "Medium" : "Low"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-xs font-semibold cursor-pointer transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all duration-300"
                >
                  {creating && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
