"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { Bell, ShieldCheck, Mail, Send, Terminal } from "lucide-react"

export default function NotificationsPage() {
  const [logs, setLogs] = useState([
    { id: "LOG-01", type: "EMAIL", msg: "Procurement bid invitation sent to vendor Acme Inc.", status: "Delivered" },
    { id: "LOG-02", type: "SMS", msg: "Security authorization challenge token sent to +1 (555) 0192", status: "Delivered" },
    { id: "LOG-03", type: "SLACK", msg: "Contract CON-78891 audit logs synced to AlloyDB Omni", status: "Sent" },
  ])
  const [inputText, setInputText] = useState("")

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newLog = {
      id: `LOG-${Math.floor(10 + Math.random() * 90)}`,
      type: "SYSTEM_ALERT",
      msg: inputText,
      status: "Delivered"
    }

    setLogs([newLog, ...logs])
    setInputText("")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <Bell className="h-8 w-8 text-rose-500 animate-pulse-glow" />
            <span>Notifications Hub</span>
          </h1>
          <p className="text-muted-foreground text-sm">Real-time system alerts, SMS channels, and delivery logs.</p>
        </div>
        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
          <Bell className="h-4 w-4 mr-1" />
          <span>Alerts Port: 8993</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Delivery Event Logs</CardTitle>
            <CardDescription>Audited channel logs detailing outgoing alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 font-mono text-xs">
              {logs.map((l) => (
                <div key={l.id} className="flex justify-between items-start gap-4 p-3 rounded border bg-card hover:bg-accent/20 transition-all duration-200">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-rose-500">{l.id}</span>
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-semibold text-muted-foreground border">{l.type}</span>
                    </div>
                    <p className="text-foreground font-sans text-xs leading-relaxed">{l.msg}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 whitespace-nowrap">
                    {l.status}
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
              <CardTitle>Simulate Broadcast Alert</CardTitle>
              <CardDescription>Send a mock system notification alert.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendAlert} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="alert-msg" className="text-xs font-semibold text-muted-foreground">Alert Message</label>
                  <input 
                    id="alert-msg"
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter system event alert text..."
                    className="w-full bg-background border rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>
                <Button type="submit" className="w-full font-bold bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center space-x-1">
                  <Send className="h-4.5 w-4.5 mr-1" />
                  <span>Broadcast Alert</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Queue (FastAPI)</span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SMS Webhook (Twilio)</span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slack Dispatcher</span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
