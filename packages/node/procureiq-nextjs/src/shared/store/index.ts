import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { uiSlice } from './ui-slice';
import { featureRegistry } from '@/core/store/feature-registry';

import '@/features/auth';
import '@/features/identity';
import '@/features/tvm';

import { rootSaga } from './root-saga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    ...Object.fromEntries(featureRegistry.getAll().map(([name, mod]) => [name, mod.reducer])),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

import { ExtendedAuthState } from '@/features/auth/store/auth-slice';
import { IdentityState } from '@/features/identity/types';
import { TvmState } from '@/features/tvm/store/tvm-slice';

export type RootState = {
  ui: ReturnType<typeof uiSlice.reducer>;
  auth: ExtendedAuthState;
  identity: IdentityState;
  tvm: TvmState;
};
export type AppDispatch = typeof store.dispatch;
