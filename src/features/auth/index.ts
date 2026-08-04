export { LoginForm } from './components/login-form';
export { SignupForm } from './components/signup-form';
export { ForgotPasswordForm } from './components/forgot-password-form';
export { ApiKeyCard } from './components/api-key-card';
export { AuthStatusDialog } from './components/auth-status-dialog';
export { DashboardView } from './components/dashboard-view';

export { useAuthManagement } from './hooks/use-auth-management';
export { useApiKeyService } from './hooks/use-api-key-service';

export { ApiKeyService } from './services/api-key-service';

export type {
  UserProfile,
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ApiKeyItem,
  AuthState,
} from './types';

export {
  loginApi,
  signupApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailApi,
} from './services/auth-api';
