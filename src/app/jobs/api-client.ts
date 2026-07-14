"use client";

import { AppConfig } from "@/config/app-config";
import { Job, JobRun } from "./types";

const BACKEND_URL = AppConfig.apiUrl;

const SEED_JOBS: Job[] = [
  { id: 1, orgId: 1, name: "Nightly Vendor Sync", status: "active", config: { cron: "0 2 * * *" } },
  { id: 2, orgId: 1, name: "Contract Expiry Sweep", status: "paused", config: {} },
];

const SEED_RUNS: Record<number, JobRun[]> = {
  1: [
    { id: 1, jobId: 1, status: "success", startedAt: "2026-07-10T02:00:00.000Z", completedAt: "2026-07-10T02:03:12.000Z", createdAt: "2026-07-10T02:00:00.000Z" },
  ],
};

function initializeLocalStorage() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("piq_jobs")) {
    localStorage.setItem("piq_jobs", JSON.stringify(SEED_JOBS));
  }
  if (!localStorage.getItem("piq_job_runs")) {
    localStorage.setItem("piq_job_runs", JSON.stringify(SEED_RUNS));
  }
}

export class JobsApi {
  static init() {
    initializeLocalStorage();
  }

  static async listJobs(): Promise<Job[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/jobs`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_jobs", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading jobs from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_jobs") || "[]");
  }

  static async createJob(data: Omit<Job, "id">): Promise<Job> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create job failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving job locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_jobs") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((j: Job) => j.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_jobs", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateJob(id: number, data: Omit<Job, "id">): Promise<Job> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend update job failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: updating job locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_jobs") || "[]") as Job[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_jobs", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteJob(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Backend delete job failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: deleting job locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_jobs") || "[]") as Job[];
    localStorage.setItem("piq_jobs", JSON.stringify(list.filter((j) => j.id !== id)));
  }

  static async listRuns(jobId: number): Promise<JobRun[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/jobs/${jobId}/runs`);
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body.data)) {
          const runsMap = JSON.parse(localStorage.getItem("piq_job_runs") || "{}");
          runsMap[jobId] = body.data;
          localStorage.setItem("piq_job_runs", JSON.stringify(runsMap));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading job runs from local database.", e);
    }
    const runsMap = JSON.parse(localStorage.getItem("piq_job_runs") || "{}");
    return runsMap[jobId] || [];
  }

  static async triggerRun(jobId: number): Promise<JobRun> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/jobs/${jobId}/runs`, { method: "POST" });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend trigger job run failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: triggering job run locally", e);
    }
    const runsMap = JSON.parse(localStorage.getItem("piq_job_runs") || "{}");
    const existing: JobRun[] = runsMap[jobId] || [];
    const newRun: JobRun = {
      id: existing.length > 0 ? Math.max(...existing.map((r) => r.id)) + 1 : 1,
      jobId,
      status: "running",
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    runsMap[jobId] = [newRun, ...existing];
    localStorage.setItem("piq_job_runs", JSON.stringify(runsMap));
    return newRun;
  }
}
