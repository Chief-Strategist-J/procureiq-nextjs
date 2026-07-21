import { all, fork } from 'redux-saga/effects';
import { campaignsSaga } from '@/features/campaigns/campaignsSaga';
import { notificationsSaga } from '@/features/notifications/notificationsSaga';
import { jobsSaga } from '@/features/jobs/jobsSaga';
import { fieldServiceSaga } from '@/features/fieldService/fieldServiceSaga';
import { remindersSaga } from '@/features/reminders/remindersSaga';
import { workflowsSaga } from '@/features/workflows/workflowsSaga';
import { emailSaga } from '@/features/email/emailSaga';
import { githubSaga } from '@/features/github/githubSaga';
import { sessionsSaga } from '@/features/sessions/sessionsSaga';
import { workOrdersSaga } from '@/features/workOrders/workOrdersSaga';
import { signupSaga } from '@/features/signup/signupSaga';

export function* rootSaga() {
  yield all([
    fork(campaignsSaga),
    fork(notificationsSaga),
    fork(jobsSaga),
    fork(fieldServiceSaga),
    fork(remindersSaga),
    fork(workflowsSaga),
      fork(emailSaga),
    fork(githubSaga),
    fork(sessionsSaga),
    fork(workOrdersSaga),
    fork(signupSaga),
]);
}
