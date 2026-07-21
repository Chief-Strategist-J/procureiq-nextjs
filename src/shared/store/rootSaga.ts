import { all, fork } from 'redux-saga/effects';
import { campaignsSaga } from '@/features/campaigns/campaignsSaga';
import { notificationsSaga } from '@/features/notifications/notificationsSaga';
import { jobsSaga } from '@/features/jobs/jobsSaga';
import { fieldServiceSaga } from '@/features/fieldService/fieldServiceSaga';
import { remindersSaga } from '@/features/reminders/remindersSaga';
import { workflowsSaga } from '@/features/workflows/workflowsSaga';

export function* rootSaga() {
  yield all([
    fork(campaignsSaga),
    fork(notificationsSaga),
    fork(jobsSaga),
    fork(fieldServiceSaga),
    fork(remindersSaga),
    fork(workflowsSaga),
  ]);
}
