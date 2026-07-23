import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { workOrdersActions } from "./workOrdersSlice";

export function useCreateWorkOrderPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { lastAction, items, ui } = useAppSelector((state) => state.workOrders);

  const { localError = null, successMessage = null, formFields = {} } = ui;
  const { caseId = "", contactId = "", assetId = "", workTypeId = "", status = "new", priority = 2 } = formFields;

  const creating = items.status === 'loading';
  const error = localError;
  const success = successMessage;

  const handleCreateWorkOrder = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const requestPayload: Record<string, any> = {
      status,
      priority,
    };
    if (caseId) {
      const parsed = parseInt(caseId, 10);
      if (!Number.isNaN(parsed)) requestPayload.caseId = parsed;
    }
    if (contactId) {
      const parsed = parseInt(contactId, 10);
      if (!Number.isNaN(parsed)) requestPayload.contactId = parsed;
    }
    if (assetId) {
      const parsed = parseInt(assetId, 10);
      if (!Number.isNaN(parsed)) requestPayload.assetId = parsed;
    }
    if (workTypeId) {
      const parsed = parseInt(workTypeId, 10);
      if (!Number.isNaN(parsed)) requestPayload.workTypeId = parsed;
    }

    dispatch(workOrdersActions.createRequest(requestPayload as any));
  }, [dispatch, status, priority, caseId, contactId, assetId, workTypeId]);

  useEffect(() => {
    if (lastAction?.type === 'create') {
      if (lastAction.status === 'success') {
        dispatch(workOrdersActions.setSuccessMessage("Work order registered successfully!"));
        dispatch(workOrdersActions.setFormFields({ caseId: "", contactId: "", assetId: "", workTypeId: "", status: "new", priority: 2 }));
        
        const timer = setTimeout(() => {
          dispatch(workOrdersActions.resetLastAction());
          router.push("/work-orders");
        }, 1500);
        return () => clearTimeout(timer);
      } else if (lastAction.status === 'error') {
        dispatch(workOrdersActions.setLocalError(lastAction.message || "Failed to create work order"));
      }
    }
  }, [lastAction, router, dispatch]);

  return {
    router,
    dispatch,
    lastAction,
    items,
    ui,
    caseId,
    contactId,
    assetId,
    workTypeId,
    status,
    priority,
    creating,
    error,
    success,
    handleCreateWorkOrder,
  };
}
