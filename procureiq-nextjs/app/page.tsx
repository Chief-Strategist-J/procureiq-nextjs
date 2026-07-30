"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@shared/index"
import { Cpu, Server, Layers, ShieldCheck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-8 space-y-8 max-w-4xl">
      <section className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium">
          <Layers className="h-4 w-4" />
          <span>ProcureIQ Platform</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          ProcureIQ Services Overview
        </h1>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-sky-500" />
            <span>Active System Services</span>
          </CardTitle>
          <CardDescription>System services operational status and endpoints.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="p-3 rounded-lg border bg-card flex justify-between items-center">
            <div>
              <p className="font-semibold">Spring Boot Java Backend</p>
              <p className="text-xs text-muted-foreground">Port 6565 / 8080</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">Active</span>
          </div>
          <div className="p-3 rounded-lg border bg-card flex justify-between items-center">
            <div>
              <p className="font-semibold">Python FastAPI Backend</p>
              <p className="text-xs text-muted-foreground">Port 8000</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">Active</span>
          </div>
          <div className="p-3 rounded-lg border bg-card flex justify-between items-center">
            <div>
              <p className="font-semibold">AlloyDB Omni Database</p>
              <p className="text-xs text-muted-foreground">Port 5432</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">Connected</span>
          </div>
          <div className="p-3 rounded-lg border bg-card flex justify-between items-center">
            <div>
              <p className="font-semibold">Grafana Tempo & Observability</p>
              <p className="text-xs text-muted-foreground">Port 3001 (Grafana) / 3200 (Tempo)</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">Active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
