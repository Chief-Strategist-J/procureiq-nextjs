import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginInput, SignupInput, UserProfile } from '../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  status: 'idle',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state, _action: PayloadAction<LoginInput>) {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: UserProfile; token: string }>) {
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload ?? 'Authentication failed';
    },
    signupRequest(state, _action: PayloadAction<SignupInput>) {
      state.status = 'loading';
      state.error = null;
    },
    signupSuccess(state, action: PayloadAction<{ user: UserProfile; token: string }>) {
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    signupFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload ?? 'Registration failed';
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
    resetAuthStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;
