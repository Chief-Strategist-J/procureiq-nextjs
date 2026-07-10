"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Plus, RefreshCw, CheckCircle2, AlertTriangle, Info, Clock, AlertCircle, X, ShieldAlert, Send } from "lucide-react";

interface NotificationResponse {
  id: number;
  typeCode: string;
  sourceService: string;
  payload: Record<string, any>;
  metadata: Record<string, any>;
  priority: number;
  targetScope: string;
  status: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeCode, setTypeCode] = useState("PO_CREATED");
  const [sourceService, setSourceService] = useState("procurement-service");
  const [targetScope, setTargetScope] = useState("USER");
  const [targetId, setTargetId] = useState("1");
  const [priority, setPriority] = useState(2);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const getMockNotifications = useCallback(() => {
    const stored = localStorage.getItem("procureiq_mock_notifications");
    if (stored) {
      return JSON.parse(stored);
    }
    const seed = [
      {
        id: 101,
        typeCode: "PO_CREATED",
        sourceService: "procurement-service",
        payload: {
          title: "Purchase Order PO-2026-001 Logged",
          message: "New procurement order ready for vendor Acme Corp signature.",
        },
        metadata: { env: "mock" },
        priority: 2,
        targetScope: "USER",
        status: "UNREAD",
        createdAt: new Date().toISOString(),
      },
      {
        id: 102,
        typeCode: "ESC_TRIGGERED",
        sourceService: "system-orchestrator",
        payload: {
          title: "Contract Compliance Alert",
          message: "Escalation triggered: General Liability certificate missing for vendor.",
        },
        metadata: { env: "mock" },
        priority: 3,
        targetScope: "SYSTEM",
        status: "UNREAD",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
    localStorage.setItem("procureiq_mock_notifications", JSON.stringify(seed));
    return seed;
  }, []);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(
        `${backendUrl}/api/v1/notifications?page=${page}&size=20&status=${statusFilter}`,
        {
          headers: {
            "X-User-Id": "1",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const resData = await response.json();
      if (resData.status === "success" && resData.data) {
        setNotifications(resData.data.content || []);
        setTotalElements(resData.data.totalElements || 0);
      } else {
        throw new Error(resData.error?.message || "Failed to load data");
      }
    } catch (err: any) {
      console.warn("Backend offline. Falling back to local storage notifications database.", err);
      // Fallback
      const mockList = getMockNotifications();
      const filteredMock = mockList.filter((n: any) => {
        if (statusFilter === "all") return true;
        return n.status === statusFilter;
      });
      setNotifications(filteredMock);
      setTotalElements(mockList.length);
      setError("Notice: Backend service is currently unreachable. Operating in local sandbox mode.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, statusFilter, getMockNotifications]);

  // Load initial data
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle Mark as Read
  const handleToggleRead = async (notificationId: number, currentStatus: string) => {
    const newStatus = currentStatus === "READ" ? "UNREAD" : "READ";
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      
      const response = await fetch(`${backendUrl}/api/v1/notifications/${notificationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": "1",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update locally
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, status: newStatus } : n))
      );
      
      setSuccess(`Notification marked as ${newStatus.toLowerCase()}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.warn("Updating status in offline fallback mode", err);
      // Fallback update
      const mockList = getMockNotifications();
      const updatedMock = mockList.map((n: any) => n.id === notificationId ? { ...n, status: newStatus } : n);
      localStorage.setItem("procureiq_mock_notifications", JSON.stringify(updatedMock));
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, status: newStatus } : n))
      );
      setSuccess(`[Offline Sandbox] Notification marked as ${newStatus.toLowerCase()}`);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Handle Send Notification
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      setError("Please fill in title and message payload fields");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const requestPayload = {
        typeCode,
        sourceService,
        targetScope,
        targetId: targetId ? parseInt(targetId) : null,
        priority,
        payload: {
          title,
          message,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          environment: "production",
        },
      };

      const response = await fetch(`${backendUrl}/api/v1/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to send notification");
      }

      setSuccess("Notification created and sent successfully!");
      setIsModalOpen(false);
      
      // Reset form
      setTitle("");
      setMessage("");
      
      // Reload notifications list
      fetchNotifications();
    } catch (err: any) {
      setError(err.message || "Failed to create notification.");
    } finally {
      setCreating(false);
    }
  };

  // Filter local state by query string search
  const filteredNotifications = notifications.filter((n) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const titleVal = n.payload?.title || "";
    const msgVal = n.payload?.message || "";
    return (
      n.typeCode.toLowerCase().includes(q) ||
      n.sourceService.toLowerCase().includes(q) ||
      titleVal.toLowerCase().includes(q) ||
      msgVal.toLowerCase().includes(q)
    );
  });

  const getPriorityStyles = (p: number) => {
    if (p >= 3) return "text-red-400 bg-red-950/30 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.07)]";
    if (p === 2) return "text-amber-400 bg-amber-950/30 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.07)]";
    return "text-blue-400 bg-blue-950/20 border-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.05)]";
  };

  const getPriorityLabel = (p: number) => {
    if (p >= 3) return "High Priority";
    if (p === 2) return "Medium";
    return "Low Priority";
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans">
      
      {/* Top ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Notifications Header */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-md">
              <Bell className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                System Registry & Notifications
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Monitor, filter, and dispatch real-time system, process, and agent communications.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => fetchNotifications(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-850 bg-zinc-950/60 backdrop-blur-md px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/80 hover:border-zinc-800 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Sync Feed
          </button>

          <button
            onClick={() => router.push("/notifications/dispatch")}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            <Plus className="h-4 w-4" />
            Dispatch
          </button>
        </div>
      </div>

      {/* Alert Banner System */}
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

      {/* Action Filters and Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1.5 p-1 rounded-lg border border-zinc-850/80 bg-zinc-950/80 backdrop-blur-md w-fit">
          {["all", "UNREAD", "READ"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(0);
              }}
              className={`px-4 py-1.5 text-xs rounded-md capitalize transition-all duration-300 cursor-pointer ${
                statusFilter === status
                  ? "bg-zinc-900 text-white font-medium border border-zinc-800 shadow-lg"
                  : "text-zinc-500 hover:text-zinc-350 border border-transparent"
              }`}
            >
              {status === "all" ? "All Feed" : status.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search payload content, type..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72 rounded-lg bg-zinc-900/60 border border-zinc-800 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700/80 focus:border-zinc-700/80 focus:bg-zinc-900 transition-all duration-300"
          />
        </div>
      </div>

      {/* Data Table Grid container */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          {loading && !refreshing ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <RefreshCw className="h-8 w-8 animate-spin text-zinc-600 mb-3" />
              <p className="text-xs tracking-wider">Syncing communications feed...</p>
            </div>
          ) : (
            <table className="w-full min-w-[850px] text-sm text-left">
              <thead>
                <tr className="bg-zinc-950/80 text-left text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-850">
                  <th className="px-5 py-4 font-medium w-16 text-center">ID</th>
                  <th className="px-5 py-4 font-medium w-32">Event Type</th>
                  <th className="px-5 py-4 font-medium w-40">Source Service</th>
                  <th className="px-5 py-4 font-medium">Message Details</th>
                  <th className="px-5 py-4 font-medium w-32">Priority</th>
                  <th className="px-5 py-4 font-medium w-28 text-center">Target Scope</th>
                  <th className="px-5 py-4 font-medium w-36">Timestamp</th>
                  <th className="px-5 py-4 font-medium w-28 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification, i) => (
                  <tr
                    key={notification.id}
                    className={`group hover:bg-zinc-900/20 transition-all duration-300 border-b border-zinc-900 ${
                      notification.status === "UNREAD" ? "bg-zinc-900/10" : "bg-transparent text-zinc-350"
                    }`}
                  >
                    <td className="px-5 py-4 text-xs font-mono text-zinc-650 text-center">
                      {notification.id}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-md border border-zinc-800 bg-zinc-900/30 px-2 py-0.5 text-xs font-mono text-indigo-400 font-medium">
                        {notification.typeCode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-zinc-500">
                      {notification.sourceService}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {notification.status === "UNREAD" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          )}
                          <span className={`text-xs font-semibold ${notification.status === "UNREAD" ? "text-white" : "text-zinc-300"}`}>
                            {notification.payload?.title || "No Title"}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1 leading-relaxed">
                          {notification.payload?.message || "No message content."}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium transition-all ${getPriorityStyles(notification.priority)}`}>
                        {getPriorityLabel(notification.priority)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-center font-medium">
                      <span className="text-zinc-450 uppercase tracking-widest text-[9px] border border-zinc-850 px-1.5 py-0.5 rounded bg-zinc-900/20">
                        {notification.targetScope}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-500 font-mono whitespace-nowrap">
                      {notification.createdAt ? new Date(notification.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }) : "-"}
                    </td>
                    <td className="px-5 py-4 text-right pr-6 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleRead(notification.id, notification.status)}
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded transition-all duration-300 cursor-pointer ${
                          notification.status === "READ"
                            ? "border border-zinc-800 text-zinc-550 hover:text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700"
                            : "border border-emerald-500/20 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 hover:border-emerald-500/40"
                        }`}
                      >
                        {notification.status === "READ" ? "Mark Unread" : "Mark Read"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredNotifications.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-zinc-500 text-xs">
                      No notifications match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination component */}
      {totalElements > 20 && (
        <div className="flex items-center justify-between mt-5 text-xs text-zinc-500">
          <span>
            Showing {page * 20 + 1} - {Math.min((page + 1) * 20, totalElements)} of {totalElements} logs
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * 20 >= totalElements}
              className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Dispatch Notification Dialog / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/90 text-white animate-scaleIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-zinc-550 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-light tracking-tight mb-5 flex items-center gap-2">
              <Send className="h-4.5 w-4.5 text-indigo-400" />
              Dispatch Notification Registry
            </h2>

            <form onSubmit={handleCreateNotification} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-550 uppercase tracking-widest block font-medium">Event Code</label>
                  <select
                    value={typeCode}
                    onChange={(e) => setTypeCode(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                  >
                    <option value="PO_CREATED">PO Created</option>
                    <option value="ESC_TRIGGERED">Escalation Triggered</option>
                    <option value="PAYMENT_DUE">Payment Due</option>
                    <option value="BID_RECEIVED">Bid Received</option>
                    <option value="APPROVAL_REQUIRED">Approval Required</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-550 uppercase tracking-widest block font-medium">Source Service</label>
                  <select
                    value={sourceService}
                    onChange={(e) => setSourceService(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                  >
                    <option value="procurement-service">Procurement Service</option>
                    <option value="finance-service">Finance Service</option>
                    <option value="bidding-service">Bidding Service</option>
                    <option value="system-orchestrator">System Orchestrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] text-zinc-550 uppercase tracking-widest block font-medium">Target Scope</label>
                  <select
                    value={targetScope}
                    onChange={(e) => setTargetScope(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                  >
                    <option value="USER">User (Direct)</option>
                    <option value="ROLE">Role (Group)</option>
                    <option value="SYSTEM">System Broadcast</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-550 uppercase tracking-widest block font-medium">Target ID</label>
                  <input
                    type="number"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    placeholder="1"
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-550 uppercase tracking-widest block font-medium">Priority Level</label>
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
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      {level === 3 ? "High" : level === 2 ? "Medium" : "Low"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-550 uppercase tracking-widest block font-medium">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Purchase Order #42 Created"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-750 focus:border-zinc-700 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-550 uppercase tracking-widest block font-medium">Message Payload</label>
                <textarea
                  placeholder="e.g. A new purchase order PO-10293 has been created and requires your review."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-20 rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-750 focus:border-zinc-700 transition-all duration-300 resize-none"
                  required
                />
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
                  Dispatch event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
