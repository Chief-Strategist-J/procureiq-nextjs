import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginInput, SignupInput, UserProfile, UserRole } from '../types';
import { AuthDialogType } from '../rules/auth.rules';
import { AUTH_STATUS } from '../constants';

// 24-hour session TTL in milliseconds (86,400,000 ms)
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE_SEC = 24 * 60 * 60; // 86,400 seconds

interface LoginFormFields {
  email: string;
  password: string;
  role: UserRole;
  showPassword: boolean;
}

interface SignupFormFields {
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  companyName: string;
  tenantId: string;
  role: UserRole;
  roles: UserRole[];
  agreeToTerms: boolean;
  roleMetadata: Record<string, string | number | boolean>;
}

interface DialogState {
  isOpen: boolean;
  type: AuthDialogType | 'success';
  title: string;
  message: string;
  actionText: string;
  redirectTo?: string;
}

export interface ExtendedAuthState extends AuthState {
  loginForm: LoginFormFields;
  signupForm: SignupFormFields;
  fieldErrors: Record<string, string>;
  dialog: DialogState;
}

const DIALOG_CONFIG: Record<AuthDialogType, { title: string; actionText: string }> = {
  lockout: { title: 'Account Temporarily Locked', actionText: 'Try Again' },
  info: { title: 'Account Already Exists', actionText: 'Go to Sign In' },
  error: { title: 'Authentication Error', actionText: 'Try Again' },
};

const initialState: ExtendedAuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  status: AUTH_STATUS.IDLE,
  error: null,
  loginForm: { email: '', password: '', role: 'admin', showPassword: false },
  signupForm: {
    name: '',
    email: '',
    password: '',
    showPassword: false,
    companyName: '',
    tenantId: 'default',
    role: 'user',
    roles: ['user'],
    agreeToTerms: false,
    roleMetadata: {},
  },
  fieldErrors: {},
  dialog: { isOpen: false, type: 'error', title: '', message: '', actionText: 'Try Again' },
};

function persistSessionData(token: string, user: UserProfile) {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
  localStorage.setItem('auth_login_timestamp', now.toString());
  document.cookie = `procureiq_session=active; Max-Age=${SESSION_MAX_AGE_SEC}; Path=/; SameSite=Lax`;
}

function clearSessionData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_login_timestamp');
  document.cookie = 'procureiq_session=; Max-Age=0; Path=/; SameSite=Lax';
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateLoginForm(state, action: PayloadAction<Partial<LoginFormFields>>) {
      state.loginForm = { ...state.loginForm, ...action.payload };
      if (action.payload.email !== undefined && state.fieldErrors.email) state.fieldErrors.email = '';
      if (action.payload.password !== undefined && state.fieldErrors.password) state.fieldErrors.password = '';
    },
    toggleLoginPasswordVisibility(state) {
      state.loginForm.showPassword = !state.loginForm.showPassword;
    },
    updateSignupForm(state, action: PayloadAction<Partial<SignupFormFields>>) {
      state.signupForm = { ...state.signupForm, ...action.payload };
      if (action.payload.name !== undefined && state.fieldErrors.name) state.fieldErrors.name = '';
      if (action.payload.email !== undefined && state.fieldErrors.email) state.fieldErrors.email = '';
      if (action.payload.password !== undefined && state.fieldErrors.password) state.fieldErrors.password = '';
      if (action.payload.companyName !== undefined && state.fieldErrors.companyName) state.fieldErrors.companyName = '';
      if (action.payload.agreeToTerms !== undefined && state.fieldErrors.agreeToTerms) state.fieldErrors.agreeToTerms = '';
    },
    toggleSignupPasswordVisibility(state) {
      state.signupForm.showPassword = !state.signupForm.showPassword;
    },
    setValidationErrors(state, action: PayloadAction<{ errors: Record<string, string>; message: string }>) {
      state.fieldErrors = action.payload.errors;
      state.dialog = {
        isOpen: true,
        type: 'error',
        title: 'Validation Error',
        message: action.payload.message,
        actionText: 'Try Again',
      };
    },
    closeDialog(state) {
      state.dialog.isOpen = false;
      state.error = null;
    },
    submitLoginForm(_state, _action: PayloadAction<{ input: LoginInput; customSubmit?: (data: LoginInput) => void }>) {},
    submitSignupForm(_state, _action: PayloadAction<{ input: SignupInput; customSubmit?: (data: SignupInput) => void }>) {},
    loginRequest(state, _action: PayloadAction<LoginInput>) {
      state.status = AUTH_STATUS.LOADING;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: UserProfile; token: string }>) {
      state.status = AUTH_STATUS.SUCCEEDED;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.fieldErrors = {};
      state.dialog.isOpen = false;
      persistSessionData(action.payload.token, action.payload.user);
    },
    loginFailure(state, action: PayloadAction<{ message: string; dialogType: AuthDialogType }>) {
      state.status = AUTH_STATUS.FAILED;
      state.error = action.payload.message;
      const cfg = DIALOG_CONFIG[action.payload.dialogType];
      state.dialog = {
        isOpen: true,
        type: action.payload.dialogType,
        title: cfg.title,
        message: action.payload.message,
        actionText: cfg.actionText,
      };
    },
    signupRequest(state, _action: PayloadAction<SignupInput>) {
      state.status = AUTH_STATUS.LOADING;
      state.error = null;
    },
    signupSuccess(state, action: PayloadAction<{ user: UserProfile; token: string }>) {
      state.status = AUTH_STATUS.SUCCEEDED;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.fieldErrors = {};
      state.dialog.isOpen = false;
      if (action.payload.token) {
        persistSessionData(action.payload.token, action.payload.user);
      }
    },
    signupFailure(state, action: PayloadAction<{ message: string; dialogType: AuthDialogType }>) {
      state.status = AUTH_STATUS.FAILED;
      state.error = action.payload.message;
      const cfg = DIALOG_CONFIG[action.payload.dialogType];
      state.dialog = {
        isOpen: true,
        type: action.payload.dialogType,
        title: cfg.title,
        message: action.payload.message,
        actionText: cfg.actionText,
        redirectTo: action.payload.dialogType === 'info'
          ? `/login?email=${encodeURIComponent(state.signupForm.email)}`
          : undefined,
      };
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.status = AUTH_STATUS.IDLE;
      state.error = null;
      state.fieldErrors = {};
      state.dialog.isOpen = false;
      clearSessionData();
    },
    rehydrateAuth(state) {
      if (typeof window !== 'undefined') {
        try {
          const storedToken = localStorage.getItem('auth_token');
          const storedUser = localStorage.getItem('auth_user');
          const loginTimestamp = localStorage.getItem('auth_login_timestamp');

          if (storedToken && storedUser) {
            const loginTime = loginTimestamp ? parseInt(loginTimestamp, 10) : 0;
            const now = Date.now();
            const elapsed = now - loginTime;

            // If session is older than 24 hours (86,400,000 ms) or timestamp missing -> Auto Logout!
            if (!loginTimestamp || Number.isNaN(loginTime) || elapsed > SESSION_MAX_AGE_MS) {
              clearSessionData();
              state.user = null;
              state.token = null;
              state.isAuthenticated = false;
            } else {
              state.token = storedToken;
              state.user = JSON.parse(storedUser);
              state.isAuthenticated = true;
            }
          }
        } catch {
          clearSessionData();
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
    resetAuthStatus(state) {
      state.status = AUTH_STATUS.IDLE;
      state.error = null;
      state.dialog.isOpen = false;
    },
  },
});

export const authActions = authSlice.actions;
