import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { notificationsActions } from "./notificationsSlice";

export class DispatchNotificationPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public notificationsState: any,
    public ui: any
  ) {}

  get typeCode() {
    return this.ui.formFields.typeCode ?? "system_alert";
  }

  get sourceService() {
    return this.ui.formFields.sourceService ?? "procurement-service";
  }

  get targetScope() {
    return this.ui.formFields.targetScope ?? "USER";
  }

  get targetId() {
    return this.ui.formFields.targetId ?? "1";
  }

  get priority() {
    return this.ui.formFields.priority ?? 2;
  }

  get title() {
    return this.ui.formFields.title ?? "";
  }

  get message() {
    return this.ui.formFields.message ?? "";
  }

  get creating() {
    return this.notificationsState.status === "loading";
  }

  get error() {
    return this.ui.localError || this.notificationsState.error || "";
  }

  get success() {
    return this.notificationsState.lastAction || this.ui.successMessage || "";
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.title || !this.message) {
      this.dispatch(notificationsActions.setLocalError("Please fill in title and message payload fields"));
      return;
    }

    this.dispatch(notificationsActions.setLocalError(""));
    this.dispatch(notificationsActions.setSuccessMessage(""));

    this.dispatch(notificationsActions.dispatchNotificationRequest({
      userId: this.targetId ? parseInt(this.targetId) : 1,
      title: this.title,
      message: this.message,
      channels: ["EMAIL"],
    }));
  };
}

export function useDispatchNotificationPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const notificationsState = useAppSelector((s) => s.notifications.notifications);
  const ui = notificationsState.ui;

  useEffect(() => {
    if (notificationsState.lastAction === 'Notification sent successfully!') {
      dispatch(notificationsActions.setSuccessMessage("Notification event dispatched successfully!"));
      dispatch(notificationsActions.setFormField({ field: "title", value: "" }));
      dispatch(notificationsActions.setFormField({ field: "message", value: "" }));

      const timer = setTimeout(() => {
        router.push("/notifications");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notificationsState.lastAction, router, dispatch]);

  return new DispatchNotificationPageState(router, dispatch, notificationsState, ui);
}
