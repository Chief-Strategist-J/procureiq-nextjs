"use client";

import { ActionTemplate, RepoInfo, WorkflowRun, CreateWorkflowResult } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Small illustrative sample only (not all 50) — the real catalog is seeded server-side
// via database/seeds/0003_github_action_templates.sql, matching how other features in
// this app keep their offline localStorage fallback to a handful of seed rows.
const SEED_TEMPLATES: ActionTemplate[] = [
  {
    id: 1,
    name: "Lint & Static Analysis Sweep",
    category: "Code Quality & Review",
    description: "Run linters and static analysis across active branches",
    cronExpression: "15 7 * * *",
    eventType: "lint_static_analysis_sweep.requested",
    yamlContent: "name: \"[Daily] Lint & Static Analysis Sweep\"\non:\n  workflow_dispatch:\n",
  },
  {
    id: 2,
    name: "Secret & Credential Scan",
    category: "Security & Compliance",
    description: "Scan repositories for committed secrets or credentials",
    cronExpression: "0 9 * * *",
    eventType: "secret_credential_scan.requested",
    yamlContent: "name: \"[Daily] Secret & Credential Scan\"\non:\n  workflow_dispatch:\n",
  },
];

function initializeLocalStorage() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("piq_github_templates")) {
    localStorage.setItem("piq_github_templates", JSON.stringify(SEED_TEMPLATES));
  }
}

export class GitHubApi {
  static init() {
    initializeLocalStorage();
  }

  static async listTemplates(): Promise<ActionTemplate[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/github/templates`);
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body.data)) {
          localStorage.setItem("piq_github_templates", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading GitHub Action templates from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_github_templates") || "[]");
  }

  static async getRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
    const params = new URLSearchParams({ owner, repo });
    const res = await fetch(`${BACKEND_URL}/api/v1/github/repo-info?${params.toString()}`);
    const body = await res.json();
    if (!res.ok || !body.data) {
      throw new Error(body.error?.message || "Failed to fetch repository info");
    }
    return body.data;
  }

  static async listWorkflowRuns(owner: string, repo: string): Promise<WorkflowRun[]> {
    const params = new URLSearchParams({ owner, repo });
    const res = await fetch(`${BACKEND_URL}/api/v1/github/workflow-runs?${params.toString()}`);
    const body = await res.json();
    if (!res.ok || !Array.isArray(body.data)) {
      throw new Error(body.error?.message || "Failed to fetch workflow runs");
    }
    return body.data;
  }

  static async dispatch(owner: string, repo: string, eventType: string, clientPayload: Record<string, unknown> = {}): Promise<string> {
    const res = await fetch(`${BACKEND_URL}/api/v1/github/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repo, eventType, clientPayload }),
    });
    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error?.message || "Failed to trigger repository dispatch");
    }
    return body.data;
  }

  static async deployTemplate(
    owner: string,
    repo: string,
    template: ActionTemplate,
    commitMessage?: string
  ): Promise<CreateWorkflowResult> {
    const workflowName = `daily-${template.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
    const res = await fetch(`${BACKEND_URL}/api/v1/github/create-workflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner,
        repo,
        workflowName,
        yamlContent: template.yamlContent,
        commitMessage,
      }),
    });
    const body = await res.json();
    if (!res.ok || !body.data) {
      throw new Error(body.error?.message || "Failed to deploy workflow");
    }
    return body.data;
  }
}
