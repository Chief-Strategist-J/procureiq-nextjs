import React from "react"
import { LucideIcon } from "lucide-react"

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon: Icon,
  error,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || `auth-input-${label.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold text-foreground flex items-center justify-between">
        <span>{label}</span>
        {error && <span className="text-[10px] text-rose-500 font-normal">{error}</span>}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-muted-foreground pointer-events-none">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full h-9 rounded-md border bg-background px-3 ${
            Icon ? "pl-9" : ""
          } py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 border-input ${
            error ? "border-rose-500" : ""
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}
