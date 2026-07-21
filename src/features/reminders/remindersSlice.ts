import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';
import { Reminder } from '@/app/reminders/api-client';

export interface RemindersState {
  items: AsyncState<Reminder[]>;
}

const remindersSlice = createSlice({
  name: 'reminders',
  initialState: { items: createAsyncState<Reminder[]>([]) } as RemindersState,
  reducers: {
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
