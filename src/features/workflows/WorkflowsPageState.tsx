import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { workflowsActions } from "./workflowsSlice";
import { Workflow } from "@/app/workflows/api-client";

export class WorkflowsPageState {
  constructor(
    public dispatch: ReturnType<typeof useAppDispatch>,
    public items: any[],
    public loading: boolean,
    public error: any,
    public success: any,
    public runs: any[],
    public runsLoading: boolean,
    public triggerSuccess: any,
    public runsError: any,
    public workflowsUi: any
  ) {}

  get query() {
    return this.workflowsUi.searchQuery;
  }

  get isModalOpen() {
    return this.workflowsUi.isModalOpen;
  }

  get modalMode() {
    return this.workflowsUi.modalMode;
  }

  get editingId() {
    return this.workflowsUi.editingId;
  }

  get orgId() {
    return this.workflowsUi.formFields.orgId ?? "1";
  }

  get name() {
    return this.workflowsUi.formFields.name ?? "";
  }

  get status() {
    return this.workflowsUi.formFields.status ?? "active";
  }

  get isRunsModalOpen() {
    return !!this.workflowsUi.formFields.isRunsModalOpen;
  }

  get runsWorkflow(): Workflow | null {
    return this.workflowsUi.formFields.runsWorkflow ?? null;
  }

  openCreateModal = () => {
    this.dispatch(workflowsActions.openModal({
      mode: "create",
      initialFields: { orgId: "1", name: "", status: "active" }
    }));
  };

  openEditModal = (item: Workflow) => {
    this.dispatch(workflowsActions.openModal({
      mode: "edit",
      editingId: item.id,
      initialFields: { orgId: "1", name: item.name, status: item.status }
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.name.trim()) return;

    const payload: Omit<Workflow, "id"> = { name: this.name, status: this.status, config: {} };

    if (this.modalMode === "create") {
      this.dispatch(workflowsActions.createRequest(payload));
    } else if (this.modalMode === "edit" && this.editingId !== null) {
      this.dispatch(workflowsActions.updateRequest({ id: this.editingId, data: payload }));
    }
  };

  handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    this.dispatch(workflowsActions.deleteRequest(id));
  };

  openRunsModal = (workflow: Workflow) => {
    this.dispatch(workflowsActions.setFormField({ field: "runsWorkflow", value: workflow }));
    this.dispatch(workflowsActions.setFormField({ field: "isRunsModalOpen", value: true }));
  };

  handleTriggerRun = (workflowId: number) => {
    this.dispatch(workflowsActions.triggerRequest(workflowId));
  };

  get filteredItems() {
    return this.items.filter((item) => {
      if (!this.query) return true;
      const q = this.query.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.status.toLowerCase().includes(q) || item.id.toString().includes(q);
    });
  }
}

export function useWorkflowsPageState() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.workflows.items.data);
  const loading = useAppSelector((s) => s.workflows.items.status === "loading");
  const error = useAppSelector((s) => s.workflows.items.error);
  const success = useAppSelector((s) => s.workflows.items.lastAction);

  const runs = useAppSelector((s) => s.workflows.runs.data);
  const runsLoading = useAppSelector((s) => s.workflows.runs.status === "loading");
  const triggerSuccess = useAppSelector((s) => s.workflows.runs.lastAction);
  const runsError = useAppSelector((s) => s.workflows.runs.error);

  const workflowsUi = useAppSelector((s) => s.workflows.items.ui);

  useEffect(() => {
    dispatch(workflowsActions.fetchRequest());
  }, [dispatch]);

  return new WorkflowsPageState(
    dispatch,
    items,
    loading,
    error,
    success,
    runs,
    runsLoading,
    triggerSuccess,
    runsError,
    workflowsUi
  );
}
