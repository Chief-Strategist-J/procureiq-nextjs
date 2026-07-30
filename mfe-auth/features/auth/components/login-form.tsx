import React, { useState } from "react"
import { AuthFormWrapper } from "./shared/auth-form-wrapper"
import { AuthInput } from "./shared/auth-input"
import { User, Lock, LogIn } from "lucide-react"
import { LoginCredentials, SagaState } from "../types"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void
  loading?: boolean
  error?: string
  sagaState?: SagaState
  onSwitchToSignup?: () => void
  onSwitchToForgotPassword?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error,
  sagaState,
  onSwitchToSignup,
  onSwitchToForgotPassword,
}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ username, password })
  }

  return (
    <AuthFormWrapper
      title={AUTH_STRINGS.LOGIN.TITLE}
      description={AUTH_STRINGS.LOGIN.DESCRIPTION}
      icon={LogIn}
      onSubmit={handleSubmit}
      submitText={AUTH_STRINGS.LOGIN.SUBMIT_BTN}
      loading={loading}
      error={error}
      sagaState={sagaState}
      footerLinks={
        <div className="flex flex-col space-y-1">
          {onSwitchToForgotPassword && (
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-emerald-500 hover:underline hover:text-emerald-600 font-medium"
            >
              {AUTH_STRINGS.LOGIN.FORGOT_PASSWORD_LINK}
            </button>
          )}
          {onSwitchToSignup && (
            <span>
              {AUTH_STRINGS.LOGIN.NO_ACCOUNT_PROMPT}{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-emerald-500 hover:underline font-bold"
              >
                {AUTH_STRINGS.LOGIN.SIGNUP_LINK}
              </button>
            </span>
          )}
        </div>
      }
    >
      <AuthInput
        label={AUTH_STRINGS.LOGIN.LABEL_USERNAME}
        icon={User}
        type="text"
        placeholder={AUTH_STRINGS.LOGIN.PLACEHOLDER_USERNAME}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <AuthInput
        label={AUTH_STRINGS.LOGIN.LABEL_PASSWORD}
        icon={Lock}
        type="password"
        placeholder={AUTH_STRINGS.LOGIN.PLACEHOLDER_PASSWORD}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </AuthFormWrapper>
  )
}
