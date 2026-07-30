"use client"

import { useState, useCallback } from "react"
import { 
  UserAccount, 
  AuthMode, 
  SagaState, 
  LoginCredentials, 
  SignupCredentials, 
  ForgotPasswordPayload, 
  ResetPasswordPayload, 
  EmailVerifyPayload 
} from "../types"
import { traceAuthAction } from "../services/auth-tracing"
import { runLoginSaga, runSignupSaga, runPasswordResetSaga, runEmailVerificationSaga } from "../sagas/auth-saga"
import { apiForgotPassword } from "../services/auth-api"
import { AUTH_STRINGS } from "../constants/auth-strings"

const DEFAULT_USERS: UserAccount[] = [
  { name: "John Doe", role: "Procurement Manager", email: "john@procureiq.com", status: "Active" },
  { name: "Jane Smith", role: "Financial Auditor", email: "jane@procureiq.com", status: "Active" },
  { name: "Bob Johnson", role: "System Dispatcher", email: "bob@procureiq.com", status: "Suspended" },
]

export function useAuthManagement(initialUsers: UserAccount[] = DEFAULT_USERS) {
  const [mode, setMode] = useState<AuthMode>("overview")
  const [apiKey, setApiKey] = useState<string>("")
  const [generating, setGenerating] = useState<boolean>(false)
  const [users, setUsers] = useState<UserAccount[]>(initialUsers)
  const [sagaState, setSagaState] = useState<SagaState | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const resetStatus = useCallback(() => {
    setError(undefined)
    setSuccessMessage(undefined)
    setSagaState(undefined)
  }, [])

  const handleModeChange = useCallback((newMode: AuthMode) => {
    resetStatus()
    setMode(newMode)
    traceAuthAction("auth.view", { mode: newMode })
  }, [resetStatus])

  const handleGenerateKey = useCallback(() => {
    setGenerating(true)
    traceAuthAction("api_key.generate", { status: "requested" })

    setTimeout(() => {
      const generated = "pk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setApiKey(generated)
      setGenerating(false)
      traceAuthAction("api_key.generate", { status: "success", keyLength: generated.length })
    }, 1200)
  }, [])

  const toggleUserStatus = useCallback((email: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.email === email) {
          const nextStatus = user.status === "Active" ? "Suspended" : "Active"
          traceAuthAction("user.status_toggle", { email, newStatus: nextStatus })
          return { ...user, status: nextStatus }
        }
        return user
      })
    )
  }, [])

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    resetStatus()
    setLoading(true)
    try {
      const res = await runLoginSaga(credentials, setSagaState)
      if (res && res.user) {
        setUsers((prev) => [res.user, ...prev.filter((u) => u.email !== res.user.email)])
      }
      setSuccessMessage(AUTH_STRINGS.SUCCESS.LOGIN_WELCOME)
      traceAuthAction("auth.login_success", { username: credentials.username })
    } catch (err: any) {
      setError(err.message || AUTH_STRINGS.ERRORS.INVALID_CREDENTIALS)
    } finally {
      setLoading(false)
    }
  }, [resetStatus])

  const handleSignup = useCallback(async (credentials: SignupCredentials) => {
    resetStatus()
    setLoading(true)
    try {
      const newUser = await runSignupSaga(credentials, setSagaState)
      setUsers((prev) => [newUser, ...prev])
      setSuccessMessage(AUTH_STRINGS.SUCCESS.SIGNUP_SUCCESS)
      traceAuthAction("user.signup_success", { email: credentials.email })
    } catch (err: any) {
      setError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }, [resetStatus])

  const handleForgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    resetStatus()
    setLoading(true)
    try {
      const res = await apiForgotPassword(payload)
      setSuccessMessage(res.message || AUTH_STRINGS.SUCCESS.FORGOT_PASSWORD_SENT)
      traceAuthAction("auth.forgot_password_success", { email: payload.email })
    } catch (err: any) {
      setError(err.message || "Failed to process forgot password request")
    } finally {
      setLoading(false)
    }
  }, [resetStatus])

  const handleResetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    resetStatus()
    setLoading(true)
    try {
      await runPasswordResetSaga(payload, setSagaState)
      setSuccessMessage(AUTH_STRINGS.SUCCESS.PASSWORD_RESET_DONE)
      traceAuthAction("auth.reset_password_success")
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }, [resetStatus])

  const handleVerifyEmail = useCallback(async (payload: EmailVerifyPayload) => {
    resetStatus()
    setLoading(true)
    try {
      await runEmailVerificationSaga(payload, setSagaState)
      setSuccessMessage(AUTH_STRINGS.SUCCESS.EMAIL_VERIFIED)
      traceAuthAction("user.email_verified", { email: payload.email })
    } catch (err: any) {
      setError(err.message || "Email verification failed")
    } finally {
      setLoading(false)
    }
  }, [resetStatus])

  return {
    mode,
    apiKey,
    generating,
    users,
    sagaState,
    loading,
    error,
    successMessage,
    handleModeChange,
    handleGenerateKey,
    toggleUserStatus,
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleResetPassword,
    handleVerifyEmail,
  }
}
