import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import { campaignsActions } from "./campaignsSlice";
import { Campaign } from "@/app/campaigns/types";

export class CampaignListPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public items: Campaign[],
    public fetchStatus: string,
    public searchQuery: string,
    public isModalOpen: boolean,
    public modalMode: string,
    public editingId: number | null,
    public formFields: any,
    public saving: boolean,
    public localError: string | null,
    public successMessage: string | null
  ) {}

  get loading() {
    return this.fetchStatus === "loading";
  }

  get error() {
    return this.localError;
  }

  get orgId() {
    return this.formFields.orgId ?? "1";
  }

  get name() {
    return this.formFields.name ?? "";
  }

  get status() {
    return this.formFields.status ?? "draft";
  }

  fetchItems = () => {
    this.dispatch(campaignsActions.fetchRequest());
  };

  openCreateModal = () => {
    this.dispatch(campaignsActions.openModal({
      mode: "create",
      initialFields: { orgId: "1", name: "", status: "draft" }
    }));
  };

  openEditModal = (item: Campaign) => {
    this.dispatch(campaignsActions.openModal({
      mode: "edit",
      editingId: item.id,
      initialFields: { orgId: item.orgId.toString(), name: item.name, status: item.status }
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.name.trim()) return;

    const payload = { orgId: parseInt(this.orgId) || 1, name: this.name, status: this.status };

    if (this.modalMode === "create") {
      this.dispatch(campaignsActions.createRequest(payload));
    } else if (this.modalMode === "edit" && this.editingId !== null) {
      this.dispatch(campaignsActions.updateRequest({ id: this.editingId, data: payload }));
    }
  };

  handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    this.dispatch(campaignsActions.deleteRequest(id));
  };

  get filteredItems() {
    return this.items.filter((item) => {
      if (!this.searchQuery) return true;
      const q = this.searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.status.toLowerCase().includes(q) || item.id.toString().includes(q);
    });
  }
}

export function useCampaignListPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: items = [], status: fetchStatus } = useAppSelector(state => state.campaigns.list.items);
  const { searchQuery, isModalOpen, modalMode, editingId, formFields, saving, localError, successMessage } = useAppSelector(state => state.campaigns.list.ui);

  useEffect(() => {
    dispatch(campaignsActions.fetchRequest());
  }, [dispatch]);

  return new CampaignListPageState(
    router,
    dispatch,
    items,
    fetchStatus,
    searchQuery,
    isModalOpen,
    modalMode,
    editingId,
    formFields,
    saving,
    localError,
    successMessage
  );
}
