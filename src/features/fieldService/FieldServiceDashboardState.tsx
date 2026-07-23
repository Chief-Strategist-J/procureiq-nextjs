import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { operatingHoursSlice, territoriesSlice, resourcesSlice, appointmentsSlice } from "./fieldServiceSlice";
import { Clock, MapPin, Users, CalendarDays } from "lucide-react";

export class FieldServiceDashboardState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public operatingHours: any[],
    public territories: any[],
    public resources: any[],
    public appointments: any[]
  ) {}

  get stats() {
    return {
      operatingHours: this.operatingHours.length,
      territories: this.territories.length,
      resources: this.resources.length,
      appointments: this.appointments.length,
    };
  }

  get sections() {
    return [
      {
        title: "Operating Hours",
        description: "Define time slots, shifts, and global regional timezones for work shifts.",
        count: this.stats.operatingHours,
        icon: Clock,
        href: "/field-service/operating-hours",
        color: "text-indigo-400 border-indigo-500/20 bg-indigo-950/20",
      },
      {
        title: "Service Territories",
        description: "Manage physical region sectors, assignments, and bind operating hours.",
        count: this.stats.territories,
        icon: MapPin,
        href: "/field-service/territories",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
      },
      {
        title: "Service Resources",
        description: "Administer field technicians, equipment crews, capacities, and skills.",
        count: this.stats.resources,
        icon: Users,
        href: "/field-service/resources",
        color: "text-amber-400 border-amber-500/20 bg-amber-950/20",
      },
      {
        title: "Service Appointments",
        description: "Schedule parent work orders, match candidates, and dispatch assignments.",
        count: this.stats.appointments,
        icon: CalendarDays,
        href: "/field-service/appointments",
        color: "text-blue-400 border-blue-500/20 bg-blue-950/20",
      },
    ];
  }
}

export function useFieldServiceDashboardState() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const operatingHours = useAppSelector((s) => s.fieldService.operatingHours.items.data) || [];
  const territories = useAppSelector((s) => s.fieldService.territories.items.data) || [];
  const resources = useAppSelector((s) => s.fieldService.resources.items.data) || [];
  const appointments = useAppSelector((s) => s.fieldService.appointments.items.data) || [];

  useEffect(() => {
    dispatch(operatingHoursSlice.actions.fetchRequest(undefined));
    dispatch(territoriesSlice.actions.fetchRequest(undefined));
    dispatch(resourcesSlice.actions.fetchRequest(undefined));
    dispatch(appointmentsSlice.actions.fetchRequest(undefined));
  }, [dispatch]);

  return new FieldServiceDashboardState(router, dispatch, operatingHours, territories, resources, appointments);
}
