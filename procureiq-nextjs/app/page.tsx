"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
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
  Sparkles
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
    },
    {
      name: "Identity & Access Roles",
      description: "Administer profiles, API keys, credentials, and track active user permissions.",
      path: "/auth",
      icon: Key,
      color: "from-emerald-500/20 to-green-500/20 text-emerald-500 border-emerald-500/30",
      btnColor: "bg-emerald-500 hover:bg-emerald-600 text-slate-950",
    },
    {
      name: "Notifications Hub",
      description: "Real-time user alerting feeds, SMS logs, and email channels delivery tracking.",
      path: "/notifications",
      icon: Bell,
      color: "from-rose-500/20 to-pink-500/20 text-rose-500 border-rose-500/30",
      btnColor: "bg-rose-500 hover:bg-rose-600 text-white",
    },
    {
      name: "Email Campaigns Queue",
      description: "Draft template builders, outgoing mail logs, and SMTP delivery diagnostics.",
      path: "/email",
      icon: Mail,
      color: "from-indigo-500/20 to-blue-500/20 text-indigo-500 border-indigo-500/30",
      btnColor: "bg-indigo-500 hover:bg-indigo-600 text-white",
    },
    {
      name: "Procurement Campaigns",
      description: "Bids, RFPs (Request For Proposals), active auctions, and vendor analysis tools.",
      path: "/campaigns",
      icon: Megaphone,
      color: "from-violet-500/20 to-purple-500/20 text-violet-500 border-violet-500/30",
      btnColor: "bg-violet-500 hover:bg-violet-600 text-white",
    },
    {
      name: "Field Service Logistics",
      description: "Dispatch work orders, tracking service agents schedules, and dispatching maps.",
      path: "/fieldservice",
      icon: MapPin,
      color: "from-teal-500/20 to-cyan-500/20 text-teal-500 border-teal-500/30",
      btnColor: "bg-teal-500 hover:bg-teal-600 text-slate-950",
    },
    {
      name: "GitHub Sync Pipeline",
      description: "Connected repository branches, commit pipelines, and automated version docs sync.",
      path: "/github",
      icon: Github,
      color: "from-slate-500/20 to-zinc-500/20 text-slate-400 border-slate-500/30",
      btnColor: "bg-slate-500 hover:bg-slate-600 text-white",
    },
    {
      name: "Task Jobs Log",
      description: "System crons tracker, background workers logs, and manually triggerable workers.",
      path: "/jobs",
      icon: Link2,
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/30",
      btnColor: "bg-cyan-500 hover:bg-cyan-600 text-slate-950",
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 space-y-12">
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Welcome to ProcureIQ
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Powered by <span className="font-semibold text-primary">Scaibu</span>
        </p>
      </section>

      {/* Grid of Modules */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Services & Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mfes.map((mfe) => {
            const Icon = mfe.icon
            return (
              <Card key={mfe.path} className="flex flex-col h-full hover:scale-[1.02] transition-transform">
                <CardHeader className="space-y-2">
                  <div className={`p-3 rounded-lg w-fit bg-gradient-to-br border ${mfe.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="pt-2">{mfe.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 text-sm text-muted-foreground">
                  {mfe.description}
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/20">
                  <a href={mfe.path} className="w-full">
                    <Button className={`w-full flex items-center justify-between font-semibold ${mfe.btnColor}`}>
                      <span>Open Module</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
