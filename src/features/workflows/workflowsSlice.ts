import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsyncState, createAsyncState } from '@/shared/types/asyncState';
import { Workflow, WorkflowRun } from '@/app/workflows/api-client';
import { ListUiState, initialListUiState } from '@/shared/store/createListSlice';

export interface WorkflowsState {
  items: AsyncState<Workflow[]> & { ui: ListUiState };
  runs: AsyncState<WorkflowRun[]>;
}

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState: {
    items: {
      ...createAsyncState<Workflow[]>([]),
      ui: initialListUiState,
    },
    runs: createAsyncState<WorkflowRun[]>([]),
  } as WorkflowsState,
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
      state.items.ui.isModalOpen = false;
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
      state.items.ui.isModalOpen = false;
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
