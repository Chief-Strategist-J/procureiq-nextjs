import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@shared/index"
import { AlertTriangle } from "lucide-react"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface SecurityNoticeProps {
  message?: string
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({
  message = AUTH_STRINGS.SECURITY_NOTICE.DEFAULT_MESSAGE,
}) => {
  return (
    <Card className="border-rose-500/30 bg-rose-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs flex items-center space-x-1.5 text-rose-500">
          <AlertTriangle className="h-4 w-4" />
          <span>{AUTH_STRINGS.SECURITY_NOTICE.TITLE}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-[11px] text-muted-foreground leading-relaxed">
        {message}
      </CardContent>
    </Card>
  )
}
