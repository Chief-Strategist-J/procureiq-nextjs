"use client";

import { Workflow, WorkflowRun } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const SEED_WORKFLOWS: Workflow[] = [
  { id: 1, orgId: 1, name: "Vendor Onboarding Approval Chain", status: "active" },
  { id: 2, orgId: 1, name: "Contract Renewal Escalation", status: "draft" },
];

const SEED_RUNS: Record<number, WorkflowRun[]> = {
  1: [
    { id: 1, workflowId: 1, status: "success", startedAt: "2026-07-09T09:00:00.000Z", completedAt: "2026-07-09T09:04:45.000Z", createdAt: "2026-07-09T09:00:00.000Z" },
  ],
};

function initializeLocalStorage() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("piq_workflows")) {
    localStorage.setItem("piq_workflows", JSON.stringify(SEED_WORKFLOWS));
  }
  if (!localStorage.getItem("piq_workflow_runs")) {
    localStorage.setItem("piq_workflow_runs", JSON.stringify(SEED_RUNS));
  }
}

export class WorkflowsApi {
  static init() {
    initializeLocalStorage();
  }

  static async listWorkflows(): Promise<Workflow[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_workflows", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading workflows from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_workflows") || "[]");
  }

  static async createWorkflow(data: Omit<Workflow, "id">): Promise<Workflow> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create workflow failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving workflow locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_workflows") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((w: Workflow) => w.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_workflows", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateWorkflow(id: number, data: Omit<Workflow, "id">): Promise<Workflow> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend update workflow failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: updating workflow locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_workflows") || "[]") as Workflow[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_workflows", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteWorkflow(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Backend delete workflow failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: deleting workflow locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_workflows") || "[]") as Workflow[];
    localStorage.setItem("piq_workflows", JSON.stringify(list.filter((w) => w.id !== id)));
  }

  static async listRuns(workflowId: number): Promise<WorkflowRun[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/${workflowId}/runs`);
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body.data)) {
          const runsMap = JSON.parse(localStorage.getItem("piq_workflow_runs") || "{}");
          runsMap[workflowId] = body.data;
          localStorage.setItem("piq_workflow_runs", JSON.stringify(runsMap));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading workflow runs from local database.", e);
    }
    const runsMap = JSON.parse(localStorage.getItem("piq_workflow_runs") || "{}");
    return runsMap[workflowId] || [];
  }

  static async triggerRun(workflowId: number): Promise<WorkflowRun> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows/${workflowId}/runs`, { method: "POST" });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend trigger workflow run failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: triggering workflow run locally", e);
    }
    const runsMap = JSON.parse(localStorage.getItem("piq_workflow_runs") || "{}");
    const existing: WorkflowRun[] = runsMap[workflowId] || [];
    const newRun: WorkflowRun = {
      id: existing.length > 0 ? Math.max(...existing.map((r) => r.id)) + 1 : 1,
      workflowId,
      status: "running",
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    runsMap[workflowId] = [newRun, ...existing];
    localStorage.setItem("piq_workflow_runs", JSON.stringify(runsMap));
    return newRun;
  }
}
