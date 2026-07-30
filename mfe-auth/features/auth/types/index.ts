export type UserStatus = "Active" | "Suspended"

export interface UserAccount {
  name: string
  role: string
  email: string
  status: UserStatus
}

export interface ApiKeyGenerationState {
  apiKey: string
  generating: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface SignupCredentials {
  username: string
  email: string
  password: string
  confirmPassword?: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export interface EmailVerifyPayload {
  email: string
  token: string
}

export type AuthMode = "overview" | "login" | "signup" | "forgot_password" | "reset_password" | "verify_email"

export type SagaStatus = "idle" | "running" | "completed" | "failed" | "compensated"

export interface SagaStep {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "failed"
  error?: string
}

export interface SagaState {
  sagaName: string
  status: SagaStatus
  currentStepIndex: number
  steps: SagaStep[]
  error?: string
}
