import { call, put, takeEvery } from "redux-saga/effects";
import { eventBus } from "@core/event-bus/event-bus";
import type { CrudPort } from "./create-entity-adapter";

export function createEntitySagas<T extends { id: string }>(name: string, adapter: CrudPort<T>, slice: any) {
  function* fetchAll() {
    yield put(slice.actions.setStatus("loading"));
    try {
      const items: T[] = yield call(adapter.list);
      yield put(slice.actions.setAll(items));
      yield put(slice.actions.setStatus("idle"));
    } catch {
      yield put(slice.actions.setStatus("error"));
    }
  }
  function* createOne(action: { payload: Partial<T>; type: string }) {
    try {
      const item: T = yield call(adapter.create, action.payload);
      yield put(slice.actions.upsertOne(item));
      eventBus.emit(`${name}.created`, item);
    } catch (err) {
      console.error(`Error creating entity in saga ${name}`, err);
    }
  }
  function* removeOne(action: { payload: string; type: string }) {
    try {
      yield call(adapter.remove, action.payload);
      yield put(slice.actions.removeOne(action.payload));
      eventBus.emit(`${name}.removed`, { id: action.payload });
    } catch (err) {
      console.error(`Error removing entity in saga ${name}`, err);
    }
  }
  return function* rootSaga() {
    yield takeEvery(`${name}/fetchAll`, fetchAll);
    yield takeEvery(`${name}/createOne`, createOne);
    yield takeEvery(`${name}/removeOne`, removeOne);
  };
}
