import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';

export interface ListState<T> {
  items: AsyncState<T[]>;
  lastAction?: { type: 'create' | 'update' | 'delete'; status: 'success' | 'error'; message?: string };
}

export function createListSlice<T>(
  name: string,
  extraReducers?: SliceCaseReducers<ListState<T>>
) {
  return createSlice({
    name,
    initialState: { items: createAsyncState<T[]>([]) } as ListState<T>,
    reducers: {
      fetchRequest(state) {
        state.items.status = 'loading';
        state.items.error = null;
      },
      fetchSuccess(state, action: PayloadAction<T[]>) {
        state.items.status = 'succeeded';
        state.items.data = action.payload as any;
      },
      fetchFailure(state, action: PayloadAction<string>) {
        state.items.status = 'failed';
        state.items.error = action.payload;
      },
      createRequest(state, _action: PayloadAction<Omit<T, 'id'>>) {
        state.items.status = 'loading';
        state.lastAction = undefined;
      },
      createSuccess(state, action: PayloadAction<T>) {
        state.items.status = 'succeeded';
        (state.items.data as any[]).push(action.payload);
        state.lastAction = { type: 'create', status: 'success' };
      },
      createFailure(state, action: PayloadAction<string>) {
        state.items.status = 'failed';
        state.items.error = action.payload;
        state.lastAction = { type: 'create', status: 'error', message: action.payload };
      },
      updateRequest(state, _action: PayloadAction<{ id: number; data: Omit<T, 'id'> }>) {
        state.items.status = 'loading';
        state.lastAction = undefined;
      },
      updateSuccess(state, action: PayloadAction<T & { id: number }>) {
        state.items.status = 'succeeded';
        state.items.data = (state.items.data as any[]).map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        ) as any;
        state.lastAction = { type: 'update', status: 'success' };
      },
      updateFailure(state, action: PayloadAction<string>) {
        state.items.status = 'failed';
        state.items.error = action.payload;
        state.lastAction = { type: 'update', status: 'error', message: action.payload };
      },
      deleteRequest(state, _action: PayloadAction<number>) {
        state.items.status = 'loading';
        state.lastAction = undefined;
      },
      deleteSuccess(state, action: PayloadAction<number>) {
        state.items.status = 'succeeded';
        state.items.data = (state.items.data as any[]).filter((item: any) => item.id !== action.payload) as any;
        state.lastAction = { type: 'delete', status: 'success' };
      },
      deleteFailure(state, action: PayloadAction<string>) {
        state.items.status = 'failed';
        state.items.error = action.payload;
        state.lastAction = { type: 'delete', status: 'error', message: action.payload };
      },
      resetLastAction(state) {
        state.lastAction = undefined;
      },
      ...extraReducers,
    },
  });
}
