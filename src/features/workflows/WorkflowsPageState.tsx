import React, { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { workflowsActions } from "./workflowsSlice";
import { Workflow } from "@/app/workflows/api-client";

export function useWorkflowsPageState() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.workflows.items.data) ?? [];
  const loading = useAppSelector((s) => s.workflows.items.status === "loading");
  const error = useAppSelector((s) => s.workflows.items.error);
  const success = useAppSelector((s) => s.workflows.items.lastAction);

  const runs = useAppSelector((s) => s.workflows.runs.data) ?? [];
  const runsLoading = useAppSelector((s) => s.workflows.runs.status === "loading");
  const triggerSuccess = useAppSelector((s) => s.workflows.runs.lastAction);
  const runsError = useAppSelector((s) => s.workflows.runs.error);

  const workflowsUi = useAppSelector((s) => s.workflows.items.ui);

  const { searchQuery = "", isModalOpen = false, modalMode = "create", editingId = null, formFields = {} } = workflowsUi;
  const { orgId = "1", name = "", status = "active", isRunsModalOpen = false, runsWorkflow = null } = formFields;

  const query = searchQuery;

  const openCreateModal = useCallback(() => {
    dispatch(workflowsActions.openModal({
      mode: "create",
      initialFields: { orgId: "1", name: "", status: "active" }
    }));
  }, [dispatch]);

  const openEditModal = useCallback((item: Workflow) => {
    dispatch(workflowsActions.openModal({
      mode: "edit",
      editingId: item.id,
      initialFields: { orgId: "1", name: item.name, status: item.status }
    }));
  }, [dispatch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<Workflow, "id"> = { name, status, config: {} };

    if (modalMode === "create") {
      dispatch(workflowsActions.createRequest(payload));
    } else if (modalMode === "edit" && editingId !== null) {
      dispatch(workflowsActions.updateRequest({ id: editingId, data: payload }));
    }
  }, [dispatch, name, status, modalMode, editingId]);

  const handleDelete = useCallback((id: number) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    dispatch(workflowsActions.deleteRequest(id));
  }, [dispatch]);

  const openRunsModal = useCallback((workflow: Workflow) => {
    dispatch(workflowsActions.setFormField({ field: "runsWorkflow", value: workflow }));
    dispatch(workflowsActions.setFormField({ field: "isRunsModalOpen", value: true }));
  }, [dispatch]);

  const handleTriggerRun = useCallback((workflowId: number) => {
    dispatch(workflowsActions.triggerRequest(workflowId));
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.status.toLowerCase().includes(q) || item.id.toString().includes(q);
    });
  }, [items, searchQuery]);

  useEffect(() => {
    dispatch(workflowsActions.fetchRequest());
  }, [dispatch]);

  return {
    dispatch,
    items,
    loading,
    error,
    success,
    runs,
    runsLoading,
    triggerSuccess,
    runsError,
    workflowsUi,
    searchQuery,
    isModalOpen,
    modalMode,
    editingId,
    orgId,
    name,
    status,
    isRunsModalOpen,
    runsWorkflow,
    query,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    openRunsModal,
    handleTriggerRun,
    filteredItems,
  };
}
