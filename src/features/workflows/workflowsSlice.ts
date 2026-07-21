import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';
import { Workflow, WorkflowRun } from '@/app/workflows/api-client';

export interface WorkflowsState {
  items: AsyncState<Workflow[]>;
  runs: AsyncState<WorkflowRun[]>;
}

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState: {
    items: createAsyncState<Workflow[]>([]),
    runs: createAsyncState<WorkflowRun[]>([]),
  } as WorkflowsState,
  reducers: {
    fetchRequest(state) {
      state.items.status = 'loading';
      state.items.error = null;
      state.items.lastAction = null;
    },
    fetchSuccess(state, action: PayloadAction<Workflow[]>) {
      state.items.status = 'succeeded';
      state.items.data = action.payload;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.items.status = 'failed';
      state.items.error = action.payload;
    },
    createRequest(state, _action: PayloadAction<Omit<Workflow, 'id'>>) {
      state.items.status = 'loading';
      state.items.error = null;
      state.items.lastAction = null;
    },
    createSuccess(state, action: PayloadAction<Workflow>) {
      state.items.status = 'succeeded';
      state.items.data.push(action.payload);
      state.items.lastAction = 'Workflow created successfully.';
    },
    createFailure(state, action: PayloadAction<string>) {
      state.items.status = 'failed';
      state.items.error = action.payload;
    },
    updateRequest(state, _action: PayloadAction<{ id: number; data: Omit<Workflow, 'id'> }>) {
      state.items.status = 'loading';
      state.items.error = null;
      state.items.lastAction = null;
    },
    updateSuccess(state, action: PayloadAction<Workflow>) {
      state.items.status = 'succeeded';
      state.items.data = state.items.data.map(w => w.id === action.payload.id ? action.payload : w);
      state.items.lastAction = 'Workflow updated successfully.';
    },
    updateFailure(state, action: PayloadAction<string>) {
      state.items.status = 'failed';
      state.items.error = action.payload;
    },
    deleteRequest(state, _action: PayloadAction<number>) {
      state.items.status = 'loading';
      state.items.error = null;
      state.items.lastAction = null;
    },
    deleteSuccess(state, action: PayloadAction<number>) {
      state.items.status = 'succeeded';
      state.items.data = state.items.data.filter(w => w.id !== action.payload);
      state.items.lastAction = 'Workflow deleted.';
    },
    deleteFailure(state, action: PayloadAction<string>) {
      state.items.status = 'failed';
      state.items.error = action.payload;
    },
    triggerRequest(state, _action: PayloadAction<number>) {
      state.runs.status = 'loading';
      state.runs.lastAction = null;
    },
    triggerSuccess(state, action: PayloadAction<WorkflowRun>) {
      state.runs.status = 'succeeded';
      state.runs.data.push(action.payload);
      state.runs.lastAction = 'Workflow run triggered.';
    },
    triggerFailure(state, action: PayloadAction<string>) {
      state.runs.status = 'failed';
      state.runs.error = action.payload;
    },
  },
});

export const workflowsActions = workflowsSlice.actions;
export default workflowsSlice.reducer;
