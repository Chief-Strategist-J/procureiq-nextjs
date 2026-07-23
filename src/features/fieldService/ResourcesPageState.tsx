import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { resourcesSlice } from "./fieldServiceSlice";
import { ServiceResource } from "@/app/field-service/types";

export class ServiceResourcesPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public items: ServiceResource[],
    public loading: boolean,
    public storeError: any,
    public ui: any
  ) {}

  get error() {
    return this.ui.localError || this.storeError || "";
  }

  get success() {
    return this.ui.successMessage || "";
  }

  get query() {
    return this.ui.searchQuery;
  }

  get isModalOpen() {
    return this.ui.isModalOpen;
  }

  get modalMode() {
    return this.ui.modalMode;
  }

  get editingId() {
    return this.ui.editingId;
  }

  get name() {
    return this.ui.formFields.name ?? "";
  }

  get resourceType() {
    return this.ui.formFields.resourceType ?? "T";
  }

  get description() {
    return this.ui.formFields.description ?? "";
  }

  get saving() {
    return this.loading && this.isModalOpen;
  }

  fetchItems = () => {
    this.dispatch(resourcesSlice.actions.fetchRequest(undefined));
  };

  openCreateModal = () => {
    this.dispatch(resourcesSlice.actions.openModal({
      mode: "create",
      initialFields: { name: "", resourceType: "T", description: "" }
    }));
  };

  openEditModal = (item: ServiceResource) => {
    this.dispatch(resourcesSlice.actions.openModal({
      mode: "edit",
      editingId: item.id,
      initialFields: { name: item.name, resourceType: item.resourceType, description: item.description || "" }
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.name.trim()) return;

    if (this.modalMode === "create") {
      this.dispatch(resourcesSlice.actions.createRequest({ name: this.name, resourceType: this.resourceType, description: this.description }));
      this.dispatch(resourcesSlice.actions.setSuccessMessage("Service resource creation initiated."));
    } else if (this.modalMode === "edit" && this.editingId !== null) {
      this.dispatch(resourcesSlice.actions.updateRequest({ id: this.editingId, data: { name: this.name, resourceType: this.resourceType, description: this.description } }));
      this.dispatch(resourcesSlice.actions.setSuccessMessage("Service resource update initiated."));
    }
  };

  handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this service resource?")) return;
    this.dispatch(resourcesSlice.actions.deleteRequest(id));
    this.dispatch(resourcesSlice.actions.setSuccessMessage("Service resource deletion initiated."));
  };

  get filteredItems() {
    return this.items.filter((item) => {
      if (!this.query) return true;
      const q = this.query.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.resourceType.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.id.toString().includes(q)
      );
    });
  }
}

export function useServiceResourcesPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.fieldService.resources.items.data) || [];
  const loading = useAppSelector((s) => s.fieldService.resources.items.status === "loading");
  const storeError = useAppSelector((s) => s.fieldService.resources.items.error);
  const ui = useAppSelector((s) => s.fieldService.resources.ui);

  const fetchItems = useCallback(() => {
    dispatch(resourcesSlice.actions.fetchRequest(undefined));
  }, [dispatch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return new ServiceResourcesPageState(router, dispatch, items, loading, storeError, ui);
}
