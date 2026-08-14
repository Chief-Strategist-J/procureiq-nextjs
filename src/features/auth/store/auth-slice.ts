import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginInput, SignupInput, UserProfile } from '../types';
import { AuthDialogType } from '../rules/auth.rules';
import { AUTH_STATUS } from '../constants';

interface LoginFormFields {
  email: string;
  password: string;
  showPassword: boolean;
}

interface SignupFormFields {
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  companyName: string;
  agreeToTerms: boolean;
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
  loginForm: { email: '', password: '', showPassword: false },
  signupForm: { name: '', email: '', password: '', showPassword: false, companyName: '', agreeToTerms: false },
  fieldErrors: {},
  dialog: { isOpen: false, type: 'error', title: '', message: '', actionText: 'Try Again' },
};

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
    },
    resetAuthStatus(state) {
      state.status = AUTH_STATUS.IDLE;
      state.error = null;
      state.dialog.isOpen = false;
    },
  },
});

export const authActions = authSlice.actions;
