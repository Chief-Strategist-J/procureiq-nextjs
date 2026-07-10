"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateWorkOrderPage() {
  const router = useRouter();
  const [caseId, setCaseId] = useState("");
  const [contactId, setContactId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [workTypeId, setWorkTypeId] = useState("");
  const [status, setStatus] = useState("new");
  const [priority, setPriority] = useState(2);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      
      // Reset form
      setCaseId("");
      setContactId("");
      setAssetId("");
      setWorkTypeId("");
      setStatus("new");
      setPriority(2);
      
      setTimeout(() => {
        router.push("/work-orders");
      }, 1500);
    } catch (err: any) {
      console.warn("Creating work order in offline fallback mode", err);
      // Fallback local storage
      const stored = localStorage.getItem("procureiq_mock_work_orders");
      const mockList = stored ? JSON.parse(stored) : [];
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
      
      setCaseId("");
      setContactId("");
      setAssetId("");
      setWorkTypeId("");
      setStatus("new");
      setPriority(2);

      setTimeout(() => {
        router.push("/work-orders");
      }, 1500);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative flex flex-col">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
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

      {/* Alert states */}
      {error && (
        <div className="mb-6 p-4 text-xs bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Main Full-Width Form Layout */}
      <form onSubmit={handleCreateWorkOrder} className="space-y-8 flex-1 flex flex-col justify-between w-full">
        <div className="space-y-8 w-full">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Record Properties</h3>
            <p className="text-[11px] text-zinc-555 mt-0.5">Define metadata associations for the logged task.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Case ID (Optional)</label>
              <input
                type="number"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="1"
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Contact ID (Optional)</label>
              <input
                type="number"
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                placeholder="1"
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Asset ID (Optional)</label>
              <input
                type="number"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="1"
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Work Type ID</label>
              <input
                type="number"
                value={workTypeId}
                onChange={(e) => setWorkTypeId(e.target.value)}
                placeholder="1"
                required
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
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
                  onClick={() => setPriority(level)}
                  className={`py-3 rounded-lg border text-xs cursor-pointer text-center font-medium transition-all duration-300 ${
                    priority === level
                      ? level === 3
                        ? "border-red-500/40 bg-red-950/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                        : level === 2
                        ? "border-amber-500/40 bg-amber-950/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                        : "border-blue-500/40 bg-blue-950/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                      : "border-zinc-850 bg-zinc-900/20 text-zinc-500 hover:text-zinc-350 hover:border-zinc-750"
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
            disabled={creating}
            className="px-10 py-3 rounded-lg bg-white text-black hover:bg-zinc-150 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            {creating && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
