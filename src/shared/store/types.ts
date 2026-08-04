export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type ModalMode = 'create' | 'edit' | 'view';

export interface GlobalUiState {
  isSidebarOpen: boolean;
  theme: 'dark' | 'light';
  activeNotificationCount: number;
  activeModal: string | null;
}
