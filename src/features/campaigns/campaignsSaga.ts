import { call, put, takeLatest } from 'redux-saga/effects';
import { campaignsActions } from './campaignsSlice';
import { CampaignsApi } from '@/app/campaigns/api-client';

function* fetchCampaignsSaga() {
  try {
    const data: Awaited<ReturnType<typeof CampaignsApi.listCampaigns>> = yield call([CampaignsApi, CampaignsApi.listCampaigns]);
    yield put(campaignsActions.fetchCampaignsSuccess(data));
  } catch (e: any) {
    yield put(campaignsActions.fetchCampaignsFailure(e.message));
  }
}

function* createCampaignSaga(action: ReturnType<typeof campaignsActions.createCampaignRequest>) {
  try {
    const data: Awaited<ReturnType<typeof CampaignsApi.createCampaign>> = yield call([CampaignsApi, CampaignsApi.createCampaign], action.payload);
    yield put(campaignsActions.createCampaignSuccess(data));
  } catch (e: any) {
    yield put(campaignsActions.createCampaignFailure(e.message));
  }
}

function* updateCampaignSaga(action: ReturnType<typeof campaignsActions.updateCampaignRequest>) {
  try {
    const data: Awaited<ReturnType<typeof CampaignsApi.updateCampaign>> = yield call([CampaignsApi, CampaignsApi.updateCampaign], action.payload.id, action.payload.data);
    yield put(campaignsActions.updateCampaignSuccess(data));
  } catch (e: any) {
    yield put(campaignsActions.updateCampaignFailure(e.message));
  }
}

function* deleteCampaignSaga(action: ReturnType<typeof campaignsActions.deleteCampaignRequest>) {
  try {
    yield call([CampaignsApi, CampaignsApi.deleteCampaign], action.payload);
    yield put(campaignsActions.deleteCampaignSuccess(action.payload));
  } catch (e: any) {
    yield put(campaignsActions.deleteCampaignFailure(e.message));
  }
}

function* fetchRecipientsSaga() {
  try {
    const data: Awaited<ReturnType<typeof CampaignsApi.listRecipients>> = yield call([CampaignsApi, CampaignsApi.listRecipients]);
    yield put(campaignsActions.fetchRecipientsSuccess(data));
  } catch (e: any) {
    yield put(campaignsActions.fetchRecipientsFailure(e.message));
  }
}

function* fetchSchedulesSaga() {
  try {
    const data: Awaited<ReturnType<typeof CampaignsApi.listSchedules>> = yield call([CampaignsApi, CampaignsApi.listSchedules]);
    yield put(campaignsActions.fetchSchedulesSuccess(data));
  } catch (e: any) {
    yield put(campaignsActions.fetchSchedulesFailure(e.message));
  }
}

export function* campaignsSaga() {
  yield takeLatest(campaignsActions.fetchCampaignsRequest.type, fetchCampaignsSaga);
  yield takeLatest(campaignsActions.createCampaignRequest.type, createCampaignSaga);
  yield takeLatest(campaignsActions.updateCampaignRequest.type, updateCampaignSaga);
  yield takeLatest(campaignsActions.deleteCampaignRequest.type, deleteCampaignSaga);
  yield takeLatest(campaignsActions.fetchRecipientsRequest.type, fetchRecipientsSaga);
  yield takeLatest(campaignsActions.fetchSchedulesRequest.type, fetchSchedulesSaga);
}
