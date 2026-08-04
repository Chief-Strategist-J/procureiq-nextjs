import { HttpClient } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UserProfile,
} from '../types';

export interface LoginResponsePayload {
  token: string;
  user: UserProfile;
}

export interface UserResponsePayload {
  user: UserProfile;
  token?: string;
}

export async function loginApi(input: LoginInput): Promise<LoginResponsePayload> {
  if (!input || !input.email || !input.password) {
    throw new Error('Email and password are required.');
  }
  return HttpClient.post<LoginInput, LoginResponsePayload>(API_ENDPOINTS.AUTH.LOGIN, {
    email: input.email.trim(),
    password: input.password,
  });
}

export async function signupApi(input: SignupInput): Promise<UserResponsePayload> {
  if (!input || !input.email || !input.password || !input.name) {
    throw new Error('Name, email, and password are required for signup.');
  }
  if (!input.agreeToTerms) {
    throw new Error('You must accept the terms and conditions to register.');
  }
  return HttpClient.post<SignupInput, UserResponsePayload>(API_ENDPOINTS.AUTH.SIGNUP, {
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
    companyName: input.companyName ? input.companyName.trim() : '',
    agreeToTerms: input.agreeToTerms,
  });
}

export async function forgotPasswordApi(input: ForgotPasswordInput): Promise<string> {
  if (!input || !input.email || !input.email.trim()) {
    throw new Error('Valid email address is required.');
  }
  return HttpClient.post<ForgotPasswordInput, string>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    email: input.email.trim(),
  });
}

export async function resetPasswordApi(input: ResetPasswordInput): Promise<string> {
  if (!input || !input.token || !input.newPassword) {
    throw new Error('Reset token and new password are required.');
  }
  if (input.newPassword !== input.confirmPassword) {
    throw new Error('New password and confirmation password do not match.');
  }
  return HttpClient.post<ResetPasswordInput, string>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    token: input.token,
    newPassword: input.newPassword,
    confirmPassword: input.confirmPassword,
  });
}

export async function verifyEmailApi(token: string): Promise<string> {
  if (!token || !token.trim()) {
    throw new Error('Email verification token is required.');
  }
  return HttpClient.post<{ token: string }, string>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
    token: token.trim(),
  });
}
