"use client";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { AppConfig } from "@/config/app-config";
import {
  OperatingHours,
  ServiceTerritory,
  ServiceResource,
  ServiceAppointment,
  AssignedResourceResponse
} from "./types";
import { fetchWithFallback, mutateWithFallback } from "@/shared/utils/fallbackClient";
import { request } from "@/shared/utils/apiClient";

const BACKEND_URL = AppConfig.apiUrl;

export class FieldServiceApi {
  static init() {
    if (typeof window !== "undefined" && !localStorage.getItem("piq_appointments")) {
      localStorage.setItem("piq_appointments", JSON.stringify([
        {
          id: 1,
          parentId: 1001,
          parentType: "work_order",
          status: "new",
          earliestStartPermitted: "2026-07-11T08:00:00.000Z",
          dueDate: "2026-07-18T17:00:00.000Z",
          duration: 2.5,
        }
      ]));
    }
  }

  // --- OPERATING HOURS ---
  static async listOperatingHours(): Promise<OperatingHours[]> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.operatingHours.list}`;
    return fetchWithFallback<OperatingHours[]>(url, { method: "GET" }, "piq_operating_hours", "list operating hours", () =>
      JSON.parse(localStorage.getItem("piq_operating_hours") || "[]")
    );
  }

  static async createOperatingHours(data: Omit<OperatingHours, "id">): Promise<OperatingHours> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.operatingHours.create}`;
    return mutateWithFallback<OperatingHours>(url, { method: "POST", body: JSON.stringify(data) }, "piq_operating_hours", "create operating hours", (list) => {
      const newItem = { id: list.length > 0 ? Math.max(...list.map((o: any) => o.id)) + 1 : 1, ...data };
      return { updatedList: [...list, newItem], returnVal: newItem };
    });
  }

  // --- TERRITORIES ---
  static async listTerritories(): Promise<ServiceTerritory[]> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.territories.list}`;
    return fetchWithFallback<ServiceTerritory[]>(url, { method: "GET" }, "piq_territories", "list territories", () =>
      JSON.parse(localStorage.getItem("piq_territories") || "[]")
    );
  }

  static async createTerritory(data: Omit<ServiceTerritory, "id">): Promise<ServiceTerritory> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.territories.create}`;
    return mutateWithFallback<ServiceTerritory>(url, { method: "POST", body: JSON.stringify(data) }, "piq_territories", "create territory", (list) => {
      const newItem = { id: list.length > 0 ? Math.max(...list.map((t: any) => t.id)) + 1 : 1, ...data };
      return { updatedList: [...list, newItem], returnVal: newItem };
    });
  }

  // --- RESOURCES ---
  static async listResources(): Promise<ServiceResource[]> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.resources.list}`;
    return fetchWithFallback<ServiceResource[]>(url, { method: "GET" }, "piq_resources", "list resources", () =>
      JSON.parse(localStorage.getItem("piq_resources") || "[]")
    );
  }

  static async createResource(data: Omit<ServiceResource, "id">): Promise<ServiceResource> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.resources.create}`;
    return mutateWithFallback<ServiceResource>(url, { method: "POST", body: JSON.stringify(data) }, "piq_resources", "create resource", (list) => {
      const newItem = { id: list.length > 0 ? Math.max(...list.map((r: any) => r.id)) + 1 : 1, ...data };
      return { updatedList: [...list, newItem], returnVal: newItem };
    });
  }

  // --- APPOINTMENTS ---
  static async listAppointments(): Promise<ServiceAppointment[]> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.appointments.list}`;
    return fetchWithFallback<ServiceAppointment[]>(url, { method: "GET" }, "piq_appointments", "list appointments", () =>
      JSON.parse(localStorage.getItem("piq_appointments") || "[]")
    );
  }

  static async createAppointment(data: Omit<ServiceAppointment, "id">): Promise<ServiceAppointment> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.appointments.create}`;
    return mutateWithFallback<ServiceAppointment>(url, { method: "POST", body: JSON.stringify(data) }, "piq_appointments", "create appointment", (list) => {
      const newItem = { id: list.length > 0 ? Math.max(...list.map((a: any) => a.id)) + 1 : 1, ...data };
      return { updatedList: [...list, newItem], returnVal: newItem };
    });
  }

  static async getCandidates(appointmentId: number): Promise<ServiceResource[]> {
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.appointments.candidates(String(appointmentId))}`;
    return (await request<ServiceResource[]>(url, { method: "GET" }, "get candidates")) || [];
  }

  static async assignResource(appointmentId: number, resourceId: number): Promise<AssignedResourceResponse> {
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.appointments.assign(String(appointmentId))}?resourceId=${resourceId}`;
    return await request<AssignedResourceResponse>(url, { method: "POST" }, "assign resource");
  }
}
