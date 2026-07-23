import React, { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { remindersActions } from "./remindersSlice";
import { Badge } from "@/components/ui/badge";

export interface TaskReminder {
  id: string | number;
  title: string;
  description: string;
  dueAt: string;
  recurrence: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  contactPreference: "CALL" | "SMS" | "SLACK";
  assigneeName: string;
  assigneeContact: string;
  status: "PENDING" | "COMPLETED" | "SNOOZED" | "FAILED";
  snoozeCount: number;
}

export interface DispatchLog {
  id: string;
  time: string;
  taskTitle: string;
  assigneeName: string;
  channel: "CALL" | "SMS" | "SLACK";
  status: "CALLING" | "SENT" | "SNOOZED" | "COMPLETED" | "NO_ANSWER";
  details: string;
}

export function useRemindersPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const reduxReminders = useAppSelector((s) => s.reminders.items.data) ?? [];
  const reduxLoading = useAppSelector((s) => s.reminders.items.status === "loading");
  const reduxError = useAppSelector((s) => s.reminders.items.error);
  const remindersUi = useAppSelector((s) => s.reminders.items.ui);

  const { localError = null, successMessage = null, formFields = {} } = remindersUi;
  const { refreshing = false, logs = [] } = formFields;

  const success = successMessage || "";
  const error = localError || reduxError || "";
  const loading = reduxLoading;

  const reminders = useMemo(() => {
    return reduxReminders.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.message,
      dueAt: r.scheduledAt,
      recurrence: "NONE",
      priority: "MEDIUM" as const,
      contactPreference: "SMS" as const,
      assigneeName: "Assignee",
      assigneeContact: "",
      status: (r.status?.toUpperCase() as TaskReminder["status"]) || "PENDING",
      snoozeCount: 0,
    }));
  }, [reduxReminders]);

  const handleRefresh = useCallback(() => {
    dispatch(remindersActions.setFormField({ field: "refreshing", value: true }));
    dispatch(remindersActions.fetchRequest());
    setTimeout(() => dispatch(remindersActions.setFormField({ field: "refreshing", value: false })), 800);
  }, [dispatch]);

  const handleDelete = useCallback((id: string | number) => {
    dispatch(remindersActions.deleteRequest(Number(id)));
    dispatch(remindersActions.setSuccessMessage("Reminder deleted successfully."));
    setTimeout(() => dispatch(remindersActions.setSuccessMessage("")), 3000);
  }, [dispatch]);

  const addLogEntry = useCallback((
    taskTitle: string,
    assigneeName: string, 
    channel: "CALL" | "SMS" | "SLACK", 
    status: DispatchLog["status"], 
    details: string
  ) => {
    const newLog: DispatchLog = {
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      taskTitle,
      assigneeName,
      channel,
      status,
      details
    };
    const updatedLogs = [newLog, ...logs];
    dispatch(remindersActions.setFormField({ field: "logs", value: updatedLogs }));
    localStorage.setItem("procureiq_reminder_logs", JSON.stringify(updatedLogs));
  }, [dispatch, logs]);

  const triggerCallSimulation = useCallback((reminder: TaskReminder) => {
    addLogEntry(
      reminder.title, 
      reminder.assigneeName.split(" ")[0], 
      reminder.contactPreference, 
      "CALLING", 
      `AI Dispatch: Initiating communication channel...`
    );

    setTimeout(() => {
      dispatch(remindersActions.updateRequest({
        id: Number(reminder.id),
        data: {
          userId: 1,
          title: reminder.title,
          message: reminder.description,
          scheduledAt: reminder.dueAt,
          status: "completed",
        },
      }));

      addLogEntry(
        reminder.title, 
        reminder.assigneeName.split(" ")[0], 
        reminder.contactPreference, 
        "COMPLETED", 
        `Alert confirmed. Recipient answered and acknowledged follow-up task.`
      );
      dispatch(remindersActions.setSuccessMessage(`Alert successfully acknowledged for "${reminder.title}"`));
      setTimeout(() => dispatch(remindersActions.setSuccessMessage("")), 4000);
    }, 2000);
  }, [dispatch, addLogEntry]);

  const getPriorityColor = useCallback((p: string) => {
    if (p === "HIGH") return "text-red-400 border-red-955 bg-red-955/30";
    if (p === "MEDIUM") return "text-amber-400 border-amber-955 bg-amber-955/30";
    return "text-zinc-400 border-zinc-800 bg-zinc-900";
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    const styles = {
      PENDING: "bg-blue-950/60 text-blue-400 border-blue-900/50",
      COMPLETED: "bg-emerald-950/60 text-emerald-400 border-emerald-900/50",
      SNOOZED: "bg-amber-950/60 text-amber-400 border-emerald-900/50",
      FAILED: "bg-red-950/60 text-red-400 border-red-900/50",
    };
    return (
      <Badge variant="outline" className={`text-[10px] font-mono ${styles[status as keyof typeof styles] || styles.PENDING}`}>
        {status}
      </Badge>
    );
  }, []);

  useEffect(() => {
    dispatch(remindersActions.fetchRequest());
    const storedLogs = localStorage.getItem("procureiq_reminder_logs");
    if (storedLogs) {
      dispatch(remindersActions.setFormField({ field: "logs", value: JSON.parse(storedLogs) }));
    }
  }, [dispatch]);

  return {
    router,
    dispatch,
    reduxReminders,
    reduxLoading,
    reduxError,
    remindersUi,
    refreshing,
    success,
    error,
    logs,
    reminders,
    loading,
    handleRefresh,
    handleDelete,
    addLogEntry,
    triggerCallSimulation,
    getPriorityColor,
    getStatusBadge,
  };
}
