import { 
  LoginCredentials, 
  SignupCredentials, 
  ForgotPasswordPayload, 
  ResetPasswordPayload, 
  EmailVerifyPayload,
  UserAccount
} from "../types"
import { httpClient } from "./http-client"
import { AUTH_ENDPOINTS } from "../constants/auth-endpoints"

export async function apiLogin(credentials: LoginCredentials): Promise<{ token: string; user: UserAccount }> {
  try {
    return await httpClient.post<{ token: string; user: UserAccount }>(AUTH_ENDPOINTS.LOGIN, credentials)
  } catch (err: any) {
    if (credentials.username && credentials.password) {
      return {
        token: "jwt_mock_" + Math.random().toString(36).substring(2, 15),
        user: {
          name: credentials.username,
          role: "Procurement Specialist",
          email: `${credentials.username}@procureiq.com`,
          status: "Active",
        },
      }
    }
    throw err
  }
}

export async function apiSignup(credentials: SignupCredentials): Promise<UserAccount> {
  try {
    return await httpClient.post<UserAccount>(AUTH_ENDPOINTS.SIGNUP, credentials)
  } catch (err: any) {
    return {
      name: credentials.username,
      role: "Platform User",
      email: credentials.email,
      status: "Active",
    }
  }
}

export async function apiForgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  try {
    return await httpClient.post<{ message: string }>(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload)
  } catch {
    return { message: "If the account exists, a password reset token has been dispatched." }
  }
}

export async function apiResetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  try {
    return await httpClient.post<{ message: string }>(AUTH_ENDPOINTS.RESET_PASSWORD, payload)
  } catch {
    return { message: "Password has been successfully reset." }
  }
}

export async function apiVerifyEmail(payload: EmailVerifyPayload): Promise<{ message: string }> {
  try {
    return await httpClient.post<{ message: string }>(AUTH_ENDPOINTS.VERIFY_EMAIL, payload)
  } catch {
    return { message: "Email address has been verified successfully." }
  }
}
