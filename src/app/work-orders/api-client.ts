"use client";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { AppConfig } from "@/config/app-config";
import { request } from "@/shared/utils/apiClient";
import { fetchWithFallback, mutateWithFallback } from "@/shared/utils/fallbackClient";

const BACKEND_URL = AppConfig.apiUrl;

export interface WorkOrder {
  id: number;
  subject: string;
  status: string;
  priority: string;
  description?: string;
  accountId?: number;
}

export class WorkOrdersApi {
  static init() {
    if (typeof window !== "undefined" && !localStorage.getItem("piq_work_orders")) {
      localStorage.setItem("piq_work_orders", JSON.stringify([]));
    }
  }

  static async listWorkOrders(): Promise<WorkOrder[]> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.workOrders.list}`;
    return fetchWithFallback<WorkOrder[]>(url, { method: "GET" }, "piq_work_orders", "list work orders", () =>
      JSON.parse(localStorage.getItem("piq_work_orders") || "[]")
    );
  }

  static async createWorkOrder(data: Omit<WorkOrder, "id">): Promise<WorkOrder> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.workOrders.create}`;
    return mutateWithFallback<WorkOrder>(url, { method: "POST", body: JSON.stringify(data) }, "piq_work_orders", "create work order", (list) => {
      const newItem = { id: list.length > 0 ? Math.max(...list.map((w: any) => w.id)) + 1 : 1, ...data };
      return { updatedList: [...list, newItem], returnVal: newItem };
    });
  }

  static async updateWorkOrder(id: number, data: Omit<WorkOrder, "id">): Promise<WorkOrder> {
    this.init();
    const url = `${BACKEND_URL}${API_ENDPOINTS.fieldService.workOrders.update(String(id))}`;
    return mutateWithFallback<WorkOrder>(url, { method: "PUT", body: JSON.stringify(data) }, "piq_work_orders", "update work order", (list) => {
      const updated = list.map((item: any) => (item.id === id ? { ...item, ...data } : item));
      return { updatedList: updated, returnVal: { id, ...data } };
    });
  }
}
