import { all, takeLatest } from 'redux-saga/effects';
import { authActions } from '@/features/auth/store/auth-slice';
import { handleLoginSaga, handleSignupSaga } from '@/features/auth/store/auth-saga';

const sagaTable = [
  { action: authActions.loginRequest, handler: handleLoginSaga },
  { action: authActions.signupRequest, handler: handleSignupSaga },
] as const;

export function* rootSaga() {
  yield all(
    sagaTable.map(({ action, handler }) => takeLatest(action.type, handler))
  );
}
