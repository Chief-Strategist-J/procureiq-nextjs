"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  GitBranch, Search, RefreshCw, CheckCircle2, AlertCircle, X, Rocket, Play, Eye, Star, CircleDot,
} from "lucide-react";
import { GitHubApi } from "./api-client";
import { ActionTemplate, RepoInfo, WorkflowRun } from "./types";

interface RowResult {
  kind: "deploy" | "dispatch";
  ok: boolean;
  message: string;
  mock?: boolean;
}

export default function GitHubDashboard() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const [templates, setTemplates] = useState<ActionTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [repoInfoError, setRepoInfoError] = useState("");
  const [repoInfoLoading, setRepoInfoLoading] = useState(false);

  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [runsError, setRunsError] = useState("");
  const [runsLoading, setRunsLoading] = useState(false);

  const [rowResults, setRowResults] = useState<Record<number, RowResult>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [yamlTemplate, setYamlTemplate] = useState<ActionTemplate | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("piq_github_target");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOwner(parsed.owner || "");
        setRepo(parsed.repo || "");
      } catch {
        // ignore malformed local target
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("piq_github_target", JSON.stringify({ owner, repo }));
  }, [owner, repo]);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await GitHubApi.listTemplates();
      setTemplates(data);
    } catch {
      setError("Failed to load GitHub Action templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleLookupRepo = async () => {
    if (!owner || !repo) return;
    setRepoInfoLoading(true);
    setRepoInfoError("");
    try {
      const info = await GitHubApi.getRepoInfo(owner, repo);
      setRepoInfo(info);
    } catch (err) {
      setRepoInfoError(err instanceof Error ? err.message : "Failed to fetch repo info.");
    } finally {
      setRepoInfoLoading(false);
    }
  };

  const handleRefreshRuns = async () => {
    if (!owner || !repo) return;
    setRunsLoading(true);
    setRunsError("");
    try {
      const runs = await GitHubApi.listWorkflowRuns(owner, repo);
      setWorkflowRuns(runs);
    } catch (err) {
      setRunsError(err instanceof Error ? err.message : "Failed to fetch workflow runs.");
    } finally {
      setRunsLoading(false);
    }
  };

  const handleDeploy = async (template: ActionTemplate) => {
    if (!owner || !repo) {
      setError("Set a target owner and repo before deploying.");
      return;
    }
    setBusyId(template.id);
    setError("");
    setSuccess("");
    try {
      const result = await GitHubApi.deployTemplate(owner, repo, template);
      setRowResults((prev) => ({
        ...prev,
        [template.id]: {
          kind: "deploy",
          ok: true,
          message: result.mock ? `Mock deploy recorded at ${result.path}` : `Deployed to ${result.htmlUrl}`,
          mock: result.mock,
        },
      }));
      setSuccess(`"${template.name}" deployed successfully.`);
    } catch (err) {
      setRowResults((prev) => ({
        ...prev,
        [template.id]: { kind: "deploy", ok: false, message: err instanceof Error ? err.message : "Deploy failed." },
      }));
    } finally {
      setBusyId(null);
    }
  };

  const handleTrigger = async (template: ActionTemplate) => {
    if (!owner || !repo) {
      setError("Set a target owner and repo before triggering.");
      return;
    }
    setBusyId(template.id);
    setError("");
    setSuccess("");
    try {
      const message = await GitHubApi.dispatch(owner, repo, template.eventType);
      setRowResults((prev) => ({
        ...prev,
        [template.id]: { kind: "dispatch", ok: true, message },
      }));
      setSuccess(`"${template.name}" triggered successfully.`);
    } catch (err) {
      setRowResults((prev) => ({
        ...prev,
        [template.id]: { kind: "dispatch", ok: false, message: err instanceof Error ? err.message : "Trigger failed." },
      }));
    } finally {
      setBusyId(null);
    }
  };

  const categories = Array.from(new Set(templates.map((t) => t.category))).sort();

  const filteredTemplates = templates.filter((t) => {
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.eventType.toLowerCase().includes(q);
  });

  const anyMockResult = Object.values(rowResults).some((r) => r.mock);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-md">
            <GitBranch className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              GitHub Actions Dashboard
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Deploy and trigger daily automation templates against a target GitHub repository.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="owner"
            className="w-32 rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-500"
          />
          <span className="text-zinc-600">/</span>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="repo"
            className="w-32 rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-500"
          />
        </div>
      </div>

      {anyMockResult && (
        <div className="mb-6 p-3.5 text-xs bg-amber-950/20 border border-amber-500/20 text-amber-400 rounded-lg flex items-center gap-2.5 backdrop-blur-md">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-500" />
          <span className="font-medium">
            Backend has no <code>GITHUB_TOKEN</code> configured — deploys/dispatches succeed but do not touch a real repository yet. Set the token on the Spring Boot service to go live.
          </span>
        </div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white">Repository Info</h2>
            <button
              onClick={handleLookupRepo}
              disabled={repoInfoLoading || !owner || !repo}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/80 transition-all disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${repoInfoLoading ? "animate-spin" : ""}`} />
              Look Up
            </button>
          </div>
          {repoInfoError && <p className="text-xs text-red-400">{repoInfoError}</p>}
          {repoInfo && (
            <div className="space-y-1.5 text-xs text-zinc-400">
              <p className="text-white font-medium">{repoInfo.fullName}</p>
              <p>{repoInfo.description}</p>
              <div className="flex items-center gap-4 text-zinc-500">
                <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repoInfo.stars}</span>
                <span className="flex items-center gap-1"><CircleDot className="h-3 w-3" />{repoInfo.openIssues} open issues</span>
              </div>
            </div>
          )}
          {!repoInfo && !repoInfoError && <p className="text-xs text-zinc-600">No lookup performed yet.</p>}
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white">Recent Workflow Runs</h2>
            <button
              onClick={handleRefreshRuns}
              disabled={runsLoading || !owner || !repo}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/80 transition-all disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${runsLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          {runsError && <p className="text-xs text-red-400">{runsError}</p>}
          {workflowRuns.length > 0 && (
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {workflowRuns.map((run) => (
                <div key={run.id} className="flex items-center justify-between text-xs text-zinc-400">
                  <span>#{run.id} ({run.event})</span>
                  <span className="text-zinc-300">{run.status} / {run.conclusion}</span>
                </div>
              ))}
            </div>
          )}
          {workflowRuns.length === 0 && !runsError && <p className="text-xs text-zinc-600">No runs fetched yet.</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2 text-xs text-white"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/80">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <RefreshCw className="h-8 w-8 animate-spin text-zinc-600 mb-3" />
              <p className="text-xs tracking-wider">Loading template catalog...</p>
            </div>
          ) : (
            <table className="w-full min-w-[850px] text-sm text-left">
              <thead>
                <tr className="bg-zinc-950/80 text-left text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <th className="px-5 py-4 font-medium w-64">Name</th>
                  <th className="px-5 py-4 font-medium w-48">Category</th>
                  <th className="px-5 py-4 font-medium w-28">Cron</th>
                  <th className="px-5 py-4 font-medium text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((t) => {
                  const result = rowResults[t.id];
                  return (
                    <tr key={t.id} className="hover:bg-zinc-900/20 transition-all duration-300 border-b border-zinc-900 text-zinc-300">
                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-zinc-200">{t.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{t.description}</p>
                        {result && (
                          <p className={`text-[10px] mt-1 ${result.ok ? "text-emerald-400" : "text-red-400"}`}>
                            {result.kind === "deploy" ? "Deploy: " : "Trigger: "}{result.message}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-zinc-400">{t.category}</td>
                      <td className="px-5 py-4 text-xs font-mono text-zinc-500">{t.cronExpression}</td>
                      <td className="px-5 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setYamlTemplate(t)}
                            className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:text-white transition-all text-zinc-400 cursor-pointer"
                            title="View YAML"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeploy(t)}
                            disabled={busyId === t.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/20 text-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/50 hover:border-indigo-500/40 text-[10px] uppercase font-semibold tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-40"
                          >
                            {busyId === t.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
                            Deploy
                          </button>
                          <button
                            onClick={() => handleTrigger(t)}
                            disabled={busyId === t.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 hover:border-emerald-500/40 text-[10px] uppercase font-semibold tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-40"
                          >
                            {busyId === t.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                            Trigger
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTemplates.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center text-zinc-500 text-xs">
                      No templates match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {yamlTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={() => setYamlTemplate(null)} />

          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/90 text-white animate-scaleIn">
            <button
              onClick={() => setYamlTemplate(null)}
              className="absolute right-5 top-5 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-light tracking-tight mb-4">{yamlTemplate.name}</h2>
            <pre className="max-h-[60vh] overflow-auto rounded-lg bg-zinc-950/90 border border-zinc-900 p-4 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap">
              {yamlTemplate.yamlContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
