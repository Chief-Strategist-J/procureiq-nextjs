"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@shared/index"
import { Button } from "@shared/index"
import { 
  Cpu, 
  Key, 
  Bell, 
  Mail, 
  Megaphone, 
  MapPin, 
  Github, 
  Link2, 
  ArrowRight,
  Database,
  Shield,
  Layers,
  Workflow
} from "lucide-react"

export default function HomePage() {
  const mfes = [
    {
      name: "Crypto & Smart Contracts",
      description: "Manage and verify procurement contracts on a distributed ledger with AlloyDB auditing.",
      path: "/crypto",
      icon: Cpu,
      color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30",
      btnColor: "bg-amber-500 hover:bg-amber-600 text-slate-950",
      status: "Active - Port 8991"
    },
    {
      name: "Identity & Access Roles",
      description: "Administer profiles, API keys, credentials, and track active user permissions.",
      path: "/auth",
      icon: Key,
      color: "from-emerald-500/20 to-green-500/20 text-emerald-500 border-emerald-500/30",
      btnColor: "bg-emerald-500 hover:bg-emerald-600 text-slate-950",
      status: "Active - Port 8992"
    },
    {
      name: "Notifications Hub",
      description: "Real-time user alerting feeds, SMS logs, and email channels delivery tracking.",
      path: "/notifications",
      icon: Bell,
      color: "from-rose-500/20 to-pink-500/20 text-rose-500 border-rose-500/30",
      btnColor: "bg-rose-500 hover:bg-rose-600 text-white",
      status: "Active - Port 8993"
    },
    {
      name: "Email Campaigns Queue",
      description: "Draft template builders, outgoing mail logs, and SMTP delivery diagnostics.",
      path: "/email",
      icon: Mail,
      color: "from-indigo-500/20 to-blue-500/20 text-indigo-500 border-indigo-500/30",
      btnColor: "bg-indigo-500 hover:bg-indigo-600 text-white",
      status: "Active - Port 8994"
    },
    {
      name: "Procurement Campaigns",
      description: "Bids, RFPs (Request For Proposals), active auctions, and vendor analysis tools.",
      path: "/campaigns",
      icon: Megaphone,
      color: "from-violet-500/20 to-purple-500/20 text-violet-500 border-violet-500/30",
      btnColor: "bg-violet-500 hover:bg-violet-600 text-white",
      status: "Active - Port 8995"
    },
    {
      name: "Field Service Logistics",
      description: "Dispatch work orders, tracking service agents schedules, and dispatching maps.",
      path: "/fieldservice",
      icon: MapPin,
      color: "from-teal-500/20 to-cyan-500/20 text-teal-500 border-teal-500/30",
      btnColor: "bg-teal-500 hover:bg-teal-600 text-slate-950",
      status: "Active - Port 8996"
    },
    {
      name: "GitHub Sync Pipeline",
      description: "Connected repository branches, commit pipelines, and automated version docs sync.",
      path: "/github",
      icon: Github,
      color: "from-slate-500/20 to-zinc-500/20 text-slate-400 border-slate-500/30",
      btnColor: "bg-slate-500 hover:bg-slate-600 text-white",
      status: "Active - Port 8997"
    },
    {
      name: "Task Jobs Log",
      description: "System crons tracker, background workers logs, and manually triggerable workers.",
      path: "/jobs",
      icon: Link2,
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/30",
      btnColor: "bg-cyan-500 hover:bg-cyan-600 text-slate-950",
      status: "Active - Port 8998"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 space-y-12">
      
      {/* Hero Welcome banner */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium">
          <Layers className="h-4 w-4" />
          <span>ProcureIQ UI Monorepo v1.0.0</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Enterprise Multi-Service <br />
          <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Micro Frontend Portal
          </span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Welcome to the control center. Switch between independent Next.js services instantly, sharing styles, types, and custom shadcn/ui components.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a href="/crypto">
            <Button variant="premium" className="h-10 px-6">
              <span>Go to Dashboard</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <a href="/auth">
            <Button variant="outline" className="h-10 px-6">
              <Shield className="mr-2 h-4 w-4" />
              <span>Identity Center</span>
            </Button>
          </a>
        </div>
      </section>

      {/* Grid of Micro Frontends */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold">Applications & Micro Frontends</h2>
            <p className="text-sm text-muted-foreground">Each app runs on its own port and maps to a dynamic sub-route path.</p>
          </div>
          <div className="text-xs text-muted-foreground font-mono flex items-center space-x-1.5 bg-muted p-2 rounded">
            <Workflow className="h-3.5 w-3.5" />
            <span>Path Proxying active via Next.js Multi Zones</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mfes.map((mfe) => {
            const Icon = mfe.icon
            return (
              <Card key={mfe.path} className="flex flex-col h-full hover:scale-[1.02]">
                <CardHeader className="space-y-2">
                  <div className={`p-3 rounded-lg w-fit bg-gradient-to-br border ${mfe.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="pt-2">{mfe.name}</CardTitle>
                  <CardDescription className="text-xs font-mono">{mfe.status}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 text-sm text-muted-foreground">
                  {mfe.description}
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/20">
                  <a href={mfe.path} className="w-full">
                    <Button className={`w-full flex items-center justify-between font-semibold ${mfe.btnColor}`}>
                      <span>Launch App</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Overview Analytics Status Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DB audits */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-sky-500" />
              <span>Active Database Connection logs</span>
            </CardTitle>
            <CardDescription>Auditing operational logs fetched from Supabase & AlloyDB local instance.</CardDescription>
          </CardHeader>
          <CardContent className="font-mono text-xs text-muted-foreground bg-muted/40 p-4 rounded-lg border space-y-1.5">
            <p className="text-emerald-500">[OK] 2026-07-27T17:42:01Z - AlloyDB Omni successfully initialized on port 5432</p>
            <p className="text-emerald-500">[OK] 2026-07-27T17:42:03Z - Spring Boot JPA synced schema 'channel_deliveries'</p>
            <p className="text-sky-500">[INFO] 2026-07-27T17:43:00Z - WebRTC Signaling server listening on port 8082</p>
            <p className="text-amber-500">[WARN] 2026-07-27T17:45:12Z - FastAPI backup task trigger pending scheduler response</p>
            <p className="text-emerald-500">[OK] 2026-07-27T17:46:00Z - Connection active Supabase db pool: 12 active pools</p>
          </CardContent>
        </Card>

        {/* System Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Monorepo Health</CardTitle>
            <CardDescription>Global assets compiles and diagnostics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Dependencies</span>
              <span className="font-semibold text-emerald-500">Shared (Root Hoisted)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Components</span>
              <span className="font-semibold text-primary">shadcn/ui + Radix</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Vite Storybook</span>
              <span className="font-semibold text-violet-500">Active (Port 6006)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tailwind CSS version</span>
              <span className="font-semibold text-sky-500">v3.4.3</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
