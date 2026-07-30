import { SagaState, SagaStep, LoginCredentials, SignupCredentials, ForgotPasswordPayload, ResetPasswordPayload, EmailVerifyPayload } from "../types"
import { traceAuthAction } from "../services/auth-tracing"
import { apiLogin, apiSignup, apiForgotPassword, apiResetPassword, apiVerifyEmail } from "../services/auth-api"
import { AUTH_STRINGS } from "../constants/auth-strings"

export type SagaStepExecutor = () => Promise<any>
export type SagaCompensator = () => Promise<void>

export interface SagaDefinitionStep {
  id: string
  name: string
  execute: SagaStepExecutor
  compensate?: SagaCompensator
}

export async function executeSaga(
  sagaName: string,
  stepDefinitions: SagaDefinitionStep[],
  onStateUpdate?: (state: SagaState) => void
): Promise<any> {
  const steps: SagaStep[] = stepDefinitions.map((d) => ({
    id: d.id,
    name: d.name,
    status: "pending",
  }))

  let currentState: SagaState = {
    sagaName,
    status: "running",
    currentStepIndex: 0,
    steps,
  }

  const updateState = (next: Partial<SagaState>) => {
    currentState = { ...currentState, ...next }
    onStateUpdate?.(currentState)
  }

  updateState({})
  traceAuthAction("auth.saga_start", { saga: sagaName })

  const completedSteps: SagaDefinitionStep[] = []
  let lastResult: any = null

  for (let i = 0; i < stepDefinitions.length; i++) {
    const def = stepDefinitions[i]
    steps[i].status = "running"
    updateState({ currentStepIndex: i, steps: [...steps] })

    try {
      lastResult = await def.execute()
      steps[i].status = "completed"
      completedSteps.push(def)
      updateState({ steps: [...steps] })
    } catch (err: any) {
      steps[i].status = "failed"
      steps[i].error = err.message || "Step failed"

      traceAuthAction("auth.saga_compensation", { saga: sagaName, failedStep: def.id })
      for (let j = completedSteps.length - 1; j >= 0; j--) {
        if (completedSteps[j].compensate) {
          try {
            await completedSteps[j].compensate!()
          } catch (compErr) {
            console.error(`Compensation error on step ${completedSteps[j].id}:`, compErr)
          }
        }
      }

      updateState({
        status: "failed",
        error: err.message || "Saga failed",
        steps: [...steps],
      })
      throw err
    }
  }

  updateState({ status: "completed" })
  traceAuthAction("auth.saga_complete", { saga: sagaName })
  return lastResult
}

export async function runSignupSaga(
  credentials: SignupCredentials,
  onStateUpdate?: (state: SagaState) => void
) {
  return executeSaga(
    "SignupSaga",
    [
      {
        id: "validate_input",
        name: "Validate Registration Payload",
        execute: async () => {
          if (!credentials.username || !credentials.email || !credentials.password) {
            throw new Error(AUTH_STRINGS.ERRORS.REQUIRED_FIELDS)
          }
          if (credentials.password !== credentials.confirmPassword) {
            throw new Error(AUTH_STRINGS.ERRORS.PASSWORD_MISMATCH)
          }
          return true
        },
      },
      {
        id: "register_user",
        name: "Register User Credentials",
        execute: async () => apiSignup(credentials),
      },
      {
        id: "dispatch_verification",
        name: "Generate Email Verification Token",
        execute: async () => {
          traceAuthAction("user.status_toggle", { email: credentials.email, action: "send_verification_email" })
          return { verificationToken: "token_verify_" + Math.random().toString(36).substring(2, 10) }
        },
      },
    ],
    onStateUpdate
  )
}

export async function runLoginSaga(
  credentials: LoginCredentials,
  onStateUpdate?: (state: SagaState) => void
) {
  return executeSaga(
    "LoginSaga",
    [
      {
        id: "validate_credentials",
        name: "Validate Input Credentials",
        execute: async () => {
          if (!credentials.username || !credentials.password) {
            throw new Error(AUTH_STRINGS.ERRORS.REQUIRED_FIELDS)
          }
          return true
        },
      },
      {
        id: "authenticate_backend",
        name: "Authenticate Endpoint & Issue JWT",
        execute: async () => apiLogin(credentials),
      },
      {
        id: "load_permissions",
        name: "Load Role Permissions & Session State",
        execute: async () => {
          traceAuthAction("auth.view", { username: credentials.username, status: "authenticated" })
          return { permissions: ["READ_RECORDS", "DISPATCH_JOBS"] }
        },
      },
    ],
    onStateUpdate
  )
}

export async function runPasswordResetSaga(
  payload: ResetPasswordPayload,
  onStateUpdate?: (state: SagaState) => void
) {
  return executeSaga(
    "PasswordResetSaga",
    [
      {
        id: "verify_reset_token",
        name: "Verify Reset Token Validity",
        execute: async () => {
          if (!payload.token) throw new Error(AUTH_STRINGS.ERRORS.MISSING_TOKEN)
          return true
        },
      },
      {
        id: "update_password",
        name: "Update Encrypted User Password",
        execute: async () => apiResetPassword(payload),
      },
    ],
    onStateUpdate
  )
}

export async function runEmailVerificationSaga(
  payload: EmailVerifyPayload,
  onStateUpdate?: (state: SagaState) => void
) {
  return executeSaga(
    "EmailVerificationSaga",
    [
      {
        id: "validate_token",
        name: "Validate Verification Token",
        execute: async () => {
          if (!payload.token || !payload.email) throw new Error(AUTH_STRINGS.ERRORS.MISSING_TOKEN)
          return true
        },
      },
      {
        id: "confirm_verification",
        name: "Update Email Verification Status in DB",
        execute: async () => apiVerifyEmail(payload),
      },
    ],
    onStateUpdate
  )
}
