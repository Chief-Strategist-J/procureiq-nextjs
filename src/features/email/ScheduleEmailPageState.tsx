import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { createRequest, selectEmailState, resetLastAction, emailSlice } from "./emailSlice";

export class ScheduleEmailPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public emailState: any
  ) {}

  get ui() {
    return this.emailState.ui;
  }

  get recipients() {
    return this.ui.formFields.recipients ?? "";
  }

  get subject() {
    return this.ui.formFields.subject ?? "";
  }

  get body() {
    return this.ui.formFields.body ?? "";
  }

  get scheduledFor() {
    return this.ui.formFields.scheduledFor ?? "";
  }

  get saving() {
    return this.emailState.items.status === "loading";
  }

  get error() {
    return this.emailState.lastAction?.status === "error" ? this.emailState.lastAction.message : "";
  }

  get success() {
    return this.emailState.lastAction?.status === "success" && this.emailState.lastAction?.type === "create" ? "Email scheduled successfully." : "";
  }

  handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const recipientList = this.recipients
      .split(",")
      .map((r: string) => r.trim())
      .filter((r: string) => r.length > 0);

    this.dispatch(createRequest({
      recipients: recipientList,
      subject: this.subject,
      body: this.body,
      scheduled_for: new Date(this.scheduledFor).toISOString(),
      status: "pending",
      created_at: new Date().toISOString()
    }));
  };
}

export function useScheduleEmailPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const emailState = useAppSelector(selectEmailState);
  const success = emailState.lastAction?.status === "success" && emailState.lastAction?.type === "create" ? "Email scheduled successfully." : "";

  useEffect(() => {
    return () => {
      dispatch(resetLastAction());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/email");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return new ScheduleEmailPageState(router, dispatch, emailState);
}
