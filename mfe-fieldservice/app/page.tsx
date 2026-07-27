"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { MapPin, Navigation, UserCheck, Calendar, Map } from "lucide-react"

export default function FieldServicePage() {
  const [agents, setAgents] = useState([
    { id: "AGE-01", name: "David Miller", task: "Database Rack Installation", loc: "Building B, Floor 2", status: "On Route" },
    { id: "AGE-02", name: "Sarah Connor", task: "Optical Fiber Splice Audits", loc: "North Datacenter hub", status: "Active" },
    { id: "AGE-03", name: "John Connor", task: "AlloyDB Storage Array Config", loc: "Room 102", status: "Completed" },
  ])
  const [inputText, setInputText] = useState("")

  const handleDispatchAgent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newAgent = {
      id: `AGE-${Math.floor(10 + Math.random() * 90)}`,
      name: inputText,
      task: "Emergency Server Maintenance",
      loc: "Main Datacenter Suite C",
      status: "On Route"
    }

    setAgents([newAgent, ...agents])
    setInputText("")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-teal-500 animate-pulse-glow" />
            <span>Field Service Logistics</span>
          </h1>
          <p className="text-muted-foreground text-sm">Dispatch work orders, coordinate site setups, and track active agents.</p>
        </div>
        <div className="flex items-center space-x-2 bg-teal-500/10 border border-teal-500/20 text-teal-500 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
          <Navigation className="h-4 w-4 mr-1" />
          <span>Service Port: 8996</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Service Dispatches</CardTitle>
            <CardDescription>Real-time location and task logs for field engineers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-xs">
              {agents.map((a) => (
                <div key={a.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 rounded border bg-card hover:bg-accent/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-teal-500/10 border border-teal-500/20 text-teal-500">
                      <UserCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{a.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{a.task} • <span className="font-mono">{a.loc}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 self-end sm:self-auto">
                    <span className="text-[10px] text-muted-foreground font-mono">{a.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      a.status === "Active" 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : a.status === "On Route"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispatch Service Agent</CardTitle>
              <CardDescription>Assign an agent to emergency task location.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDispatchAgent} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="agent-name" className="text-xs font-semibold text-muted-foreground">Agent Name</label>
                  <input 
                    id="agent-name"
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter dispatch technician name..."
                    className="w-full bg-background border rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <Button type="submit" className="w-full font-bold bg-teal-500 hover:bg-teal-600 text-slate-950 flex items-center justify-center space-x-1">
                  <Navigation className="h-4.5 w-4.5 mr-1" />
                  <span>Dispatch Agent</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center space-x-1.5">
                <Map className="h-4 w-4 text-teal-500" />
                <span>Geofencing Zones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Zones</span>
                <span className="font-semibold">4 regional hubs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Response Time</span>
                <span className="font-mono text-emerald-500">42 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Map Provider</span>
                <span className="font-mono text-muted-foreground">OpenStreetMap API</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
