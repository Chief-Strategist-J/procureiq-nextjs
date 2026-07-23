import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';
import { Reminder } from '@/app/reminders/api-client';
import { ListUiState, initialListUiState } from '@/shared/store/createListSlice';

export interface RemindersState {
  items: AsyncState<Reminder[]> & { ui: ListUiState };
}

const remindersSlice = createSlice({
  name: 'reminders',
  initialState: {
    items: {
      ...createAsyncState<Reminder[]>([]),
      ui: initialListUiState,
    }
  } as RemindersState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.items.ui.searchQuery = action.payload;
    },
    openModal(state, action: PayloadAction<{ mode?: "create" | "edit"; editingId?: number | null; initialFields?: Record<string, any> }>) {
      state.items.ui.isModalOpen = true;
      state.items.ui.modalMode = action.payload.mode || "create";
      state.items.ui.editingId = action.payload.editingId ?? null;
      if (action.payload.initialFields) {
        state.items.ui.formFields = action.payload.initialFields;
      }
    },
    closeModal(state) {
      state.items.ui.isModalOpen = false;
      state.items.ui.editingId = null;
      state.items.ui.formFields = {};
    },
    setFormField(state, action: PayloadAction<{ field: string; value: any }>) {
      state.items.ui.formFields[action.payload.field] = action.payload.value;
    },
    setSuccessMessage(state, action: PayloadAction<string>) {
      state.items.ui.successMessage = action.payload;
    },
    setLocalError(state, action: PayloadAction<string>) {
      state.items.ui.localError = action.payload;
    },
    fetchRequest(state) { state.items.status = 'loading'; state.items.error = null; },
    fetchSuccess(state, action: PayloadAction<Reminder[]>) { state.items.status = 'succeeded'; state.items.data = action.payload; },
    fetchFailure(state, action: PayloadAction<string>) { state.items.status = 'failed'; state.items.error = action.payload; },
    createRequest(state, _action: PayloadAction<Omit<Reminder, 'id'>>) { state.items.status = 'loading'; },
    createSuccess(state, action: PayloadAction<Reminder>) { state.items.status = 'succeeded'; state.items.data.push(action.payload); },
    createFailure(state, action: PayloadAction<string>) { state.items.status = 'failed'; state.items.error = action.payload; },
    updateRequest(state, _action: PayloadAction<{ id: number; data: Omit<Reminder, 'id'> }>) { state.items.status = 'loading'; },
    updateSuccess(state, action: PayloadAction<Reminder>) { state.items.status = 'succeeded'; state.items.data = state.items.data.map(r => r.id === action.payload.id ? action.payload : r); },
    updateFailure(state, action: PayloadAction<string>) { state.items.status = 'failed'; state.items.error = action.payload; },
    deleteRequest(state, _action: PayloadAction<number>) { state.items.status = 'loading'; },
    deleteSuccess(state, action: PayloadAction<number>) { state.items.status = 'succeeded'; state.items.data = state.items.data.filter(r => r.id !== action.payload); },
    deleteFailure(state, action: PayloadAction<string>) { state.items.status = 'failed'; state.items.error = action.payload; },
  },
});

export const remindersActions = remindersSlice.actions;
export default remindersSlice.reducer;
