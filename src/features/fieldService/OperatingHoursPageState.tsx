import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { operatingHoursSlice } from "./fieldServiceSlice";
import { OperatingHours } from "@/app/field-service/types";

export class OperatingHoursPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public items: OperatingHours[],
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

  get timezone() {
    return this.ui.formFields.timezone ?? "America/New_York";
  }

  get saving() {
    return this.loading && this.isModalOpen;
  }

  fetchItems = () => {
    this.dispatch(operatingHoursSlice.actions.fetchRequest(undefined));
  };

  openCreateModal = () => {
    this.dispatch(operatingHoursSlice.actions.openModal({
      mode: "create",
      initialFields: { name: "", timezone: "America/New_York" }
    }));
  };

  openEditModal = (item: OperatingHours) => {
    this.dispatch(operatingHoursSlice.actions.openModal({
      mode: "edit",
      editingId: item.id,
      initialFields: { name: item.name, timezone: item.timezone }
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.name.trim()) return;

    if (this.modalMode === "create") {
      this.dispatch(operatingHoursSlice.actions.createRequest({ name: this.name, timezone: this.timezone }));
      this.dispatch(operatingHoursSlice.actions.setSuccessMessage("Operating hours creation initiated."));
    } else if (this.modalMode === "edit" && this.editingId !== null) {
      this.dispatch(operatingHoursSlice.actions.updateRequest({ id: this.editingId, data: { name: this.name, timezone: this.timezone } }));
      this.dispatch(operatingHoursSlice.actions.setSuccessMessage("Operating hours update initiated."));
    }
  };

  handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete these operating hours?")) return;
    this.dispatch(operatingHoursSlice.actions.deleteRequest(id));
    this.dispatch(operatingHoursSlice.actions.setSuccessMessage("Operating hours deletion initiated."));
  };

  get filteredItems() {
    return this.items.filter((item) => {
      if (!this.query) return true;
      const q = this.query.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.timezone.toLowerCase().includes(q) ||
        item.id.toString().includes(q)
      );
    });
  }
}

export function useOperatingHoursPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.fieldService.operatingHours.items.data) || [];
  const loading = useAppSelector((s) => s.fieldService.operatingHours.items.status === "loading");
  const storeError = useAppSelector((s) => s.fieldService.operatingHours.items.error);
  const ui = useAppSelector((s) => s.fieldService.operatingHours.ui);

  const fetchItems = useCallback(() => {
    dispatch(operatingHoursSlice.actions.fetchRequest(undefined));
  }, [dispatch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return new OperatingHoursPageState(router, dispatch, items, loading, storeError, ui);
}
