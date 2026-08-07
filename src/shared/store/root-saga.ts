import { all, fork } from 'redux-saga/effects';
import { featureRegistry } from '@/core/store/feature-registry';

export function* rootSaga() {
  const sagas = featureRegistry
    .getAll()
    .map(([, mod]) => mod.saga)
    .filter((saga): saga is () => Generator => !!saga);

  yield all(sagas.map((saga) => fork(saga)));
}
