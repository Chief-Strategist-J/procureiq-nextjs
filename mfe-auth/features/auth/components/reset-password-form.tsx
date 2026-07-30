import React, { useState } from "react"
import { AuthFormWrapper } from "./shared/auth-form-wrapper"
import { AuthInput } from "./shared/auth-input"
import { Lock, ShieldCheck, Key } from "lucide-react"
import { ResetPasswordPayload, SagaState } from "../types"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface ResetPasswordFormProps {
  onSubmit: (payload: ResetPasswordPayload) => void
  initialToken?: string
  loading?: boolean
  error?: string
  successMessage?: string
  sagaState?: SagaState
  onSwitchToLogin?: () => void
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  initialToken = "",
  loading = false,
  error,
  successMessage,
  sagaState,
  onSwitchToLogin,
}) => {
  const [token, setToken] = useState(initialToken)
  const [newPassword, setNewPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ token, newPassword })
  }

  return (
    <AuthFormWrapper
      title={AUTH_STRINGS.RESET_PASSWORD.TITLE}
      description={AUTH_STRINGS.RESET_PASSWORD.DESCRIPTION}
      icon={ShieldCheck}
      onSubmit={handleSubmit}
      submitText={AUTH_STRINGS.RESET_PASSWORD.SUBMIT_BTN}
      loading={loading}
      error={error}
      successMessage={successMessage}
      sagaState={sagaState}
      footerLinks={
        onSwitchToLogin && (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-emerald-500 hover:underline font-bold"
          >
            {AUTH_STRINGS.RESET_PASSWORD.BACK_TO_LOGIN_LINK}
          </button>
        )
      }
    >
      <AuthInput
        label={AUTH_STRINGS.RESET_PASSWORD.LABEL_TOKEN}
        icon={Key}
        type="text"
        placeholder={AUTH_STRINGS.RESET_PASSWORD.PLACEHOLDER_TOKEN}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />
      <AuthInput
        label={AUTH_STRINGS.RESET_PASSWORD.LABEL_NEW_PASSWORD}
        icon={Lock}
        type="password"
        placeholder={AUTH_STRINGS.LOGIN.PLACEHOLDER_PASSWORD}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
    </AuthFormWrapper>
  )
}
