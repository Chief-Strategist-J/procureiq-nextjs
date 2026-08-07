import { call, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { authActions } from './auth-slice';
import { loginApi, signupApi } from '../services/auth-api';
import { LoginInput, SignupInput } from '../types';
import { HttpClient } from '@/lib/http-client';

export function* handleLoginSaga(action: PayloadAction<LoginInput>): Generator<any, void, any> {
  try {
    const response = yield call(loginApi, action.payload);
    if (response?.token) {
      HttpClient.setAuthToken(response.token);
    }
    yield put(authActions.loginSuccess(response));
  } catch (error: any) {
    yield put(authActions.loginFailure(error?.message || 'Login failed'));
  }
}

export function* handleSignupSaga(action: PayloadAction<SignupInput>): Generator<any, void, any> {
  try {
    const response = yield call(signupApi, action.payload);
    if (response?.token) {
      HttpClient.setAuthToken(response.token);
    }
    yield put(
      authActions.signupSuccess({
        user: response.user,
        token: response.token || '',
      })
    );
  } catch (error: any) {
    yield put(authActions.signupFailure(error?.message || 'Registration failed'));
  }
}

import { all, takeLatest } from 'redux-saga/effects';

export function* authSaga(): Generator<any, void, any> {
  yield all([
    takeLatest(authActions.loginRequest.type, handleLoginSaga),
    takeLatest(authActions.signupRequest.type, handleSignupSaga),
  ]);
}
