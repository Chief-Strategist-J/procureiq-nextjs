"use client";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { AppConfig } from "@/config/app-config";
import { request } from "@/shared/utils/apiClient";

const BACKEND_URL = AppConfig.apiUrl;

export interface DashboardData {
  notifications: any[];
  unreadCount: number;
}

export class DashboardApi {
  static async loadDashboardData(): Promise<DashboardData> {
    let notifications: any[] = [];
    let unreadCount = 0;

    try {
      const url = `${BACKEND_URL}${API_ENDPOINTS.notifications.list}?page=0&size=5`;
      const data = await request<any>(url, {
        method: "GET",
        headers: { "X-User-Id": "1" },
      }, "fetch dashboard notifications");
      if (data && data.content) notifications = data.content;
    } catch (e) {
      console.warn("Failed to load dashboard notifications", e);
    }

    try {
      const url = `${BACKEND_URL}${API_ENDPOINTS.notifications.unreadCount}`;
      const data = await request<any>(url, {
        method: "GET",
        headers: { "X-User-Id": "1" },
      }, "fetch unread count");
      if (data && data.unreadCount !== undefined) unreadCount = data.unreadCount;
    } catch (e) {
      console.warn("Failed to load unread count", e);
    }

    return { notifications, unreadCount };
  }
}
