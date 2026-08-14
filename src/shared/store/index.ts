import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { uiSlice } from './ui-slice';
import { featureRegistry } from '@/core/store/feature-registry';

// Registry imports for dynamic self-registering features
import '@/features/auth';

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

export type RootState = {
  ui: ReturnType<typeof uiSlice.reducer>;
  auth: ExtendedAuthState;
};
export type AppDispatch = typeof store.dispatch;
