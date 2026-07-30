import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { LucideIcon, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { SagaState } from "../../types"
import { AUTH_STRINGS } from "../../constants/auth-strings"

export interface AuthFormWrapperProps {
  title: string
  description: string
  icon?: LucideIcon
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  submitText: string
  loading?: boolean
  error?: string
  successMessage?: string
  sagaState?: SagaState
  footerLinks?: React.ReactNode
}

export const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  title,
  description,
  icon: Icon,
  children,
  onSubmit,
  submitText,
  loading = false,
  error,
  successMessage,
  sagaState,
  footerLinks,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center space-x-2">
          {Icon && <Icon className="h-5 w-5 text-emerald-500" />}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center space-x-2 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-md">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {sagaState && sagaState.status === "running" && (
            <div className="bg-muted p-2.5 rounded-md text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-emerald-500 font-semibold">
                <span className="flex items-center space-x-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saga: {sagaState.sagaName}</span>
                </span>
                <span>{AUTH_STRINGS.SAGA.STEP_LABEL} {sagaState.currentStepIndex + 1}/{sagaState.steps.length}</span>
              </div>
              <div className="space-y-1 pt-1 border-t border-border">
                {sagaState.steps.map((step, idx) => (
                  <div key={step.id} className="flex justify-between items-center text-[11px]">
                    <span className={idx === sagaState.currentStepIndex ? "text-foreground font-bold" : "text-muted-foreground"}>
                      {step.name}
                    </span>
                    <span className="text-[10px]">
                      {step.status === "completed" && "✓"}
                      {step.status === "running" && "..."}
                      {step.status === "failed" && "✗"}
                      {step.status === "pending" && "○"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {children}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            type="submit"
            disabled={loading || sagaState?.status === "running"}
            className="w-full font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{AUTH_STRINGS.SAGA.PROCESSING_LABEL}</span>
              </>
            ) : (
              <span>{submitText}</span>
            )}
          </Button>

          {footerLinks && <div className="text-xs text-center text-muted-foreground pt-1">{footerLinks}</div>}
        </CardFooter>
      </form>
    </Card>
  )
}
