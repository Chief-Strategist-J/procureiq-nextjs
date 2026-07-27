"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { Link2, Play, RefreshCw, Calendar, CheckSquare } from "lucide-react"

export default function JobsPage() {
  const [jobs, setJobs] = useState([
    { id: "JOB-901", name: "AlloyDB Backup Sync Task", schedule: "0 0 * * *", lastRun: "17 hours ago", status: "Success" },
    { id: "JOB-902", name: "Spring Boot WebRTC Session Cleaner", schedule: "*/30 * * * *", lastRun: "12 mins ago", status: "Success" },
    { id: "JOB-903", name: "FastAPI Procurement Bid Analytics Compiler", schedule: "0 */4 * * *", lastRun: "3 hours ago", status: "Success" },
  ])
  const [running, setRunning] = useState(false)

  const handleRunJob = () => {
    setRunning(true)
    setTimeout(() => {
      const newJob = {
        id: `JOB-${Math.floor(900 + Math.random() * 100)}`,
        name: "Manual Document Validation Audit Run",
        schedule: "Manual",
        lastRun: "Just now",
        status: "Success"
      }
      setJobs([newJob, ...jobs])
      setRunning(false)
    }, 1200)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <Link2 className="h-8 w-8 text-cyan-500 animate-pulse-glow" />
            <span>Task Jobs Log</span>
          </h1>
          <p className="text-muted-foreground text-sm">Monitor background worker crons and queue diagnostics.</p>
        </div>
        <div className="flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
          <Link2 className="h-4 w-4 mr-1" />
          <span>Jobs Port: 8998</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Registered Background Tasks</CardTitle>
            <CardDescription>Audited lists of scheduler crons active across Spring Boot and Python engines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-xs">
              {jobs.map((j) => (
                <div key={j.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 rounded border bg-card hover:bg-accent/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
                      <Calendar className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{j.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono">{j.id} • Schedule: <span className="text-foreground">{j.schedule}</span> • Last Run: <span className="text-foreground">{j.lastRun}</span></p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    j.status === "Success" 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  }`}>
                    {j.status}
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
              <CardTitle>Trigger Background Worker</CardTitle>
              <CardDescription>Manually start a document validation task audit.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-4">
                Manual execution initiates background workers in Spring Boot scheduler engine, validating database schemas matching SUPABASE credentials.
              </div>
              <Button 
                onClick={handleRunJob}
                disabled={running}
                className="w-full font-bold bg-cyan-500 hover:bg-cyan-600 text-slate-950 flex items-center justify-center space-x-1"
              >
                <Play className={`h-4 w-4 mr-1.5 ${running ? "animate-pulse" : ""}`} />
                <span>{running ? "Running Task..." : "Trigger Audit Task"}</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center space-x-1.5">
                <CheckSquare className="h-4 w-4 text-cyan-500" />
                <span>Worker Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Redis Queue connection</span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Concurrency limit</span>
                <span className="font-semibold text-foreground">4 workers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auto-retry count</span>
                <span className="font-mono text-muted-foreground">3 times</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
