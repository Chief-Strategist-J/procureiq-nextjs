  "use client";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { AppConfig } from "@/config/app-config";
import { EmailSendRequest, EmailScheduleRequest, EmailResponse, EmailScheduleResponse } from "./types";
import { fetchWithFallback, mutateWithFallback } from "@/shared/utils/fallbackClient";
import { request } from "http";

const BACKEND_URL = AppConfig.pythonApiUrl;

export class EmailApi {
  static init() {
    if (typeof window !== "undefined" && !localStorage.getItem("piq_scheduled_emails")) {
      localStorage.setItem("piq_scheduled_emails", JSON.stringify([
        {
          id: 1,
          recipients: ["procurement@acme.example"],
          subject: "Vendor Insurance Certificate Reminder",
          body: "Please renew your general liability certificate before it expires.",
          scheduled_for: "2026-07-15T09:00:00.000Z",
          status: "pending",
          created_at: "2026-07-11T12:00:00.000Z",
        }
      ]));
    }
  }

  static async sendNow(data: EmailSendRequest): Promise<EmailResponse> {
    const url = `${BACKEND_URL}${API_ENDPOINTS.email.send}`;
    try {
      const result = await request<EmailResponse>(url, { method: "POST", body: JSON.stringify(data) }, "send email");
      return result;
    } catch (e) {
      console.warn("Offline: simulating email send locally", e);
      return { status: "success", message: "[Offline Sandbox] Email queued for local simulation." };
    }
  }

  static async scheduleEmail(data: EmailScheduleRequest): Promise<EmailScheduleResponse> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.email.schedule}`;
    return mutateWithFallback<EmailScheduleResponse>(url, { method: "POST", body: JSON.stringify(data) }, "piq_scheduled_emails", "schedule email", (list) => {
      const newItem: EmailScheduleResponse = {
        id: list.length > 0 ? Math.max(...list.map((s: any) => s.id)) + 1 : 1,
        recipients: data.recipients,
        subject: data.subject,
        body: data.body,
        scheduled_for: data.scheduled_for,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      return { updatedList: [newItem, ...list], returnVal: newItem };
    }, true);
  }

  static async listScheduled(): Promise<EmailScheduleResponse[]> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.email.scheduled}`;
    return fetchWithFallback<EmailScheduleResponse[]>(url, { method: "GET" }, "piq_scheduled_emails", "list scheduled emails", () =>
      JSON.parse(localStorage.getItem("piq_scheduled_emails") || "[]")
    , true);
  }
}
