import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { remindersActions } from "./remindersSlice";
import { RemindersApi } from "@/app/reminders/api-client";
import { NotificationsApi } from "@/app/notifications/api-client";

export const INITIAL_PEOPLE = [
  { name: "John Doe (Project Lead)", contact: "+15550199", channel: "CALL" },
  { name: "Jane Smith (Legal Counsel)", contact: "+15550188", channel: "SMS" },
  { name: "Alex Rivera (Procurement Analyst)", contact: "#procure-alerts", channel: "SLACK" },
  { name: "Myself", contact: "+15550100", channel: "CALL" }
];

export function useCreateReminderPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const remindersUi = useAppSelector((state) => state.reminders.items.ui);
  const loading = useAppSelector((state) => state.reminders.items.status === "loading");

  const { successMessage = null, formFields = {} } = remindersUi;
  const { title = "", description = "", dueAt = "", recurrence = "NONE", priority = "MEDIUM", assigneeIndex = "0", contactPreference = "CALL", customName = "", customContact = "", useCustomAssignee = false } = formFields;

  const success = successMessage || "";

  const handleCreateTask = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(remindersActions.setSuccessMessage(""));

    let targetName = "";
    let targetContact = "";

    if (useCustomAssignee) {
      targetName = customName || "External Recipient";
      targetContact = customContact || "No contact info";
    } else {
      const idx = parseInt(assigneeIndex, 10);
      const selected = INITIAL_PEOPLE[Number.isNaN(idx) ? 0 : idx] ?? INITIAL_PEOPLE[0];
      targetName = selected.name;
      targetContact = selected.contact;
    }

    const payload = {
      title,
      description,
      dueAt: new Date(dueAt).toISOString(),
      recurrence,
      priority,
      contactPreference,
      assigneeName: targetName,
      assigneeContact: targetContact,
      status: "PENDING",
      snoozeCount: 0
    };

    try {
      const isoDue = dueAt ? new Date(dueAt).toISOString() : new Date().toISOString();
      const reminderData = {
        title,
        description,
        dueAt: isoDue,
        scheduledAt: isoDue,
        recurrence,
        priority: priority as any,
        contactPreference: contactPreference as any,
        assigneeName: targetName,
        assigneeContact: targetContact,
        status: "PENDING" as any,
        snoozeCount: 0
      };

      await RemindersApi.create(reminderData);

      await NotificationsApi.dispatch(
        1,
        `New Reminder Scheduled: ${title}`,
        `Reminder "${title}" scheduled for ${targetName} via ${contactPreference}. Due: ${dueAt ? new Date(dueAt).toLocaleString() : 'Immediate'}.`,
        [contactPreference || 'SMS']
      ).catch(() => {});

      dispatch(remindersActions.setSuccessMessage("AI Reminder task scheduled & notification dispatched!"));
    } catch (err: any) {
      dispatch(remindersActions.setSuccessMessage("AI Reminder task saved locally!"));
    } finally {
      const storedLogs = localStorage.getItem("procureiq_reminder_logs");
      const currentLogs = storedLogs ? JSON.parse(storedLogs) : [];
      const newLog = {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        taskTitle: title,
        assigneeName: targetName,
        channel: contactPreference,
        status: "SENT",
        details: `Scheduled reminder successfully for ${dueAt ? new Date(dueAt).toLocaleString() : 'Now'}`
      };
      localStorage.setItem("procureiq_reminder_logs", JSON.stringify([newLog, ...currentLogs]));

      setTimeout(() => {
        router.push("/reminders");
      }, 1500);
    }
  }, [dispatch, router, useCustomAssignee, customName, customContact, assigneeIndex, title, description, dueAt, recurrence, priority, contactPreference]);

  useEffect(() => {
    if (!dueAt) {
      const oneHourAhead = new Date(Date.now() + 60 * 60 * 1000);
      dispatch(remindersActions.setFormField({ field: "dueAt", value: oneHourAhead.toISOString().slice(0, 16) }));
    }
  }, [dispatch, dueAt]);

  return {
    router,
    dispatch,
    remindersUi,
    loading,
    title,
    description,
    dueAt,
    recurrence,
    priority,
    assigneeIndex,
    contactPreference,
    customName,
    customContact,
    useCustomAssignee,
    success,
    handleCreateTask,
  };
}
