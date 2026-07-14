"use client";

import { AppConfig } from "@/config/app-config";
import {
  OperatingHours,
  ServiceTerritory,
  ServiceResource,
  ServiceAppointment,
  AssignedResourceResponse
} from "./types";

const BACKEND_URL = AppConfig.apiUrl;

// Seeds for local storage mock fallback
const SEED_OPERATING_HOURS: OperatingHours[] = [
  { id: 1, name: "HQ East Coast Standard Shift", timezone: "America/New_York" },
  { id: 2, name: "West Coast Field Dispatch", timezone: "America/Los_Angeles" },
  { id: 3, name: "EMEA Regional Support Hours", timezone: "Europe/London" },
];

const SEED_TERRITORIES: ServiceTerritory[] = [
  { id: 1, name: "Northeast Operations Hub", operatingHoursId: 1, isActive: true },
  { id: 2, name: "Pacific Northwest Sector", operatingHoursId: 2, isActive: true },
  { id: 3, name: "London Greater Metro", operatingHoursId: 3, isActive: false },
];

const SEED_RESOURCES: ServiceResource[] = [
  { id: 1, name: "Marcus Vance (Lead Technician)", resourceType: "technician", isActive: true },
  { id: 2, name: "Sarah Connor (HVAC Specialist)", resourceType: "technician", isActive: true },
  { id: 3, name: "FSL Dispatch Crew Alpha", resourceType: "crew", isActive: true },
];

const SEED_APPOINTMENTS: ServiceAppointment[] = [
  {
    id: 1,
    parentId: 1001,
    parentType: "work_order",
    status: "new",
    earliestStartPermitted: "2026-07-11T08:00:00.000Z",
    dueDate: "2026-07-18T17:00:00.000Z",
    duration: 2.5,
  },
  {
    id: 2,
    parentId: 1002,
    parentType: "work_order",
    status: "scheduled",
    earliestStartPermitted: "2026-07-12T09:00:00.000Z",
    dueDate: "2026-07-19T18:00:00.000Z",
    scheduledStart: "2026-07-12T10:00:00.000Z",
    scheduledEnd: "2026-07-12T12:30:00.000Z",
    duration: 2.5,
    assignedResourceId: 1,
  },
];

// Helper to initialize LocalStorage if empty
function initializeLocalStorage() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("piq_operating_hours")) {
    localStorage.setItem("piq_operating_hours", JSON.stringify(SEED_OPERATING_HOURS));
  }
  if (!localStorage.getItem("piq_territories")) {
    localStorage.setItem("piq_territories", JSON.stringify(SEED_TERRITORIES));
  }
  if (!localStorage.getItem("piq_resources")) {
    localStorage.setItem("piq_resources", JSON.stringify(SEED_RESOURCES));
  }
  if (!localStorage.getItem("piq_appointments")) {
    localStorage.setItem("piq_appointments", JSON.stringify(SEED_APPOINTMENTS));
  }
}

export class FieldServiceApi {
  static init() {
    initializeLocalStorage();
  }

