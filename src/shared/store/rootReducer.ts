import { combineReducers } from '@reduxjs/toolkit';
import remindersReducer from '@/features/reminders/remindersSlice';
import workflowsReducer from '@/features/workflows/workflowsSlice';
import workOrdersReducer from '@/features/workOrders/workOrdersSlice';

export const rootReducer = combineReducers({
  reminders: remindersReducer,
  workflows: workflowsReducer,
  workOrders: workOrdersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
