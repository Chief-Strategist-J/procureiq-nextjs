import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { workOrdersActions } from "./workOrdersSlice";

export class WorkOrdersPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public workOrders: any[],
    public listStatus: string,
    public error: any,
    public ui: any
  ) {}

  get loading() {
    return this.listStatus === 'loading';
  }

  get refreshing() {
    return this.loading;
  }

  get query() {
    return this.ui.searchQuery;
  }

  get statusFilter() {
    return this.ui.formFields.statusFilter ?? "all";
  }

  get success() {
    return this.ui.successMessage;
  }

  fetchWorkOrders = () => {
    this.dispatch(workOrdersActions.fetchRequest());
  };

  get filteredWorkOrders() {
    return this.workOrders.filter((w) => {
      const matchesStatus = this.statusFilter === "all" || w.status.toLowerCase() === this.statusFilter.toLowerCase();
      
      if (!matchesStatus) return false;
      if (!this.query) return true;
      
      const q = this.query.toLowerCase();
      return (
        w.id.toString().includes(q) ||
        w.status.toLowerCase().includes(q) ||
        (w.caseId && w.caseId.toString().includes(q))
      );
    });
  }

  getPriorityStyles = (p: number) => {
    if (p >= 3) return "text-red-400 bg-red-955/30 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.07)]";
    if (p === 2) return "text-amber-400 bg-amber-955/30 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.07)]";
    return "text-blue-400 bg-blue-955/20 border-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.05)]";
  };

  getPriorityLabel = (p: number) => {
    if (p >= 3) return "High";
    if (p === 2) return "Medium";
    return "Low";
  };

  getStatusStyles = (s: string) => {
    const statusLower = s.toLowerCase();
    if (statusLower === "new") return "bg-blue-950/60 text-blue-400 border-blue-800/40";
    if (statusLower === "completed") return "bg-emerald-950/60 text-emerald-400 border-emerald-800/40";
    if (statusLower === "in_progress" || statusLower === "in progress") return "bg-amber-950/60 text-amber-400 border-amber-800/40";
    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  };
}

export function useWorkOrdersPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { data: workOrders = [], status: listStatus, error } = useAppSelector((state) => state.workOrders.items);
  const ui = useAppSelector((state) => state.workOrders.ui);

  const state = new WorkOrdersPageState(
    router,
    dispatch,
    workOrders,
    listStatus,
    error,
    ui
  );

  useEffect(() => {
    state.fetchWorkOrders();
  }, [dispatch]);

  return state;
}
