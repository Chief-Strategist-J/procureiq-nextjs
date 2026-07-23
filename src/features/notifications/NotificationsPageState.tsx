import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { notificationsActions } from "./notificationsSlice";

export class NotificationsPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public notifications: any[],
    public loading: boolean,
    public storeError: any,
    public notificationsUi: any
  ) {}

  get query() {
    return this.notificationsUi.searchQuery;
  }

  get statusFilter() {
    return this.notificationsUi.formFields.statusFilter ?? "all";
  }

  get page() {
    return this.notificationsUi.formFields.page ?? 0;
  }

  get refreshing() {
    return !!this.notificationsUi.formFields.refreshing;
  }

  get isModalOpen() {
    return this.notificationsUi.isModalOpen;
  }

  get error() {
    return this.notificationsUi.localError || this.storeError || "";
  }

  get success() {
    return this.notificationsUi.successMessage || "";
  }

  get typeCode() {
    return this.notificationsUi.formFields.typeCode ?? "system_alert";
  }

  get sourceService() {
    return this.notificationsUi.formFields.sourceService ?? "procurement-service";
  }

  get targetScope() {
    return this.notificationsUi.formFields.targetScope ?? "USER";
  }

  get targetId() {
    return this.notificationsUi.formFields.targetId ?? "1";
  }

  get priority() {
    return this.notificationsUi.formFields.priority ?? 2;
  }

  get title() {
    return this.notificationsUi.formFields.title ?? "";
  }

  get message() {
    return this.notificationsUi.formFields.message ?? "";
  }

  get creating() {
    return this.loading && this.isModalOpen;
  }

  handleToggleRead = (notificationId: number, currentStatus: string) => {
    const newStatus = currentStatus === "READ" ? "UNREAD" : "READ";
    this.dispatch(notificationsActions.updateStatusRequest({ id: notificationId, status: newStatus as "READ" | "UNREAD" }));
    this.dispatch(notificationsActions.setSuccessMessage(`Notification marked as ${newStatus.toLowerCase()}`));
    setTimeout(() => this.dispatch(notificationsActions.setSuccessMessage("")), 3000);
  };

  handleCreateNotification = (e: React.FormEvent) => {
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

  get filteredNotifications() {
    return this.notifications.filter((n) => {
      if (!this.query) return true;
      const q = this.query.toLowerCase();
      const titleVal = n.payload?.title || n.title || "";
      const msgVal = n.payload?.message || n.message || "";
      return (
        (n.typeCode ?? "").toLowerCase().includes(q) ||
        (n.sourceService ?? "").toLowerCase().includes(q) ||
        titleVal.toLowerCase().includes(q) ||
        msgVal.toLowerCase().includes(q)
      );
    });
  }

  getPriorityStyles = (p: number) => {
    if (p >= 3) return "text-red-400 bg-red-955/30 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.07)]";
    if (p === 2) return "text-amber-400 bg-amber-955/30 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.07)]";
    return "text-blue-400 bg-blue-950/20 border-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.05)]";
  };

  getPriorityLabel = (p: number) => {
    if (p >= 3) return "High Priority";
    if (p === 2) return "Medium";
    return "Low Priority";
  };
}

export function useNotificationsPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((s) => s.notifications.notifications.data);
  const loading = useAppSelector((s) => s.notifications.notifications.status === "loading");
  const storeError = useAppSelector((s) => s.notifications.notifications.error);
  const notificationsUi = useAppSelector((s) => s.notifications.notifications.ui);

  const statusFilter = notificationsUi.formFields.statusFilter ?? "all";
  const page = notificationsUi.formFields.page ?? 0;

  useEffect(() => {
    dispatch(notificationsActions.fetchNotificationsRequest({ page, statusFilter }));
  }, [dispatch, page, statusFilter]);

  return new NotificationsPageState(
    router,
    dispatch,
    notifications,
    loading,
    storeError,
    notificationsUi
  );
}
