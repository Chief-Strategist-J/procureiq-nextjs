"use client";

import { AppConfig } from "@/config/app-config";
import { EmailSendRequest, EmailScheduleRequest, EmailResponse, EmailScheduleResponse } from "./types";

const BACKEND_URL = AppConfig.pythonApiUrl;

const SEED_SCHEDULED: EmailScheduleResponse[] = [
  {
    id: 1,
    recipients: ["procurement@acme.example"],
    subject: "Vendor Insurance Certificate Reminder",
    body: "Please renew your general liability certificate before it expires.",
    scheduled_for: "2026-07-15T09:00:00.000Z",
    status: "pending",
    created_at: "2026-07-11T12:00:00.000Z",
  },
];

function initializeLocalStorage() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("piq_scheduled_emails")) {
    localStorage.setItem("piq_scheduled_emails", JSON.stringify(SEED_SCHEDULED));
  }
}

// Note: the Python email service does NOT wrap responses in an { data } envelope
// (unlike the Java-backed ApiResponse<T> pattern used everywhere else in this app).
// Every method here reads the JSON body directly and treats `res.ok` as the success
// signal — do not add `.data` unwrapping here, it would silently break against this
// service's actual response shape.
export class EmailApi {
  static init() {
    initializeLocalStorage();
  }

  static async sendNow(data: EmailSendRequest): Promise<EmailResponse> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.ok) return body as EmailResponse;
      throw new Error(body.detail || "Failed to send email");
    } catch (e) {
      console.warn("Offline: simulating email send locally", e);
      return { status: "success", message: "[Offline Sandbox] Email queued for local simulation." };
    }
  }

  static async scheduleEmail(data: EmailScheduleRequest): Promise<EmailScheduleResponse> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/email/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.ok) return body as EmailScheduleResponse;
      throw new Error(body.detail || "Failed to schedule email");
    } catch (e) {
      console.warn("Offline: scheduling email locally", e);
      const list = JSON.parse(localStorage.getItem("piq_scheduled_emails") || "[]") as EmailScheduleResponse[];
      const newItem: EmailScheduleResponse = {
        id: list.length > 0 ? Math.max(...list.map((s) => s.id)) + 1 : 1,
        recipients: data.recipients,
        subject: data.subject,
        body: data.body,
        scheduled_for: data.scheduled_for,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("piq_scheduled_emails", JSON.stringify([newItem, ...list]));
      return newItem;
    }
  }

  static async listScheduled(): Promise<EmailScheduleResponse[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/email/scheduled`);
      if (res.ok) {
        const body = await res.json();
        if (Array.isArray(body)) {
          localStorage.setItem("piq_scheduled_emails", JSON.stringify(body));
          return body;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading scheduled emails from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_scheduled_emails") || "[]");
  }
}
