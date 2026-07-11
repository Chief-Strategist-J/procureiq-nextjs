"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search, ListChecks, Plus, RefreshCw, CheckCircle2, AlertCircle, X, Edit2, Trash2, Play, History,
} from "lucide-react";
import { JobsApi } from "./api-client";
import { Job, JobRun } from "./types";

export default function JobsPage() {
  const [items, setItems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [orgId, setOrgId] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [configText, setConfigText] = useState("{}");
  const [configError, setConfigError] = useState("");
  const [saving, setSaving] = useState(false);

  const [isRunsModalOpen, setIsRunsModalOpen] = useState(false);
  const [runsJob, setRunsJob] = useState<Job | null>(null);
  const [runs, setRuns] = useState<JobRun[]>([]);
  const [runsLoading, setRunsLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await JobsApi.listJobs();
      setItems(data);
    } catch {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreateModal = () => {
    setModalMode("create");
    setOrgId("1");
    setCategoryId("");
    setName("");
    setStatus("active");
    setConfigText("{}");
    setConfigError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: Job) => {
    setModalMode("edit");
    setEditingId(item.id);
    setOrgId(item.orgId.toString());
    setCategoryId(item.categoryId?.toString() || "");
    setName(item.name);
    setStatus(item.status);
    setConfigText(JSON.stringify(item.config ?? {}, null, 2));
    setConfigError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let config: Record<string, unknown>;
    try {
      config = configText.trim() ? JSON.parse(configText) : {};
    } catch {
      setConfigError("Config must be valid JSON.");
      return;
    }
    setConfigError("");

    setSaving(true);
    setError("");
    setSuccess("");

    const payload: Omit<Job, "id"> = { orgId: parseInt(orgId) || 1, name, status, config };
    if (categoryId) payload.categoryId = parseInt(categoryId);

    try {
      if (modalMode === "create") {
        await JobsApi.createJob(payload);
        setSuccess("Job created successfully.");
      } else if (modalMode === "edit" && editingId !== null) {
        await JobsApi.updateJob(editingId, payload);
        setSuccess("Job updated successfully.");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    setError("");
    setSuccess("");
    try {
      await JobsApi.deleteJob(id);
      setSuccess("Job deleted successfully.");
      fetchItems();
    } catch {
      setError("Failed to delete job.");
    }
  };

  const openRunsModal = async (job: Job) => {
    setRunsJob(job);
    setIsRunsModalOpen(true);
    setRunsLoading(true);
    try {
      const data = await JobsApi.listRuns(job.id);
      setRuns(data);
    } catch {
      setRuns([]);
    } finally {
      setRunsLoading(false);
    }
  };

  const handleTriggerRun = async (jobId: number) => {
    setTriggering(true);
    try {
      await JobsApi.triggerRun(jobId);
      const data = await JobsApi.listRuns(jobId);
      setRuns(data);
      setSuccess("Job run triggered successfully.");
    } catch {
      setError("Failed to trigger job run.");
    } finally {
      setTriggering(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.status.toLowerCase().includes(q) || item.id.toString().includes(q);
  });

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-md">
              <ListChecks className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Job Scheduler
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Configure background jobs, categories, and trigger/inspect execution runs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={fetchItems}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            <Plus className="h-4 w-4" />
            New Job
          </button>
        </div>
      </div>

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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, status or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500"
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <RefreshCw className="h-8 w-8 animate-spin text-zinc-600 mb-3" />
              <p className="text-xs tracking-wider">Syncing job scheduler...</p>
            </div>
          ) : (
            <table className="w-full min-w-[750px] text-sm text-left">
              <thead>
                <tr className="bg-zinc-950/80 text-left text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <th className="px-5 py-4 font-medium w-20">ID</th>
                  <th className="px-5 py-4 font-medium w-64">Name</th>
                  <th className="px-5 py-4 font-medium w-32">Category</th>
                  <th className="px-5 py-4 font-medium w-32">Status</th>
                  <th className="px-5 py-4 font-medium text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/20 transition-all duration-300 border-b border-zinc-900 text-zinc-300">
                    <td className="px-5 py-4 text-xs font-mono font-semibold text-white">#{item.id}</td>
                    <td className="px-5 py-4 text-xs font-medium text-zinc-200">{item.name}</td>
                    <td className="px-5 py-4 text-xs font-mono text-zinc-400">{item.categoryId ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-zinc-900 text-zinc-400 border-zinc-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleTriggerRun(item.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 hover:border-emerald-500/40 text-[10px] uppercase font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Trigger Run
                        </button>
                        <button
                          onClick={() => openRunsModal(item)}
                          className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:text-white transition-all text-zinc-400 cursor-pointer"
                        >
                          <History className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:text-white transition-all text-zinc-400 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-900/50 hover:bg-red-950/20 bg-zinc-950/60 hover:text-red-400 transition-all text-zinc-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-zinc-500 text-xs">
                      No jobs found in scheduler.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/90 text-white animate-scaleIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-light tracking-tight mb-5 flex items-center gap-2">
              <ListChecks className="h-4.5 w-4.5 text-indigo-400" />
              {modalMode === "create" ? "New Job" : "Edit Job"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Org ID</label>
                  <input
                    type="number"
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    required
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Category ID (Optional)</label>
                  <input
                    type="number"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Job Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nightly Vendor Sync"
                  required
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Config (JSON)</label>
                <textarea
                  value={configText}
                  onChange={(e) => setConfigText(e.target.value)}
                  rows={5}
                  spellCheck={false}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                />
                {configError && <p className="text-[11px] text-red-400">{configError}</p>}
              </div>

              <div className="flex justify-end gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all duration-300"
                >
                  {saving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Runs Modal */}
      {isRunsModalOpen && runsJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsRunsModalOpen(false)} />

          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/90 text-white animate-scaleIn">
            <button
              onClick={() => setIsRunsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-light tracking-tight mb-1 flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-indigo-400" />
              Runs — {runsJob.name}
            </h2>
            <p className="text-[11px] text-zinc-500 mb-4">Job #{runsJob.id}</p>

            <button
              onClick={() => handleTriggerRun(runsJob.id)}
              disabled={triggering}
              className="mb-4 flex items-center gap-1.5 rounded-lg border border-emerald-500/20 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {triggering ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              Trigger New Run
            </button>

            <div className="max-h-72 overflow-y-auto rounded-lg border border-zinc-900 divide-y divide-zinc-900">
              {runsLoading ? (
                <div className="flex items-center justify-center py-10 text-zinc-500">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                </div>
              ) : runs.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-xs">No runs recorded yet.</div>
              ) : (
                runs.map((run) => (
                  <div key={run.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-zinc-300">Run #{run.id}</span>
                      <span className="ml-2 text-zinc-500">
                        {run.startedAt ? new Date(run.startedAt).toLocaleString() : "Not started"}
                      </span>
                    </div>
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-zinc-900 text-zinc-400 border-zinc-800">
                      {run.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
