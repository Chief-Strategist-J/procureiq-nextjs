"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Info, Database, Sparkles } from "lucide-react";

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
      const requestPayload = {
        caseId: caseId ? parseInt(caseId) : null,
        contactId: contactId ? parseInt(contactId) : null,
        assetId: assetId ? parseInt(assetId) : null,
        workTypeId: workTypeId ? parseInt(workTypeId) : null,
        status,
        priority,
      };

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

  const getGeneratedJSON = () => {
    return JSON.stringify(
      {
        caseId: caseId ? parseInt(caseId) : null,
        contactId: contactId ? parseInt(contactId) : null,
        assetId: assetId ? parseInt(assetId) : null,
        workTypeId: workTypeId ? parseInt(workTypeId) : null,
        status,
        priority,
      },
      null,
      2
    );
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
            <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
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

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch">
        
        {/* Left Side: Create Form (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-800 bg-zinc-950/30 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <form onSubmit={handleCreateWorkOrder} className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">Record properties</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Case ID (Optional)</label>
                <input
                  type="number"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="1"
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Contact ID (Optional)</label>
                <input
                  type="number"
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  placeholder="1"
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Asset ID (Optional)</label>
                <input
                  type="number"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  placeholder="1"
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Work Type ID (Optional)</label>
                <input
                  type="number"
                  value={workTypeId}
                  onChange={(e) => setWorkTypeId(e.target.value)}
                  placeholder="1"
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Priority Level</label>
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
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-350 hover:border-zinc-700"
                    }`}
                  >
                    {level === 3 ? "High" : level === 2 ? "Medium" : "Low"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
              <Link
                href="/work-orders"
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
                Register
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Information / JSON preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Field Guidelines
            </h3>
            <ul className="text-xs text-zinc-450 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Work Orders serve as the parent database entries linking specific cases to accounts and assets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>When a Work Type is assigned, a matching <strong>Service Appointment</strong> will be generated automatically in the background.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 flex-1 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-indigo-400" />
                WorkOrderRequest Payload (JSON)
              </h3>
              <div className="relative rounded-lg bg-zinc-900/80 border border-zinc-850 p-4 font-mono text-[10px] text-zinc-400 overflow-x-auto h-64">
                <pre>{getGeneratedJSON()}</pre>
              </div>
            </div>
            <div className="text-[10px] text-zinc-550 mt-4 leading-normal flex items-start gap-2">
              <Info className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span>
                Dispatched API updates call <code>WorkOrderController</code> endpoints to map relationships inside JPA entities.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
