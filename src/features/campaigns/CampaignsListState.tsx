import React, { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import { campaignsActions } from "./campaignsSlice";
import { Campaign } from "@/app/campaigns/types";

export function useCampaignListPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: items = [], status: fetchStatus } = useAppSelector(state => state.campaigns.list.items);
  const { searchQuery = "", isModalOpen = false, modalMode = "create", editingId = null, formFields = {}, saving = false, localError = null, successMessage = null } = useAppSelector(state => state.campaigns.list.ui);

  const loading = fetchStatus === "loading";
  const error = localError;

  const { orgId = "1", name = "", status = "draft" } = formFields;

  const fetchItems = useCallback(() => {
    dispatch(campaignsActions.fetchRequest());
  }, [dispatch]);

  const openCreateModal = useCallback(() => {
    dispatch(campaignsActions.openModal({
      mode: "create",
      initialFields: { orgId: "1", name: "", status: "draft" }
    }));
  }, [dispatch]);

  const openEditModal = useCallback((item: Campaign) => {
    dispatch(campaignsActions.openModal({
      mode: "edit",
      editingId: item.id,
      initialFields: { orgId: item.orgId.toString(), name: item.name, status: item.status }
    }));
  }, [dispatch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedOrgId = parseInt(orgId, 10);
    const finalOrgId = Number.isNaN(parsedOrgId) ? 1 : parsedOrgId;

    const payload = { orgId: finalOrgId, name, status };

    if (modalMode === "create") {
      dispatch(campaignsActions.createRequest(payload));
    } else if (modalMode === "edit" && editingId !== null) {
      dispatch(campaignsActions.updateRequest({ id: editingId, data: payload }));
    }
  }, [dispatch, name, orgId, modalMode, editingId]);

  const handleDelete = useCallback((id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    dispatch(campaignsActions.deleteRequest(id));
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.status.toLowerCase().includes(q) || item.id.toString().includes(q);
    });
  }, [items, searchQuery]);

  useEffect(() => {
    dispatch(campaignsActions.fetchRequest());
  }, [dispatch]);

  return {
    router,
    dispatch,
    items,
    loading,
    error,
    orgId,
    name,
    status,
    saving,
    successMessage,
    isModalOpen,
    modalMode,
    searchQuery,
    fetchItems,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    filteredItems,
  };
}
