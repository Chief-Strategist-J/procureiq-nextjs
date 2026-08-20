import { all, call, put, select, takeLatest, Effect } from 'redux-saga/effects';
import { TelemetryService } from '@/lib/telemetry';
import { API_ENDPOINTS, PYTHON_AI_BASE_URL } from '@/lib/api-endpoints';
import { tvmActions, TvmParams, TimesfmForecastData } from './tvm-slice';

async function executeTimesfmForecastApi(params: TvmParams, userRole?: string, userId?: string): Promise<TimesfmForecastData> {
  const span = TelemetryService.createSpan('tvm-ai-forecast');
  const url = `${PYTHON_AI_BASE_URL}${API_ENDPOINTS.TVM_AI.FORECAST}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trace-Id': span.traceId,
      'X-Correlation-Id': span.correlationId,
      'X-User-Role': userRole || 'accountant',
      'X-User-Id': userId || '1',
      traceparent: span.traceParent,
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`TVM Forecast Request Failed: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export function* fetchForecastSaga(): Generator<Effect, void, any> {
  try {
    const params: TvmParams = yield select((state: any) => state.tvm.params);
    const user: any = yield select((state: any) => state.auth.user);

    const data: TimesfmForecastData = yield call(
      executeTimesfmForecastApi,
      params,
      user?.role || 'accountant',
      user?.id || '1'
    );
    yield put(tvmActions.fetchForecastSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'TVM Forecast Failed';
    yield put(tvmActions.fetchForecastFailure(message));
  }
}

export function* tvmSaga(): Generator<Effect, void, any> {
  yield all([
    takeLatest(tvmActions.fetchForecastStart.type, fetchForecastSaga),
  ]);
}
