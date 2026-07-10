"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Send, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Info, Sparkles, Database } from "lucide-react";

export default function DispatchNotificationPage() {
  const router = useRouter();
  const [typeCode, setTypeCode] = useState("PO_CREATED");
  const [sourceService, setSourceService] = useState("procurement-service");
  const [targetScope, setTargetScope] = useState("USER");
  const [targetId, setTargetId] = useState("1");
  const [priority, setPriority] = useState(2);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const templates = [
    {
      label: "Purchase Order Onboarding",
      type: "PO_CREATED",
      source: "procurement-service",
      title: "Purchase Order PO-2026-904 Created",
      message: "A new purchase order has been logged for Acme Corp (General Liability). Requires supervisor signoff.",
      priority: 2,
    },
    {
      label: "Escalation Run Trigger",
      type: "ESC_TRIGGERED",
      source: "system-orchestrator",
      title: "Critical Contract SLA Breach Alert",
      message: "Escalation Step #2 triggered: Vendor has failed to update compliance certificates within the 48-hour window.",
      priority: 3,
    },
    {
      label: "Pending Account Action",
      type: "APPROVAL_REQUIRED",
      source: "finance-service",
      title: "Invoice #INV-9023 Approval Needed",
      message: "Billing statement matches dispatch criteria. Total sum: $12,420.00. Approver scope: Procurement Lead.",
      priority: 1,
    },
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setTypeCode(tpl.type);
    setSourceService(tpl.source);
    setTitle(tpl.title);
    setMessage(tpl.message);
    setPriority(tpl.priority);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          dispatchMethod: "full_page_dispatcher",
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
        throw new Error(errText || "Failed to dispatch notification");
      }

      setSuccess("Notification event dispatched successfully!");
      setTitle("");
      setMessage("");

      setTimeout(() => {
        router.push("/notifications");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to dispatch notification.");
    } finally {
      setCreating(false);
    }
  };

  const getGeneratedJSON = () => {
    return JSON.stringify(
      {
        typeCode,
        sourceService,
        targetScope,
        targetId: targetId ? parseInt(targetId) : null,
        priority,
        payload: { title, message },
        metadata: {
          timestamp: new Date().toISOString(),
          environment: "production",
        },
      },
      null,
      2
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative flex flex-col">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-4 mb-8 border-b border-zinc-900 pb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Notification Dispatch Console
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Construct, review, and broadcast active notifications to target users or broadcast queues.
            </p>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="mb-6 p-4 text-xs bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md shrink-0">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md shrink-0">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Main Two-Column Layout that takes whole width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch">
        
        {/* Left Side: The Interactive Dispatch Form (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-800 bg-zinc-950/30 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">Event Parameters</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Event Code</label>
                <select
                  value={typeCode}
                  onChange={(e) => setTypeCode(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                >
                  <option value="PO_CREATED">PO Created</option>
                  <option value="ESC_TRIGGERED">Escalation Triggered</option>
                  <option value="PAYMENT_DUE">Payment Due</option>
                  <option value="BID_RECEIVED">Bid Received</option>
                  <option value="APPROVAL_REQUIRED">Approval Required</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Source Service</label>
                <select
                  value={sourceService}
                  onChange={(e) => setSourceService(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                >
                  <option value="procurement-service">Procurement Service</option>
                  <option value="finance-service">Finance Service</option>
                  <option value="bidding-service">Bidding Service</option>
                  <option value="system-orchestrator">System Orchestrator</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Target Scope</label>
                <select
                  value={targetScope}
                  onChange={(e) => setTargetScope(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                >
                  <option value="USER">User (Direct)</option>
                  <option value="ROLE">Role (Group)</option>
                  <option value="SYSTEM">System Broadcast</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Target ID</label>
                <input
                  type="number"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="1"
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Priority Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`py-2.5 rounded-lg border text-xs cursor-pointer text-center font-medium transition-all duration-300 ${
                      priority === level
                        ? level === 3
                          ? "border-red-500/40 bg-red-950/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                          : level === 2
                          ? "border-amber-500/40 bg-amber-950/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                          : "border-blue-500/40 bg-blue-950/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    {level === 3 ? "High Priority" : level === 2 ? "Medium" : "Low Priority"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Payload Title</label>
              <input
                type="text"
                placeholder="e.g. Purchase Order #42 Created"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Payload Message</label>
              <textarea
                placeholder="e.g. A new purchase order PO-10293 has been created and requires your review."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
              <Link
                href="/notifications"
                className="px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={creating}
                className="px-8 py-3 rounded-lg bg-white text-black hover:bg-zinc-150 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
              >
                {creating && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                Dispatch Event
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Helper & Live JSON Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Templates Section */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Templates Quick Fill
            </h3>
            <div className="space-y-2.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="w-full text-left p-3 rounded-lg border border-zinc-850 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-white group-hover:text-indigo-400 transition-colors">
                      {tpl.label}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500">
                      {tpl.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">{tpl.message}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Live API Payload Preview */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 flex-1 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-indigo-400" />
                REST Request Payload (JSON)
              </h3>
              <div className="relative rounded-lg bg-zinc-900/80 border border-zinc-850 p-4 font-mono text-[10px] text-zinc-400 overflow-x-auto h-72">
                <pre>{getGeneratedJSON()}</pre>
              </div>
            </div>
            <div className="text-[10px] text-zinc-550 mt-4 leading-normal flex items-start gap-2">
              <Info className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span>
                This payload conforms exactly to the backend record definition of <code>SendNotificationRequest</code>. Dispatched requests are queued in the Postgres DB and processed asynchronously by the background routing engine.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
