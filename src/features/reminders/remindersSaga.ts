import { call, put, takeLatest } from 'redux-saga/effects';
import { remindersActions } from './remindersSlice';
import { RemindersApi } from '@/app/reminders/api-client';

function* fetchSaga() {
  try {
    const data: Awaited<ReturnType<typeof RemindersApi.listReminders>> = yield call([RemindersApi, RemindersApi.listReminders]);
    yield put(remindersActions.fetchSuccess(data));
  } catch (e: any) { yield put(remindersActions.fetchFailure(e.message)); }
}

function* createSaga(action: ReturnType<typeof remindersActions.createRequest>) {
  try {
    const data: Awaited<ReturnType<typeof RemindersApi.createReminder>> = yield call([RemindersApi, RemindersApi.createReminder], action.payload);
    yield put(remindersActions.createSuccess(data));
  } catch (e: any) { yield put(remindersActions.createFailure(e.message)); }
}

function* updateSaga(action: ReturnType<typeof remindersActions.updateRequest>) {
  try {
    const data: Awaited<ReturnType<typeof RemindersApi.updateReminder>> = yield call([RemindersApi, RemindersApi.updateReminder], action.payload.id, action.payload.data);
    yield put(remindersActions.updateSuccess(data));
  } catch (e: any) { yield put(remindersActions.updateFailure(e.message)); }
}

function* deleteSaga(action: ReturnType<typeof remindersActions.deleteRequest>) {
  try {
    yield call([RemindersApi, RemindersApi.deleteReminder], action.payload);
    yield put(remindersActions.deleteSuccess(action.payload));
  } catch (e: any) { yield put(remindersActions.deleteFailure(e.message)); }
}

export function* remindersSaga() {
  yield takeLatest(remindersActions.fetchRequest.type, fetchSaga);
  yield takeLatest(remindersActions.createRequest.type, createSaga);
  yield takeLatest(remindersActions.updateRequest.type, updateSaga);
  yield takeLatest(remindersActions.deleteRequest.type, deleteSaga);
}
