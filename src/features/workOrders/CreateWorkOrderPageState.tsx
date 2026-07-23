import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { workOrdersActions } from "./workOrdersSlice";
import { WorkOrder } from "@/app/work-orders/api-client";

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

    const parsedCaseId = parseInt(caseId, 10);
    const parsedContactId = parseInt(contactId, 10);
    const parsedAssetId = parseInt(assetId, 10);
    const parsedWorkTypeId = parseInt(workTypeId, 10);

    const payload: Omit<WorkOrder, "id"> = {
      status,
      priority,
      ...(caseId && !Number.isNaN(parsedCaseId) ? { caseId: parsedCaseId } : {}),
      ...(contactId && !Number.isNaN(parsedContactId) ? { contactId: parsedContactId } : {}),
      ...(assetId && !Number.isNaN(parsedAssetId) ? { assetId: parsedAssetId } : {}),
      ...(workTypeId && !Number.isNaN(parsedWorkTypeId) ? { workTypeId: parsedWorkTypeId } : {}),
    };

    dispatch(workOrdersActions.createRequest(payload));
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
