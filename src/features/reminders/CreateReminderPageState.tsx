import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { remindersActions } from "./remindersSlice";

export const INITIAL_PEOPLE = [
  { name: "John Doe (Project Lead)", contact: "+15550199", channel: "CALL" },
  { name: "Jane Smith (Legal Counsel)", contact: "+15550188", channel: "SMS" },
  { name: "Alex Rivera (Procurement Analyst)", contact: "#procure-alerts", channel: "SLACK" },
  { name: "Myself", contact: "+15550100", channel: "CALL" }
];

export class CreateReminderPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public remindersUi: any,
    public loading: boolean
  ) {}

  get title() {
    return this.remindersUi.formFields.title ?? "";
  }

  get description() {
    return this.remindersUi.formFields.description ?? "";
  }

  get dueAt() {
    return this.remindersUi.formFields.dueAt ?? "";
  }

  get recurrence() {
    return this.remindersUi.formFields.recurrence ?? "NONE";
  }

  get priority(): "LOW" | "MEDIUM" | "HIGH" {
    return this.remindersUi.formFields.priority ?? "MEDIUM";
  }

  get assigneeIndex() {
    return this.remindersUi.formFields.assigneeIndex ?? "0";
  }

  get contactPreference(): "CALL" | "SMS" | "SLACK" {
    return this.remindersUi.formFields.contactPreference ?? "CALL";
  }

  get customName() {
    return this.remindersUi.formFields.customName ?? "";
  }

  get customContact() {
    return this.remindersUi.formFields.customContact ?? "";
  }

  get useCustomAssignee() {
    return !!this.remindersUi.formFields.useCustomAssignee;
  }

  get success() {
    return this.remindersUi.successMessage || "";
  }

  handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.title.trim()) return;

    this.dispatch(remindersActions.setSuccessMessage(""));

    let targetName = "";
    let targetContact = "";

    if (this.useCustomAssignee) {
      targetName = this.customName || "External Recipient";
      targetContact = this.customContact || "No contact info";
    } else {
      const selected = INITIAL_PEOPLE[parseInt(this.assigneeIndex)];
      targetName = selected.name;
      targetContact = selected.contact;
    }

    const payload = {
      title: this.title,
      description: this.description,
      dueAt: new Date(this.dueAt).toISOString(),
      recurrence: this.recurrence,
      priority: this.priority,
      contactPreference: this.contactPreference,
      assigneeName: targetName,
      assigneeContact: targetContact,
      status: "PENDING",
      snoozeCount: 0
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${backendUrl}/api/v1/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule reminder on backend");
      }

      this.dispatch(remindersActions.setSuccessMessage("AI Reminder task scheduled successfully!"));
    } catch (err: any) {
      const newReminder = {
        ...payload,
        id: Math.random().toString(36).substring(2, 9),
      };

      const stored = localStorage.getItem("procureiq_reminders");
      const currentReminders = stored ? JSON.parse(stored) : [];
      localStorage.setItem("procureiq_reminders", JSON.stringify([newReminder, ...currentReminders]));

      this.dispatch(remindersActions.setSuccessMessage("[Offline Sandbox] AI Reminder task scheduled successfully!"));
    } finally {
      const storedLogs = localStorage.getItem("procureiq_reminder_logs");
      const currentLogs = storedLogs ? JSON.parse(storedLogs) : [];
      const newLog = {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        taskTitle: this.title,
        assigneeName: targetName,
        channel: this.contactPreference,
        status: "SENT",
        details: `Scheduled reminder successfully for ${new Date(this.dueAt).toLocaleString()}`
      };
      localStorage.setItem("procureiq_reminder_logs", JSON.stringify([newLog, ...currentLogs]));

      setTimeout(() => {
        this.router.push("/reminders");
      }, 1500);
    }
  };
}

export function useCreateReminderPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const remindersUi = useAppSelector((state) => state.reminders.items.ui);
  const loading = useAppSelector((state) => state.reminders.items.status === "loading");

  const dueAt = remindersUi.formFields.dueAt ?? "";

  useEffect(() => {
    if (!dueAt) {
      const oneHourAhead = new Date(Date.now() + 60 * 60 * 1000);
      dispatch(remindersActions.setFormField({ field: "dueAt", value: oneHourAhead.toISOString().slice(0, 16) }));
    }
  }, [dispatch, dueAt]);

  return new CreateReminderPageState(
    router,
    dispatch,
    remindersUi,
    loading
  );
}
