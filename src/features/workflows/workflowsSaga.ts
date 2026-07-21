import { call, put, takeLatest } from 'redux-saga/effects';
import { workflowsActions } from './workflowsSlice';
import { WorkflowsApi } from '@/app/workflows/api-client';

function* fetchSaga() {
  try {
    const data: Awaited<ReturnType<typeof WorkflowsApi.listWorkflows>> = yield call([WorkflowsApi, WorkflowsApi.listWorkflows]);
    yield put(workflowsActions.fetchSuccess(data));
  } catch (e: any) {
    yield put(workflowsActions.fetchFailure(e.message));
  }
}

function* createSaga(action: ReturnType<typeof workflowsActions.createRequest>) {
  try {
    const data: Awaited<ReturnType<typeof WorkflowsApi.createWorkflow>> = yield call([WorkflowsApi, WorkflowsApi.createWorkflow], action.payload);
    yield put(workflowsActions.createSuccess(data));
  } catch (e: any) {
    yield put(workflowsActions.createFailure(e.message));
  }
}

function* updateSaga(action: ReturnType<typeof workflowsActions.updateRequest>) {
  try {
    const data: Awaited<ReturnType<typeof WorkflowsApi.updateWorkflow>> = yield call([WorkflowsApi, WorkflowsApi.updateWorkflow], action.payload.id, action.payload.data);
    yield put(workflowsActions.updateSuccess(data));
  } catch (e: any) {
    yield put(workflowsActions.updateFailure(e.message));
  }
}

function* deleteSaga(action: ReturnType<typeof workflowsActions.deleteRequest>) {
  try {
    yield call([WorkflowsApi, WorkflowsApi.deleteWorkflow], action.payload);
    yield put(workflowsActions.deleteSuccess(action.payload));
  } catch (e: any) {
    yield put(workflowsActions.deleteFailure(e.message));
  }
}

function* triggerSaga(action: ReturnType<typeof workflowsActions.triggerRequest>) {
  try {
    const data: Awaited<ReturnType<typeof WorkflowsApi.triggerRun>> = yield call([WorkflowsApi, WorkflowsApi.triggerRun], action.payload);
    yield put(workflowsActions.triggerSuccess(data));
  } catch (e: any) {
    yield put(workflowsActions.triggerFailure(e.message));
  }
}

export function* workflowsSaga() {
  yield takeLatest(workflowsActions.fetchRequest.type as any, fetchSaga);
  yield takeLatest(workflowsActions.createRequest.type as any, createSaga);
  yield takeLatest(workflowsActions.updateRequest.type as any, updateSaga);
  yield takeLatest(workflowsActions.deleteRequest.type as any, deleteSaga);
  yield takeLatest(workflowsActions.triggerRequest.type as any, triggerSaga);
}
