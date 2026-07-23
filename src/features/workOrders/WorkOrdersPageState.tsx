import React, { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { workOrdersActions } from "./workOrdersSlice";

export function useWorkOrdersPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { data: workOrders = [], status: listStatus, error } = useAppSelector((state) => state.workOrders.items);
  const ui = useAppSelector((state) => state.workOrders.ui);

  const { searchQuery = "", successMessage = null, formFields = {} } = ui;
  const { statusFilter = "all" } = formFields;

  const loading = listStatus === 'loading';
  const refreshing = loading;
  const success = successMessage;

  const fetchWorkOrders = useCallback(() => {
    dispatch(workOrdersActions.fetchRequest());
  }, [dispatch]);

  const getPriorityStyles = useCallback((p: number) => {
    if (p >= 3) return "text-red-400 bg-red-955/30 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.07)]";
    if (p === 2) return "text-amber-400 bg-amber-955/30 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.07)]";
    return "text-blue-400 bg-blue-955/20 border-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.05)]";
  }, []);

  const getPriorityLabel = useCallback((p: number) => {
    if (p >= 3) return "High";
    if (p === 2) return "Medium";
    return "Low";
  }, []);

  const getStatusStyles = useCallback((s: string) => {
    const statusLower = s.toLowerCase();
    if (statusLower === "new") return "bg-blue-950/60 text-blue-400 border-blue-800/40";
    if (statusLower === "completed") return "bg-emerald-950/60 text-emerald-400 border-emerald-800/40";
    if (statusLower === "in_progress" || statusLower === "in progress") return "bg-amber-950/60 text-amber-400 border-amber-800/40";
    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  }, []);

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter((w) => {
      const matchesStatus = statusFilter === "all" || w.status.toLowerCase() === statusFilter.toLowerCase();
      
      if (!matchesStatus) return false;
      if (!searchQuery) return true;
      
      const q = searchQuery.toLowerCase();
      return (
        w.id.toString().includes(q) ||
        w.status.toLowerCase().includes(q) ||
        (w.caseId && w.caseId.toString().includes(q))
      );
    });
  }, [workOrders, statusFilter, searchQuery]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  return {
    router,
    dispatch,
    workOrders,
    listStatus,
    error,
    ui,
    searchQuery,
    statusFilter,
    success,
    loading,
    refreshing,
    fetchWorkOrders,
    getPriorityStyles,
    getPriorityLabel,
    getStatusStyles,
    filteredWorkOrders,
  };
}
