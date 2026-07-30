"use client"

import React from "react"
import { 
  useAuthManagement, 
  AuthHeader, 
  UserAccountList, 
  ApiKeyCard, 
  SecurityNotice,
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  EmailVerificationCard
} from "../features/auth"
import { LayoutGrid, LogIn, UserPlus, KeyRound, ShieldCheck, MailCheck } from "lucide-react"

export default function AuthPage() {
  const { 
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
  } = useAuthManagement()

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <AuthHeader />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        <button
          onClick={() => handleModeChange("overview")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "overview"
              ? "bg-emerald-500 text-slate-950 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Accounts & API Keys</span>
        </button>

        <button
          onClick={() => handleModeChange("login")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "login"
              ? "bg-emerald-500 text-slate-950 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Sign In</span>
        </button>

        <button
          onClick={() => handleModeChange("signup")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "signup"
              ? "bg-emerald-500 text-slate-950 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Register</span>
        </button>

        <button
          onClick={() => handleModeChange("forgot_password")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "forgot_password"
              ? "bg-emerald-500 text-slate-950 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Forgot Password</span>
        </button>

        <button
          onClick={() => handleModeChange("reset_password")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "reset_password"
              ? "bg-emerald-500 text-slate-950 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Reset Password</span>
        </button>

        <button
          onClick={() => handleModeChange("verify_email")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "verify_email"
              ? "bg-emerald-500 text-slate-950 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <MailCheck className="h-3.5 w-3.5" />
          <span>Verify Email</span>
        </button>
      </div>

      {/* Dynamic Mode Render */}
      {mode === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UserAccountList users={users} onToggleStatus={toggleUserStatus} />
          <div className="space-y-6">
            <ApiKeyCard 
              apiKey={apiKey} 
              generating={generating} 
              onGenerateKey={handleGenerateKey} 
            />
            <SecurityNotice />
          </div>
        </div>
      )}

      {mode === "login" && (
        <div className="py-6">
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
            sagaState={sagaState}
            onSwitchToSignup={() => handleModeChange("signup")}
            onSwitchToForgotPassword={() => handleModeChange("forgot_password")}
          />
        </div>
      )}

      {mode === "signup" && (
        <div className="py-6">
          <SignupForm
            onSubmit={handleSignup}
            loading={loading}
            error={error}
            sagaState={sagaState}
            onSwitchToLogin={() => handleModeChange("login")}
          />
        </div>
      )}

      {mode === "forgot_password" && (
        <div className="py-6">
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            loading={loading}
            error={error}
            successMessage={successMessage}
            sagaState={sagaState}
            onSwitchToLogin={() => handleModeChange("login")}
          />
        </div>
      )}

      {mode === "reset_password" && (
        <div className="py-6">
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            loading={loading}
            error={error}
            successMessage={successMessage}
            sagaState={sagaState}
            onSwitchToLogin={() => handleModeChange("login")}
          />
        </div>
      )}

      {mode === "verify_email" && (
        <div className="py-6">
          <EmailVerificationCard
            onVerify={handleVerifyEmail}
            loading={loading}
            error={error}
            successMessage={successMessage}
            sagaState={sagaState}
            onSwitchToLogin={() => handleModeChange("login")}
          />
        </div>
      )}
    </div>
  )
}
