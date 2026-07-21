import { takeLatest, call, put } from "redux-saga/effects";
import { WorkOrdersApi } from "@/app/work-orders/api-client";
import { workOrdersActions } from "./workOrdersSlice";

function* fetchWorkOrdersSaga() {
  try {
    const data: Awaited<ReturnType<typeof WorkOrdersApi.list>> = yield call([WorkOrdersApi, WorkOrdersApi.list]);
    yield put(workOrdersActions.fetchSuccess(data));
  } catch (e: any) {
    yield put(workOrdersActions.fetchFailure(e.message));
  }
}

function* createWorkOrderSaga(action: ReturnType<typeof workOrdersActions.createRequest>) {
  try {
    const data: Awaited<ReturnType<typeof WorkOrdersApi.create>> = yield call([WorkOrdersApi, WorkOrdersApi.create], action.payload);
    yield put(workOrdersActions.createSuccess(data));
  } catch (e: any) {
    yield put(workOrdersActions.createFailure(e.message));
  }
}

function* updateWorkOrderSaga(action: ReturnType<typeof workOrdersActions.updateRequest>) {
  try {
    const data: Awaited<ReturnType<typeof WorkOrdersApi.update>> = yield call(
      [WorkOrdersApi, WorkOrdersApi.update],
      String(action.payload.id),
      action.payload.data
    );
    yield put(workOrdersActions.updateSuccess({ ...data, id: action.payload.id }));
  } catch (e: any) {
    yield put(workOrdersActions.updateFailure(e.message));
  }
}

function* deleteWorkOrderSaga(action: ReturnType<typeof workOrdersActions.deleteRequest>) {
  try {
    yield call([WorkOrdersApi, WorkOrdersApi.delete], String(action.payload));
    yield put(workOrdersActions.deleteSuccess(action.payload));
  } catch (e: any) {
    yield put(workOrdersActions.deleteFailure(e.message));
  }
}

export function* workOrdersSaga() {
  yield takeLatest(workOrdersActions.fetchRequest.type as any, fetchWorkOrdersSaga);
  yield takeLatest(workOrdersActions.createRequest.type as any, createWorkOrderSaga);
  yield takeLatest(workOrdersActions.updateRequest.type as any, updateWorkOrderSaga);
  yield takeLatest(workOrdersActions.deleteRequest.type as any, deleteWorkOrderSaga);
}
