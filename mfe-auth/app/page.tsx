"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { Key, ShieldCheck, UserCheck, KeyRound, AlertTriangle } from "lucide-react"

export default function AuthPage() {
  const [apiKey, setApiKey] = useState("")
  const [generating, setGenerating] = useState(false)
  const [users, setUsers] = useState([
    { name: "John Doe", role: "Procurement Manager", email: "john@procureiq.com", status: "Active" },
    { name: "Jane Smith", role: "Financial Auditor", email: "jane@procureiq.com", status: "Active" },
    { name: "Bob Johnson", role: "System Dispatcher", email: "bob@procureiq.com", status: "Suspended" },
  ])

  const handleGenerateKey = () => {
    setGenerating(true)
    setTimeout(() => {
      const generated = "pk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setApiKey(generated)
      setGenerating(false)
    }, 1200)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <Key className="h-8 w-8 text-emerald-500 animate-pulse-glow" />
            <span>Identity & Access Roles</span>
          </h1>
          <p className="text-muted-foreground text-sm">Manage user credentials, API keys, and track role assignments.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
          <KeyRound className="h-4 w-4 mr-1" />
          <span>Access Port: 8992</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform User Accounts</CardTitle>
            <CardDescription>Configure credentials and review role definitions.</CardDescription>
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
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Access side panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System API Keys</CardTitle>
              <CardDescription>Generate access keys for Spring Boot & Python endpoints.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground">
                Use API Keys to authenticate external services requesting dispatching records or smart contract state details.
              </div>
              
              {apiKey && (
                <div className="bg-muted p-3 rounded border font-mono text-[10px] break-all select-all text-emerald-500">
                  {apiKey}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateKey} 
                disabled={generating} 
                className="w-full font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950"
              >
                {generating ? "Generating..." : "Generate API Key"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-rose-500/30 bg-rose-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center space-x-1.5 text-rose-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Security Notice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[11px] text-muted-foreground leading-relaxed">
              Ensure API keys are stored securely. Never commit them to version control pipeline. Regenerate compromised keys immediately.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
