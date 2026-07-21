import { call, put, takeLatest } from 'redux-saga/effects';
import { fieldServiceActions } from './fieldServiceSlice';
import { FieldServiceApi } from '@/app/field-service/api-client';

function* fetchOperatingHoursSaga() {
  try {
    const data: Awaited<ReturnType<typeof FieldServiceApi.listOperatingHours>> = yield call([FieldServiceApi, FieldServiceApi.listOperatingHours]);
    yield put(fieldServiceActions.fetchOperatingHoursSuccess(data));
  } catch (e: any) {
    yield put(fieldServiceActions.fetchOperatingHoursFailure(e.message));
  }
}

function* fetchTerritoriesSaga() {
  try {
    const data: Awaited<ReturnType<typeof FieldServiceApi.listTerritories>> = yield call([FieldServiceApi, FieldServiceApi.listTerritories]);
    yield put(fieldServiceActions.fetchTerritoriesSuccess(data));
  } catch (e: any) {
    yield put(fieldServiceActions.fetchTerritoriesFailure(e.message));
  }
}

function* fetchResourcesSaga() {
  try {
    const data: Awaited<ReturnType<typeof FieldServiceApi.listResources>> = yield call([FieldServiceApi, FieldServiceApi.listResources]);
    yield put(fieldServiceActions.fetchResourcesSuccess(data));
  } catch (e: any) {
    yield put(fieldServiceActions.fetchResourcesFailure(e.message));
  }
}

function* fetchAppointmentsSaga() {
  try {
    const data: Awaited<ReturnType<typeof FieldServiceApi.listAppointments>> = yield call([FieldServiceApi, FieldServiceApi.listAppointments]);
    yield put(fieldServiceActions.fetchAppointmentsSuccess(data));
  } catch (e: any) {
    yield put(fieldServiceActions.fetchAppointmentsFailure(e.message));
  }
}

function* assignResourceSaga(action: ReturnType<typeof fieldServiceActions.assignResourceRequest>) {
  try {
    yield call([FieldServiceApi, FieldServiceApi.assignResource], action.payload.appointmentId, action.payload.resourceId);
    yield put(fieldServiceActions.assignResourceSuccess());
    yield put(fieldServiceActions.fetchAppointmentsRequest());
  } catch (e: any) {
    yield put(fieldServiceActions.assignResourceFailure(e.message));
  }
}

export function* fieldServiceSaga() {
  yield takeLatest(fieldServiceActions.fetchOperatingHoursRequest.type, fetchOperatingHoursSaga);
  yield takeLatest(fieldServiceActions.fetchTerritoriesRequest.type, fetchTerritoriesSaga);
  yield takeLatest(fieldServiceActions.fetchResourcesRequest.type, fetchResourcesSaga);
  yield takeLatest(fieldServiceActions.fetchAppointmentsRequest.type, fetchAppointmentsSaga);
  yield takeLatest(fieldServiceActions.assignResourceRequest.type, assignResourceSaga);
}
