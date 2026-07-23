import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { workOrdersActions } from "./workOrdersSlice";

export class CreateWorkOrderPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public lastAction: any,
    public items: any,
    public ui: any
  ) {}

  get creating() {
    return this.items.status === 'loading';
  }

  get caseId() {
    return this.ui.formFields.caseId ?? "";
  }

  get contactId() {
    return this.ui.formFields.contactId ?? "";
  }

  get assetId() {
    return this.ui.formFields.assetId ?? "";
  }

  get workTypeId() {
    return this.ui.formFields.workTypeId ?? "";
  }

  get status() {
    return this.ui.formFields.status ?? "new";
  }

  get priority() {
    return this.ui.formFields.priority ?? 2;
  }

  get error() {
    return this.ui.localError;
  }

  get success() {
    return this.ui.successMessage;
  }

  handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const requestPayload: Record<string, any> = {
      status: this.status,
      priority: this.priority,
    };
    if (this.caseId) requestPayload.caseId = parseInt(this.caseId);
    if (this.contactId) requestPayload.contactId = parseInt(this.contactId);
    if (this.assetId) requestPayload.assetId = parseInt(this.assetId);
    if (this.workTypeId) requestPayload.workTypeId = parseInt(this.workTypeId);

    this.dispatch(workOrdersActions.createRequest(requestPayload as any));
  };
}

export function useCreateWorkOrderPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { lastAction, items, ui } = useAppSelector((state) => state.workOrders);

  const state = new CreateWorkOrderPageState(
    router,
    dispatch,
    lastAction,
    items,
    ui
  );

  useEffect(() => {
    if (lastAction?.type === 'create') {
      if (lastAction.status === 'success') {
        dispatch(workOrdersActions.setSuccessMessage("Work order registered successfully!"));
        dispatch(workOrdersActions.setFormFields({ caseId: "", contactId: "", assetId: "", workTypeId: "", status: "new", priority: 2 }));
        
        setTimeout(() => {
          dispatch(workOrdersActions.resetLastAction());
          router.push("/work-orders");
        }, 1500);
      } else if (lastAction.status === 'error') {
        dispatch(workOrdersActions.setLocalError(lastAction.message || "Failed to create work order"));
      }
    }
  }, [lastAction, router, dispatch]);

  return state;
}
