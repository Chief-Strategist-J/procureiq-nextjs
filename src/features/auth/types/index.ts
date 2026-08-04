export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'purchaser' | 'viewer';
  companyName?: string;
  avatarUrl?: string;
  mfaEnabled?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  companyName: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
