import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@shared/index"
import { UserCheck } from "lucide-react"
import { UserAccount } from "../types"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface UserAccountListProps {
  users: UserAccount[]
  onToggleStatus?: (email: string) => void
}

export const UserAccountList: React.FC<UserAccountListProps> = ({ users, onToggleStatus }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{AUTH_STRINGS.ACCOUNTS.TITLE}</CardTitle>
        <CardDescription>{AUTH_STRINGS.ACCOUNTS.DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.email} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent/20 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{u.name}</h4>
                  <p className="text-xs text-muted-foreground">{u.email} • <span className="font-semibold">{u.role}</span></p>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  u.status === "Active" 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                }`}>
                  {u.status}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => onToggleStatus?.(u.email)}
                >
                  {u.status === "Active" ? AUTH_STRINGS.ACCOUNTS.ACTION_SUSPEND : AUTH_STRINGS.ACCOUNTS.ACTION_ACTIVATE}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
