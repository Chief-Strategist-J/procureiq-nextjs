import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { territoriesSlice, operatingHoursSlice } from "./fieldServiceSlice";
import { ServiceTerritory, OperatingHours } from "@/app/field-service/types";

export class TerritoriesPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public items: ServiceTerritory[],
    public operatingHours: OperatingHours[],
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

  get operatingHoursId() {
    return this.ui.formFields.operatingHoursId ?? "";
  }

  get saving() {
    return this.loading && this.isModalOpen;
  }

  fetchItems = () => {
    this.dispatch(territoriesSlice.actions.fetchRequest(undefined));
    this.dispatch(operatingHoursSlice.actions.fetchRequest(undefined));
  };

  openCreateModal = () => {
    this.dispatch(territoriesSlice.actions.openModal({
      mode: "create",
      initialFields: { name: "", operatingHoursId: "" }
    }));
  };

  openEditModal = (item: ServiceTerritory) => {
    this.dispatch(territoriesSlice.actions.openModal({
      mode: "edit",
      editingId: item.id,
      initialFields: { name: item.name, operatingHoursId: item.operatingHoursId ? item.operatingHoursId.toString() : "" }
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.name.trim()) return;

    const opId = this.operatingHoursId ? parseInt(this.operatingHoursId) : undefined;

    if (this.modalMode === "create") {
      this.dispatch(territoriesSlice.actions.createRequest({ name: this.name, operatingHoursId: opId }));
      this.dispatch(territoriesSlice.actions.setSuccessMessage("Service territory creation initiated."));
    } else if (this.modalMode === "edit" && this.editingId !== null) {
      this.dispatch(territoriesSlice.actions.updateRequest({ id: this.editingId, data: { name: this.name, operatingHoursId: opId } }));
      this.dispatch(territoriesSlice.actions.setSuccessMessage("Service territory update initiated."));
    }
  };

  handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this service territory?")) return;
    this.dispatch(territoriesSlice.actions.deleteRequest(id));
    this.dispatch(territoriesSlice.actions.setSuccessMessage("Service territory deletion initiated."));
  };

  getOperatingHoursName = (opId?: number) => {
    if (!opId) return "None";
    const op = this.operatingHours.find((x) => x.id === opId);
    return op ? op.name : `ID: ${opId}`;
  };

  get filteredItems() {
    return this.items.filter((item) => {
      if (!this.query) return true;
      const q = this.query.toLowerCase();
      const opName = this.getOperatingHoursName(item.operatingHoursId).toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        opName.includes(q) ||
        item.id.toString().includes(q)
      );
    });
  }
}

export function useTerritoriesPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.fieldService.territories.items.data) || [];
  const operatingHours = useAppSelector((s) => s.fieldService.operatingHours.items.data) || [];
  const loading = useAppSelector((s) => s.fieldService.territories.items.status === "loading");
  const storeError = useAppSelector((s) => s.fieldService.territories.items.error);
  const ui = useAppSelector((s) => s.fieldService.territories.ui);

  const fetchItems = useCallback(() => {
    dispatch(territoriesSlice.actions.fetchRequest(undefined));
    dispatch(operatingHoursSlice.actions.fetchRequest(undefined));
  }, [dispatch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return new TerritoriesPageState(router, dispatch, items, operatingHours, loading, storeError, ui);
}
