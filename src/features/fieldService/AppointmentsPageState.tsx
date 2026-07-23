import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { appointmentsSlice, resourcesSlice } from "./fieldServiceSlice";

export class AppointmentsPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public items: any[],
    public resources: any[],
    public loading: boolean
  ) {}

  handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    this.dispatch(appointmentsSlice.actions.deleteRequest(id));
  };

  getResourceName = (resId?: number) => {
    if (!resId) return "Unassigned";
    const r = this.resources.find((x) => x.id === resId);
    return r ? r.name : `ID: ${resId}`;
  };
}

export function useAppointmentsPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.fieldService.appointments.items.data) || [];
  const resources = useAppSelector((s) => s.fieldService.resources.items.data) || [];
  const loading = useAppSelector((s) => s.fieldService.appointments.items.status === "loading");

  useEffect(() => {
    dispatch(appointmentsSlice.actions.fetchRequest(undefined));
    dispatch(resourcesSlice.actions.fetchRequest(undefined));
  }, [dispatch]);

  return new AppointmentsPageState(router, dispatch, items, resources, loading);
}
