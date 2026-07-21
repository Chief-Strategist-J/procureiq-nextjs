import { createListSlice } from "@/shared/store/createListSlice";
import { WorkOrder } from "@/app/work-orders/api-client";

export const workOrdersSlice = createListSlice<WorkOrder>("workOrders");

export const workOrdersActions = workOrdersSlice.actions;

export default workOrdersSlice.reducer;
