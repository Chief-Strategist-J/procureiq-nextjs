import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { remindersActions } from "./remindersSlice";
import { Badge } from "@/components/ui/badge";

interface TaskReminder {
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

interface DispatchLog {
  id: string;
  time: string;
  taskTitle: string;
  assigneeName: string;
  channel: "CALL" | "SMS" | "SLACK";
  status: "CALLING" | "SENT" | "SNOOZED" | "COMPLETED" | "NO_ANSWER";
  details: string;
}

export class RemindersPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public reduxReminders: any[],
    public reduxLoading: boolean,
    public reduxError: any,
    public remindersUi: any
  ) {}

  get refreshing() {
    return !!this.remindersUi.formFields.refreshing;
  }

  get success() {
    return this.remindersUi.successMessage || "";
  }

  get error() {
    return this.remindersUi.localError || this.reduxError || "";
  }

  get logs(): DispatchLog[] {
    return this.remindersUi.formFields.logs || [];
  }

  get reminders(): TaskReminder[] {
    return this.reduxReminders.map((r) => ({
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
  }

  get loading() {
    return this.reduxLoading;
  }

  handleRefresh = () => {
    this.dispatch(remindersActions.setFormField({ field: "refreshing", value: true }));
    this.dispatch(remindersActions.fetchRequest());
    setTimeout(() => this.dispatch(remindersActions.setFormField({ field: "refreshing", value: false })), 800);
  };

  handleDelete = (id: string | number) => {
    this.dispatch(remindersActions.deleteRequest(Number(id)));
    this.dispatch(remindersActions.setSuccessMessage("Reminder deleted successfully."));
    setTimeout(() => this.dispatch(remindersActions.setSuccessMessage("")), 3000);
  };

  addLogEntry = (
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
    const updatedLogs = [newLog, ...this.logs];
    this.dispatch(remindersActions.setFormField({ field: "logs", value: updatedLogs }));
    localStorage.setItem("procureiq_reminder_logs", JSON.stringify(updatedLogs));
  };

  triggerCallSimulation = (reminder: TaskReminder) => {
    this.addLogEntry(
      reminder.title, 
      reminder.assigneeName.split(" ")[0], 
      reminder.contactPreference, 
      "CALLING", 
      `AI Dispatch: Initiating communication channel...`
    );

    setTimeout(() => {
      this.dispatch(remindersActions.updateRequest({
        id: Number(reminder.id),
        data: {
          userId: 1,
          title: reminder.title,
          message: reminder.description,
          scheduledAt: reminder.dueAt,
          status: "completed",
        },
      }));

      this.addLogEntry(
        reminder.title, 
        reminder.assigneeName.split(" ")[0], 
        reminder.contactPreference, 
        "COMPLETED", 
        `Alert confirmed. Recipient answered and acknowledged follow-up task.`
      );
      this.dispatch(remindersActions.setSuccessMessage(`Alert successfully acknowledged for "${reminder.title}"`));
      setTimeout(() => this.dispatch(remindersActions.setSuccessMessage("")), 4000);
    }, 2000);
  };

  getPriorityColor = (p: string) => {
    if (p === "HIGH") return "text-red-400 border-red-955 bg-red-955/30";
    if (p === "MEDIUM") return "text-amber-400 border-amber-955 bg-amber-955/30";
    return "text-zinc-400 border-zinc-800 bg-zinc-900";
  };

  getStatusBadge = (status: string) => {
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
  };
}

export function useRemindersPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const reduxReminders = useAppSelector((s) => s.reminders.items.data);
  const reduxLoading = useAppSelector((s) => s.reminders.items.status === "loading");
  const reduxError = useAppSelector((s) => s.reminders.items.error);
  const remindersUi = useAppSelector((s) => s.reminders.items.ui);

  useEffect(() => {
    dispatch(remindersActions.fetchRequest());
    const storedLogs = localStorage.getItem("procureiq_reminder_logs");
    if (storedLogs) {
      dispatch(remindersActions.setFormField({ field: "logs", value: JSON.parse(storedLogs) }));
    }
  }, [dispatch]);

  return new RemindersPageState(
    router,
    dispatch,
    reduxReminders,
    reduxLoading,
    reduxError,
    remindersUi
  );
}
