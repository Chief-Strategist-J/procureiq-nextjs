import React, { useState } from "react"
import { AuthFormWrapper } from "./shared/auth-form-wrapper"
import { AuthInput } from "./shared/auth-input"
import { Mail, KeyRound } from "lucide-react"
import { ForgotPasswordPayload, SagaState } from "../types"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface ForgotPasswordFormProps {
  onSubmit: (payload: ForgotPasswordPayload) => void
  loading?: boolean
  error?: string
  successMessage?: string
  sagaState?: SagaState
  onSwitchToLogin?: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
  error,
  successMessage,
  sagaState,
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email })
  }

  return (
    <AuthFormWrapper
      title={AUTH_STRINGS.FORGOT_PASSWORD.TITLE}
      description={AUTH_STRINGS.FORGOT_PASSWORD.DESCRIPTION}
      icon={KeyRound}
      onSubmit={handleSubmit}
      submitText={AUTH_STRINGS.FORGOT_PASSWORD.SUBMIT_BTN}
      loading={loading}
      error={error}
      successMessage={successMessage}
      sagaState={sagaState}
      footerLinks={
        onSwitchToLogin && (
          <span>
            {AUTH_STRINGS.FORGOT_PASSWORD.REMEMBER_PASSWORD_PROMPT}{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-emerald-500 hover:underline font-bold"
            >
              {AUTH_STRINGS.FORGOT_PASSWORD.BACK_TO_LOGIN_LINK}
            </button>
          </span>
        )
      }
    >
      <AuthInput
        label={AUTH_STRINGS.FORGOT_PASSWORD.LABEL_EMAIL}
        icon={Mail}
        type="email"
        placeholder={AUTH_STRINGS.FORGOT_PASSWORD.PLACEHOLDER_EMAIL}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </AuthFormWrapper>
  )
}
