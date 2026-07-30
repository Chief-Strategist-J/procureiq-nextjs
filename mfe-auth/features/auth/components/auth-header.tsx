import React from "react"
import { Key, KeyRound } from "lucide-react"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface AuthHeaderProps {
  title?: string
  description?: string
  port?: number
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title = AUTH_STRINGS.HEADER.DEFAULT_TITLE,
  description = AUTH_STRINGS.HEADER.DEFAULT_DESCRIPTION,
  port = 8992,
}) => {
  return (
    <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center space-x-2">
          <Key className="h-8 w-8 text-emerald-500 animate-pulse-glow" />
          <span>{title}</span>
        </h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
        <KeyRound className="h-4 w-4 mr-1" />
        <span>{AUTH_STRINGS.HEADER.PORT_LABEL}: {port}</span>
      </div>
    </section>
  )
}
