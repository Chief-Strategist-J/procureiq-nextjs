import { call, put } from 'redux-saga/effects';

export function createFetchSaga<T>(
  fetchFn: () => Promise<T[]>,
  successAction: (data: T[]) => any,
  failureAction: (msg: string) => any
) {
  return function* () {
    try {
      const data: T[] = yield call(fetchFn);
      yield put(successAction(data));
    } catch (e: any) {
      yield put(failureAction(e.message));
    }
  };
}

export function createMutateSaga<TPayload, TResult>(
  mutateFn: (payload: TPayload) => Promise<TResult>,
  successAction: (data: TResult) => any,
  failureAction: (msg: string) => any
) {
  return function* (action: { payload: TPayload }) {
    try {
      const data: TResult = yield call(mutateFn as any, action.payload);
      yield put(successAction(data));
    } catch (e: any) {
      yield put(failureAction(e.message));
    }
  };
}
