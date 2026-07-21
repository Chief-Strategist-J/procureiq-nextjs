"use client";

import { API_ENDPOINTS } from "@/config/api-endpoints";
import { createResourceApi } from "@/shared/utils/resourceApi";

export interface WorkOrder {
  id: number;
  subject?: string;
  status: string;
  priority: number;
  description?: string;
  accountId?: number;
  parentWorkOrderId?: number;
  caseId?: number;
  entitlementId?: number;
  contactId?: number;
  assetId?: number;
  workTypeId?: number;
  priceBookId?: number;
  createdAt?: string;
}

export const WorkOrdersApi = createResourceApi<WorkOrder>({
  endpoints: API_ENDPOINTS.fieldService.workOrders,
  storageKey: "piq_work_orders",
  label: "work order",
});
