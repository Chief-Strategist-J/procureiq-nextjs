import { all, call, put, takeLatest, Effect } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { HttpClient } from '@/lib/http-client';
import { resolveRules } from '@/core/rules-engine/evaluate';
import { authActions } from './auth-slice';
import { loginApi, signupApi, LoginResponsePayload, UserResponsePayload } from '../services/auth-api';
import { LoginInput, SignupInput } from '../types';
import { AuthValidator } from '../utils/validation';
import { ValidationResult } from '../validation/types';
import { AUTH_MESSAGES } from '../constants';
import { AUTH_ERROR_RULES, AuthDialogType } from '../rules/auth.rules';

async function resolveDialogType(errorMessage: string): Promise<AuthDialogType> {
  const matched = await resolveRules(AUTH_ERROR_RULES, { errorMessage });
  return (matched[0]?.effect.value as AuthDialogType) ?? 'error';
}

export function* handleLoginSaga(action: PayloadAction<LoginInput>): Generator<Effect, void, any> {
  try {
    const response: LoginResponsePayload = yield call(loginApi, action.payload);
    if (response?.token) {
      HttpClient.setAuthToken(response.token);
    }
    yield put(authActions.loginSuccess(response));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : AUTH_MESSAGES.LOGIN_FAILED;
    const dialogType: AuthDialogType = yield call(resolveDialogType, errorMessage);
    yield put(authActions.loginFailure({ message: errorMessage, dialogType }));
  }
}

export function* handleSignupSaga(action: PayloadAction<SignupInput>): Generator<Effect, void, any> {
  try {
    const response: UserResponsePayload = yield call(signupApi, action.payload);
    if (response?.token) {
      HttpClient.setAuthToken(response.token);
      yield put(authActions.loginSuccess({ user: response.user, token: response.token }));
    } else {
      yield put(authActions.signupSuccess({ user: response.user, token: '' }));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : AUTH_MESSAGES.REGISTRATION_FAILED;
    const dialogType: AuthDialogType = yield call(resolveDialogType, errorMessage);
    yield put(authActions.signupFailure({ message: errorMessage, dialogType }));
  }
}

export function* handleSubmitLoginFormSaga(
  action: PayloadAction<{ input: LoginInput; customSubmit?: (data: LoginInput) => void }>
): Generator<Effect, void, ValidationResult> {
  const { input, customSubmit } = action.payload;

  const validation: ValidationResult = yield call([AuthValidator, AuthValidator.validateLoginForm], input);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0] ?? AUTH_MESSAGES.DEFAULT_ERROR;
    yield put(authActions.setValidationErrors({ errors: validation.errors, message: firstError }));
    return;
  }

  yield put(authActions.loginRequest(input));

  if (customSubmit) {
    yield call(customSubmit, input);
  } else {
    yield call(handleLoginSaga, authActions.loginRequest(input));
  }
}

export function* handleSubmitSignupFormSaga(
  action: PayloadAction<{ input: SignupInput; customSubmit?: (data: SignupInput) => void }>
): Generator<Effect, void, ValidationResult> {
  const { input, customSubmit } = action.payload;

  const validation: ValidationResult = yield call([AuthValidator, AuthValidator.validateSignupForm], input);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0] ?? AUTH_MESSAGES.DEFAULT_ERROR;
    yield put(authActions.setValidationErrors({ errors: validation.errors, message: firstError }));
    return;
  }

  yield put(authActions.signupRequest(input));

  if (customSubmit) {
    yield call(customSubmit, input);
  } else {
    yield call(handleSignupSaga, authActions.signupRequest(input));
  }
}

export function* authSaga(): Generator<Effect, void, void> {
  yield all([
    takeLatest(authActions.loginRequest.type, handleLoginSaga),
    takeLatest(authActions.signupRequest.type, handleSignupSaga),
    takeLatest(authActions.submitLoginForm.type, handleSubmitLoginFormSaga),
    takeLatest(authActions.submitSignupForm.type, handleSubmitSignupFormSaga),
  ]);
}
