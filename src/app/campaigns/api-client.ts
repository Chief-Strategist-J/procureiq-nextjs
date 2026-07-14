"use client";

import { AppConfig } from "@/config/app-config";
import { Campaign, Recipient, CampaignSchedule } from "./types";

const BACKEND_URL = AppConfig.apiUrl;

const SEED_CAMPAIGNS: Campaign[] = [
  { id: 1, orgId: 1, name: "Q3 Vendor Renewal Outreach", status: "active" },
  { id: 2, orgId: 1, name: "New Supplier Onboarding Drip", status: "draft" },
];

const SEED_RECIPIENTS: Recipient[] = [
  { id: 1, accountId: 1, name: "Acme Corp Procurement", email: "procurement@acme.example", phone: "+15550101" },
  { id: 2, accountId: 1, name: "Globex Supply Chain", email: "supply@globex.example" },
];

const SEED_SCHEDULES: CampaignSchedule[] = [
  { id: 1, orgId: 1, campaignId: 1, contactId: 1, scheduledAt: "2026-07-15T09:00:00.000Z", status: "pending" },
];

function initializeLocalStorage() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("piq_campaigns")) {
    localStorage.setItem("piq_campaigns", JSON.stringify(SEED_CAMPAIGNS));
  }
  if (!localStorage.getItem("piq_recipients")) {
    localStorage.setItem("piq_recipients", JSON.stringify(SEED_RECIPIENTS));
  }
  if (!localStorage.getItem("piq_campaign_schedules")) {
    localStorage.setItem("piq_campaign_schedules", JSON.stringify(SEED_SCHEDULES));
  }
}

export class CampaignsApi {
  static init() {
    initializeLocalStorage();
  }

  // --- CAMPAIGNS ---
  static async listCampaigns(): Promise<Campaign[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_campaigns", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading campaigns from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_campaigns") || "[]");
  }

  static async createCampaign(data: Omit<Campaign, "id">): Promise<Campaign> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create campaign failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving campaign locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_campaigns") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((c: Campaign) => c.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_campaigns", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateCampaign(id: number, data: Omit<Campaign, "id">): Promise<Campaign> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend update campaign failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: updating campaign locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_campaigns") || "[]") as Campaign[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_campaigns", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteCampaign(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Backend delete campaign failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: deleting campaign locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_campaigns") || "[]") as Campaign[];
    localStorage.setItem("piq_campaigns", JSON.stringify(list.filter((c) => c.id !== id)));
  }

  // --- RECIPIENTS ---
  static async listRecipients(): Promise<Recipient[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/recipients`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_recipients", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading recipients from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_recipients") || "[]");
  }

  static async createRecipient(data: Omit<Recipient, "id">): Promise<Recipient> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/recipients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create recipient failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving recipient locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_recipients") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((r: Recipient) => r.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_recipients", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateRecipient(id: number, data: Omit<Recipient, "id">): Promise<Recipient> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/recipients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend update recipient failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: updating recipient locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_recipients") || "[]") as Recipient[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_recipients", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteRecipient(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/recipients/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Backend delete recipient failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: deleting recipient locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_recipients") || "[]") as Recipient[];
    localStorage.setItem("piq_recipients", JSON.stringify(list.filter((r) => r.id !== id)));
  }

  // --- CAMPAIGN SCHEDULES ---
  static async listSchedules(): Promise<CampaignSchedule[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/schedules`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_campaign_schedules", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading campaign schedules from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_campaign_schedules") || "[]");
  }

  static async createSchedule(data: Omit<CampaignSchedule, "id">): Promise<CampaignSchedule> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create schedule failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving schedule locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_campaign_schedules") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((s: CampaignSchedule) => s.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_campaign_schedules", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateSchedule(id: number, data: Omit<CampaignSchedule, "id">): Promise<CampaignSchedule> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/schedules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend update schedule failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: updating schedule locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_campaign_schedules") || "[]") as CampaignSchedule[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_campaign_schedules", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteSchedule(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/campaigns/schedules/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Backend delete schedule failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: deleting schedule locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_campaign_schedules") || "[]") as CampaignSchedule[];
    localStorage.setItem("piq_campaign_schedules", JSON.stringify(list.filter((s) => s.id !== id)));
  }
}
