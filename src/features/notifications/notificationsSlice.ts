import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';
import { NotificationItem } from '@/app/notifications/api-client';

export interface NotificationsState {
  notifications: AsyncState<NotificationItem[]>;
  unreadCount: AsyncState<number>;
}

const initialState: NotificationsState = {
  notifications: createAsyncState([]),
  unreadCount: createAsyncState(0),
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsRequest(state, _action: PayloadAction<{ page: number; statusFilter: string }>) {
      state.notifications.status = 'loading';
      state.notifications.error = null;
      state.notifications.lastAction = null;
    },
    fetchNotificationsSuccess(state, action: PayloadAction<NotificationItem[]>) {
      state.notifications.status = 'succeeded';
      state.notifications.data = action.payload;
    },
    fetchNotificationsFailure(state, action: PayloadAction<string>) {
      state.notifications.status = 'failed';
      state.notifications.error = action.payload;
    },
    updateStatusRequest(state, _action: PayloadAction<{ id: number; status: 'READ' | 'UNREAD' }>) {
      // Optimistic update — no loading flash needed
      const { id, status } = _action.payload;
      const n = state.notifications.data.find(x => x.id === id);
      if (n) n.status = status;
      state.notifications.lastAction = `Marked as ${_action.payload.status.toLowerCase()}.`;
    },
    updateStatusFailure(state, action: PayloadAction<string>) {
      state.notifications.error = action.payload;
    },
    dispatchNotificationRequest(state, _action: PayloadAction<{ userId: number; title: string; message: string; channels: string[] }>) {
      state.notifications.status = 'loading';
      state.notifications.error = null;
      state.notifications.lastAction = null;
    },
    dispatchNotificationSuccess(state) {
      state.notifications.status = 'succeeded';
      state.notifications.lastAction = 'Notification sent successfully!';
    },
    dispatchNotificationFailure(state, action: PayloadAction<string>) {
      state.notifications.status = 'failed';
      state.notifications.error = action.payload;
    },
    fetchUnreadCountRequest(state) {
      state.unreadCount.status = 'loading';
    },
    fetchUnreadCountSuccess(state, action: PayloadAction<number>) {
      state.unreadCount.status = 'succeeded';
      state.unreadCount.data = action.payload;
    },
    fetchUnreadCountFailure(state, action: PayloadAction<string>) {
      state.unreadCount.status = 'failed';
      state.unreadCount.error = action.payload;
    },
  },
});

export const notificationsActions = notificationsSlice.actions;
export default notificationsSlice.reducer;
