import { createSlice, PayloadAction, SliceCaseReducers, CreateSliceOptions } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';

export interface ListState<T> {
  items: AsyncState<T[]>;
}

export function createListSlice<T>(
  name: string,
  extraReducers?: SliceCaseReducers<ListState<T>>
) {
  return createSlice({
    name,
    initialState: { items: createAsyncState<T[]>([]) } as ListState<T>,
    reducers: {
      fetchRequest(state: ListState<T>) {
        state.items.status = 'loading';
        state.items.error = null;
      },
      fetchSuccess(state: ListState<T>, action: PayloadAction<T[]>) {
        state.items.status = 'succeeded';
        state.items.data = action.payload;
      },
      fetchFailure(state: ListState<T>, action: PayloadAction<string>) {
        state.items.status = 'failed';
        state.items.error = action.payload;
      },
      createRequest(state: ListState<T>, _action: PayloadAction<Omit<T, 'id'>>) {
        state.items.status = 'loading';
      },
      createSuccess(state: ListState<T>, action: PayloadAction<T>) {
        state.items.status = 'succeeded';
        (state.items.data as any[]).push(action.payload);
      },
      createFailure(state: ListState<T>, action: PayloadAction<string>) {
        state.items.status = 'failed';
        state.items.error = action.payload;
      },
      updateRequest(state: ListState<T>, _action: PayloadAction<{ id: number; data: Omit<T, 'id'> }>) {
        state.items.status = 'loading';
      },
      updateSuccess(state: ListState<T>, action: PayloadAction<T & { id: number }>) {
        state.items.status = 'succeeded';
        state.items.data = (state.items.data as any[]).map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      },
      updateFailure(state: ListState<T>, action: PayloadAction<string>) {
        state.items.status = 'failed';
        state.items.error = action.payload;
      },
      deleteRequest(state: ListState<T>, _action: PayloadAction<number>) {
        state.items.status = 'loading';
      },
      deleteSuccess(state: ListState<T>, action: PayloadAction<number>) {
        state.items.status = 'succeeded';
        state.items.data = (state.items.data as any[]).filter((item: any) => item.id !== action.payload);
      },
      deleteFailure(state: ListState<T>, action: PayloadAction<string>) {
        state.items.status = 'failed';
        state.items.error = action.payload;
      },
      ...extraReducers,
    },
  });
}
