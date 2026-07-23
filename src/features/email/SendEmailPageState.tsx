import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { sendRequest, selectEmailSendState, resetSendState, emailSlice, selectEmailState } from "./emailSlice";

export class SendEmailPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public sendState: any,
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

  get sending() {
    return this.sendState.status === "loading";
  }

  get error() {
    return this.sendState.error;
  }

  get success() {
    return this.emailState.lastAction?.status === "success" && this.emailState.lastAction?.type === "create" ? this.emailState.lastAction.message : "";
  }

  handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const recipientList = this.recipients
      .split(",")
      .map((r: string) => r.trim())
      .filter((r: string) => r.length > 0);

    this.dispatch(sendRequest({ recipients: recipientList, subject: this.subject, body: this.body }));
  };
}

export function useSendEmailPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sendState = useAppSelector(selectEmailSendState);
  const emailState = useAppSelector(selectEmailState);

  useEffect(() => {
    return () => {
      dispatch(resetSendState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (sendState.status === "succeeded") {
      const timer = setTimeout(() => router.push("/email"), 1500);
      return () => clearTimeout(timer);
    }
  }, [sendState.status, router]);

  return new SendEmailPageState(router, dispatch, sendState, emailState);
}
