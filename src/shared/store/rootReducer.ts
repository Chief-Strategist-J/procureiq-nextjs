import { combineReducers } from '@reduxjs/toolkit';
import campaignsReducer from '@/features/campaigns/campaignsSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import jobsReducer from '@/features/jobs/jobsSlice';
import fieldServiceReducer from '@/features/fieldService/fieldServiceSlice';
import remindersReducer from '@/features/reminders/remindersSlice';
import workflowsReducer from '@/features/workflows/workflowsSlice';
import emailReducer from '@/features/email/emailSlice';
import githubReducer from '@/features/github/githubSlice';
import sessionsReducer from '@/features/sessions/sessionsSlice';
import workOrdersReducer from '@/features/workOrders/workOrdersSlice';
import signupReducer from '@/features/signup/signupSlice';

import cryptoReducer from '@/features/crypto/cryptoSlice';

export const rootReducer = combineReducers({
  campaigns: campaignsReducer,
  notifications: notificationsReducer,
  jobs: jobsReducer,
  fieldService: fieldServiceReducer,
  reminders: remindersReducer,
  workflows: workflowsReducer,
  email: emailReducer,
  github: githubReducer,
  sessions: sessionsReducer,
  workOrders: workOrdersReducer,
  signup: signupReducer,
  crypto: cryptoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
