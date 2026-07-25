import { all, fork } from 'redux-saga/effects';
import { remindersSaga } from '@/features/reminders/remindersSaga';
import { workflowsSaga } from '@/features/workflows/workflowsSaga';
import { workOrdersSaga } from '@/features/workOrders/workOrdersSaga';

export function* rootSaga() {
  yield all([
    fork(remindersSaga),
    fork(workflowsSaga),
    fork(workOrdersSaga),
  ]);
}
