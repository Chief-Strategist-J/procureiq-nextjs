import React, { useState } from "react"
import { AuthFormWrapper } from "./shared/auth-form-wrapper"
import { AuthInput } from "./shared/auth-input"
import { Mail, CheckCircle, Key } from "lucide-react"
import { EmailVerifyPayload, SagaState } from "../types"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface EmailVerificationCardProps {
  onVerify: (payload: EmailVerifyPayload) => void
  initialEmail?: string
  initialToken?: string
  loading?: boolean
  error?: string
  successMessage?: string
  sagaState?: SagaState
  onSwitchToLogin?: () => void
}

export const EmailVerificationCard: React.FC<EmailVerificationCardProps> = ({
  onVerify,
  initialEmail = "",
  initialToken = "",
  loading = false,
  error,
  successMessage,
  sagaState,
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState(initialEmail)
  const [token, setToken] = useState(initialToken)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onVerify({ email, token })
  }

  return (
    <AuthFormWrapper
      title={AUTH_STRINGS.VERIFY_EMAIL.TITLE}
      description={AUTH_STRINGS.VERIFY_EMAIL.DESCRIPTION}
      icon={CheckCircle}
      onSubmit={handleSubmit}
      submitText={AUTH_STRINGS.VERIFY_EMAIL.SUBMIT_BTN}
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
            {AUTH_STRINGS.VERIFY_EMAIL.BACK_TO_LOGIN_LINK}
          </button>
        )
      }
    >
      <AuthInput
        label={AUTH_STRINGS.VERIFY_EMAIL.LABEL_EMAIL}
        icon={Mail}
        type="email"
        placeholder={AUTH_STRINGS.VERIFY_EMAIL.PLACEHOLDER_EMAIL}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <AuthInput
        label={AUTH_STRINGS.VERIFY_EMAIL.LABEL_TOKEN}
        icon={Key}
        type="text"
        placeholder={AUTH_STRINGS.VERIFY_EMAIL.PLACEHOLDER_TOKEN}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />
    </AuthFormWrapper>
  )
}
