import { HttpClient } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { mapJson } from '@/core/data-driven/json-map';
import {
  loginResponseValidator,
  signupResponseValidator,
  userFromApi,
  loginRequestToApi,
  signupRequestToApi,
} from '../schema/auth.schema';
import type { LoginInput, SignupInput, ForgotPasswordInput, ResetPasswordInput, UserProfile } from '../types';

export interface LoginResponsePayload {
  token: string;
  user: UserProfile;
}

export interface UserResponsePayload {
  user: UserProfile;
  token?: string;
  isAutoLogin?: boolean;
}

export async function loginApi(input: LoginInput): Promise<LoginResponsePayload> {
  const raw = await HttpClient.post<Record<string, unknown>, Record<string, unknown>>(
    API_ENDPOINTS.AUTH.LOGIN,
    mapJson(input as unknown as Record<string, unknown>, loginRequestToApi)
  );
  const validated = loginResponseValidator.parse({
    ...raw,
    user: mapJson(raw['user'] as Record<string, unknown>, userFromApi),
  });
  return validated as LoginResponsePayload;
}

export async function signupApi(input: SignupInput): Promise<UserResponsePayload> {
  const raw = await HttpClient.post<Record<string, unknown>, Record<string, unknown>>(
    API_ENDPOINTS.AUTH.SIGNUP,
    mapJson(input as unknown as Record<string, unknown>, signupRequestToApi)
  );
  const validated = signupResponseValidator.parse({
    ...raw,
    user: mapJson(raw['user'] as Record<string, unknown>, userFromApi),
  });
  return validated as UserResponsePayload;
}

export async function forgotPasswordApi(input: ForgotPasswordInput): Promise<string> {
  return HttpClient.post<ForgotPasswordInput, string>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    email: input.email.trim(),
  });
}

export async function resetPasswordApi(input: ResetPasswordInput): Promise<string> {
  return HttpClient.post<ResetPasswordInput, string>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    token: input.token,
    newPassword: input.newPassword,
    confirmPassword: input.confirmPassword,
  });
}

export async function verifyEmailApi(token: string): Promise<string> {
  return HttpClient.post<{ token: string }, string>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
    token: token.trim(),
  });
}