  // --- OPERATING HOURS ---
  static async listOperatingHours(): Promise<OperatingHours[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/operating-hours`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_operating_hours", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading operating hours from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_operating_hours") || "[]");
  }

  static async createOperatingHours(data: Omit<OperatingHours, "id">): Promise<OperatingHours> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/operating-hours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create operating hours failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving operating hours locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_operating_hours") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((o: any) => o.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_operating_hours", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateOperatingHours(id: number, data: Omit<OperatingHours, "id">): Promise<OperatingHours> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/operating-hours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend update operating hours failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: updating operating hours locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_operating_hours") || "[]") as OperatingHours[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_operating_hours", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteOperatingHours(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/operating-hours/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Backend delete operating hours failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: deleting operating hours locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_operating_hours") || "[]") as OperatingHours[];
    localStorage.setItem("piq_operating_hours", JSON.stringify(list.filter((o) => o.id !== id)));
  }

  // --- TERRITORIES ---
  static async listTerritories(): Promise<ServiceTerritory[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/territories`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_territories", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading territories from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_territories") || "[]");
  }

  static async createTerritory(data: Omit<ServiceTerritory, "id">): Promise<ServiceTerritory> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/territories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create territory failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving territory locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_territories") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((t: any) => t.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_territories", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateTerritory(id: number, data: Omit<ServiceTerritory, "id">): Promise<ServiceTerritory> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/territories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend update territory failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: updating territory locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_territories") || "[]") as ServiceTerritory[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_territories", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteTerritory(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/territories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Backend delete territory failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: deleting territory locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_territories") || "[]") as ServiceTerritory[];
    localStorage.setItem("piq_territories", JSON.stringify(list.filter((t) => t.id !== id)));
  }

  // --- RESOURCES ---
  static async listResources(): Promise<ServiceResource[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/resources`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_resources", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading resources from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_resources") || "[]");
  }

  static async createResource(data: Omit<ServiceResource, "id">): Promise<ServiceResource> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create resource failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving resource locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_resources") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((r: any) => r.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_resources", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateResource(id: number, data: Omit<ServiceResource, "id">): Promise<ServiceResource> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        const errText = await res.text();
        console.warn("Backend update resource returned error, falling back locally:", errText);
      }
    } catch (e) {
      console.warn("Offline: updating resource locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_resources") || "[]") as ServiceResource[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_resources", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteResource(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/resources/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errText = await res.text();
        console.warn("Backend delete resource returned error, falling back locally:", errText);
      }
    } catch (e) {
      console.warn("Offline: deleting resource locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_resources") || "[]") as ServiceResource[];
    localStorage.setItem("piq_resources", JSON.stringify(list.filter((r) => r.id !== id)));
  }

  // --- APPOINTMENTS & FSL matching ---
  static async listAppointments(): Promise<ServiceAppointment[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/appointments`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          localStorage.setItem("piq_appointments", JSON.stringify(body.data));
          return body.data;
        }
      }
    } catch (e) {
      console.warn("Backend offline, loading appointments from local database.", e);
    }
    return JSON.parse(localStorage.getItem("piq_appointments") || "[]");
  }

  static async createAppointment(data: Omit<ServiceAppointment, "id">): Promise<ServiceAppointment> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend create appointment failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: saving appointment locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_appointments") || "[]");
    const newItem = { id: list.length > 0 ? Math.max(...list.map((a: any) => a.id)) + 1 : 1, ...data };
    localStorage.setItem("piq_appointments", JSON.stringify([...list, newItem]));
    return newItem;
  }

  static async updateAppointment(id: number, data: Omit<ServiceAppointment, "id">): Promise<ServiceAppointment> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        console.warn("Backend update appointment failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: updating appointment locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_appointments") || "[]") as ServiceAppointment[];
    const updated = list.map((item) => (item.id === id ? { ...item, ...data } : item));
    localStorage.setItem("piq_appointments", JSON.stringify(updated));
    return { id, ...data };
  }

  static async deleteAppointment(id: number): Promise<void> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn("Backend delete appointment failed, falling back locally.");
      }
    } catch (e) {
      console.warn("Offline: deleting appointment locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_appointments") || "[]") as ServiceAppointment[];
    localStorage.setItem("piq_appointments", JSON.stringify(list.filter((a) => a.id !== id)));
  }

  static async getCandidates(appointmentId: number): Promise<ServiceResource[]> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/appointments/${appointmentId}/candidates`);
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        const errText = await res.text();
        console.warn("Backend candidates check failed, falling back to mock:", errText);
      }
    } catch (e) {
      console.warn("Offline: computing candidates via local algorithm match", e);
    }
    // Sandbox Match algorithm: filter for active service resources
    const resources = JSON.parse(localStorage.getItem("piq_resources") || "[]") as ServiceResource[];
    return resources.filter((r) => r.isActive);
  }

  static async assignResource(appointmentId: number, serviceResourceId: number): Promise<AssignedResourceResponse> {
    this.init();
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/fieldservice/appointments/${appointmentId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceResourceId }),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.data) return body.data;
      } else {
        const errText = await res.text();
        console.warn("Backend returned error status, falling back to local assignment:", errText);
      }
    } catch (e) {
      console.warn("Offline: assigning resource locally", e);
    }
    const list = JSON.parse(localStorage.getItem("piq_appointments") || "[]") as ServiceAppointment[];
    const updated = list.map((item) =>
      item.id === appointmentId ? { ...item, status: "assigned", assignedResourceId: serviceResourceId } : item
    );
    localStorage.setItem("piq_appointments", JSON.stringify(updated));

    return {
      id: Math.floor(Math.random() * 1000) + 1,
      serviceAppointmentId: appointmentId,
      serviceResourceId,
    };
  }

  static async deleteAssignment(appointmentId: number): Promise<void> {
    this.init();
    // In our simplified mock schema, we set status back to scheduled/new and assignedResourceId undefined
    const list = JSON.parse(localStorage.getItem("piq_appointments") || "[]") as ServiceAppointment[];
    const updated = list.map((item) =>
      item.id === appointmentId ? { ...item, status: "scheduled", assignedResourceId: undefined } : item
    );
    localStorage.setItem("piq_appointments", JSON.stringify(updated));
  }
}
