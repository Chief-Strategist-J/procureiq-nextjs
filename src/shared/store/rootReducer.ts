import { combineReducers } from '@reduxjs/toolkit';
import campaignsReducer from '@/features/campaigns/campaignsSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import jobsReducer from '@/features/jobs/jobsSlice';
import fieldServiceReducer from '@/features/fieldService/fieldServiceSlice';
import remindersReducer from '@/features/reminders/remindersSlice';
import workflowsReducer from '@/features/workflows/workflowsSlice';

export const rootReducer = combineReducers({
  campaigns: campaignsReducer,
  notifications: notificationsReducer,
  jobs: jobsReducer,
  fieldService: fieldServiceReducer,
  reminders: remindersReducer,
  workflows: workflowsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
