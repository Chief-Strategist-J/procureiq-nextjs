import React, { useState } from "react"
import { AuthFormWrapper } from "./shared/auth-form-wrapper"
import { AuthInput } from "./shared/auth-input"
import { User, Mail, Lock, UserPlus } from "lucide-react"
import { SignupCredentials, SagaState } from "../types"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface SignupFormProps {
  onSubmit: (credentials: SignupCredentials) => void
  loading?: boolean
  error?: string
  sagaState?: SagaState
  onSwitchToLogin?: () => void
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  loading = false,
  error,
  sagaState,
  onSwitchToLogin,
}) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ username, email, password, confirmPassword })
  }

  return (
    <AuthFormWrapper
      title={AUTH_STRINGS.SIGNUP.TITLE}
      description={AUTH_STRINGS.SIGNUP.DESCRIPTION}
      icon={UserPlus}
      onSubmit={handleSubmit}
      submitText={AUTH_STRINGS.SIGNUP.SUBMIT_BTN}
      loading={loading}
      error={error}
      sagaState={sagaState}
      footerLinks={
        onSwitchToLogin && (
          <span>
            {AUTH_STRINGS.SIGNUP.HAVE_ACCOUNT_PROMPT}{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-emerald-500 hover:underline font-bold"
            >
              {AUTH_STRINGS.SIGNUP.LOGIN_LINK}
            </button>
          </span>
        )
      }
    >
      <AuthInput
        label={AUTH_STRINGS.SIGNUP.LABEL_USERNAME}
        icon={User}
        type="text"
        placeholder={AUTH_STRINGS.SIGNUP.PLACEHOLDER_USERNAME}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <AuthInput
        label={AUTH_STRINGS.SIGNUP.LABEL_EMAIL}
        icon={Mail}
        type="email"
        placeholder={AUTH_STRINGS.SIGNUP.PLACEHOLDER_EMAIL}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <AuthInput
        label={AUTH_STRINGS.SIGNUP.LABEL_PASSWORD}
        icon={Lock}
        type="password"
        placeholder={AUTH_STRINGS.LOGIN.PLACEHOLDER_PASSWORD}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <AuthInput
        label={AUTH_STRINGS.SIGNUP.LABEL_CONFIRM_PASSWORD}
        icon={Lock}
        type="password"
        placeholder={AUTH_STRINGS.LOGIN.PLACEHOLDER_PASSWORD}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </AuthFormWrapper>
  )
}
