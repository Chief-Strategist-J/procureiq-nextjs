"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { Github, Sync, RefreshCw, GitBranch, GitPullRequest } from "lucide-react"

export default function GithubPage() {
  const [syncs, setSyncs] = useState([
    { id: "SYN-101", repo: "procureiq-contracts", branch: "main", commit: "a8f3b21", status: "Synced" },
    { id: "SYN-102", repo: "procureiq-springboot", branch: "develop", commit: "c99201a", status: "Synced" },
    { id: "SYN-103", repo: "procureiq-python", branch: "feature-alloydb", commit: "b883011", status: "Syncing" },
  ])
  const [syncing, setSyncing] = useState(false)

  const handleTriggerSync = () => {
    setSyncing(true)
    setTimeout(() => {
      const newSync = {
        id: `SYN-${Math.floor(100 + Math.random() * 900)}`,
        repo: "procureiq-nextjs",
        branch: "mfe-setup",
        commit: "e8834bc",
        status: "Synced"
      }
      setSyncs([newSync, ...syncs])
      setSyncing(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <Github className="h-8 w-8 text-slate-400 animate-pulse-glow" />
            <span>GitHub Sync Pipeline</span>
          </h1>
          <p className="text-muted-foreground text-sm">Monitor connected repositories document versions and commit history syncs.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-500/10 border border-slate-500/20 text-slate-300 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
          <Github className="h-4 w-4 mr-1" />
          <span>Pipeline Port: 8997</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Connected Repositories Sync status</CardTitle>
            <CardDescription>Track automation version control pipelines matching live directories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-xs">
              {syncs.map((s) => (
                <div key={s.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 rounded border bg-card hover:bg-accent/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-slate-500/10 border border-slate-500/20 text-slate-400">
                      <GitBranch className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{s.repo}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono">{s.id} • Branch: <span className="text-foreground">{s.branch}</span> • Commit: <span className="text-sky-500">{s.commit}</span></p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    s.status === "Synced" 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trigger Sync Pipeline</CardTitle>
              <CardDescription>Initiate automated version documents synchronization.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-4">
                Trigger sync triggers webhooks to download procurement schemas, mapping them into code contracts.
              </div>
              <Button 
                onClick={handleTriggerSync}
                disabled={syncing}
                className="w-full font-bold bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center space-x-1"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "Syncing Repos..." : "Sync Repositories"}</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center space-x-1.5">
                <GitPullRequest className="h-4 w-4 text-slate-400" />
                <span>Sync Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Webhook Status</span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Autocreated PRs</span>
                <span className="font-semibold text-foreground">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GitHub Integration</span>
                <span className="text-emerald-500 font-semibold">Authorized</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
