import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalUiState } from './types';

const initialState: GlobalUiState = {
  isSidebarOpen: true,
  theme: 'dark',
  activeNotificationCount: 0,
  activeModal: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload;
    },
    setActiveNotificationCount(state, action: PayloadAction<number>) {
      state.activeNotificationCount = Math.max(0, action.payload);
    },
    setActiveModal(state, action: PayloadAction<string | null>) {
      state.activeModal = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
