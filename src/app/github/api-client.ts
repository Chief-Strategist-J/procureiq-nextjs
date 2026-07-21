"use client";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { AppConfig } from "@/config/app-config";
import { ActionTemplate, RepoInfo, WorkflowRun, CreateWorkflowResult } from "./types";
import { fetchWithFallback } from "@/shared/utils/fallbackClient";
import { request } from "@/shared/utils/apiClient";

const BACKEND_URL = AppConfig.apiUrl;

export class GitHubApi {
  static init() {
    if (typeof window !== "undefined" && !localStorage.getItem("piq_github_templates")) {
      localStorage.setItem("piq_github_templates", JSON.stringify([
        {
          id: 1,
          name: "Lint & Static Analysis Sweep",
          category: "Code Quality & Review",
          description: "Run linters and static analysis across active branches",
          cronExpression: "15 7 * * *",
          eventType: "lint_static_analysis_sweep.requested",
          yamlContent: "name: \"[Daily] Lint & Static Analysis Sweep\"\non:\n  workflow_dispatch:\n",
        }
      ]));
    }
  }

  static async listTemplates(): Promise<ActionTemplate[]> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.github.templates}`;
    return fetchWithFallback<ActionTemplate[]>(url, { method: "GET" }, "piq_github_templates", "list GitHub Action templates", () =>
      JSON.parse(localStorage.getItem("piq_github_templates") || "[]")
    );
  }

  static async getRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
    const params = new URLSearchParams({ owner, repo });
    const url = `${BACKEND_URL}${API_ENDPOINTS.github.repoInfo}?${params.toString()}`;
    return await request<RepoInfo>(url, { method: "GET" }, "fetch repository info");
  }

  static async listWorkflowRuns(owner: string, repo: string): Promise<WorkflowRun[]> {
    const params = new URLSearchParams({ owner, repo });
    const url = `${BACKEND_URL}${API_ENDPOINTS.github.workflowRuns}?${params.toString()}`;
    return (await request<WorkflowRun[]>(url, { method: "GET" }, "fetch workflow runs")) || [];
  }

  static async dispatch(owner: string, repo: string, eventType: string, clientPayload: Record<string, unknown> = {}): Promise<string> {
    const url = `${BACKEND_URL}${API_ENDPOINTS.github.dispatch}`;
    return await request<string>(url, {
      method: "POST",
      body: JSON.stringify({ owner, repo, eventType, clientPayload }),
    }, "trigger repository dispatch");
  }

  static async deployTemplate(
    owner: string,
    repo: string,
    template: ActionTemplate,
    commitMessage?: string
  ): Promise<CreateWorkflowResult> {
    const workflowName = `daily-${template.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
    const url = `${BACKEND_URL}${API_ENDPOINTS.github.createWorkflow}`;
    return await request<CreateWorkflowResult>(url, {
      method: "POST",
      body: JSON.stringify({
        owner,
        repo,
        workflowName,
        yamlContent: template.yamlContent,
        commitMessage,
      }),
    }, "deploy template workflow");
  }
}
