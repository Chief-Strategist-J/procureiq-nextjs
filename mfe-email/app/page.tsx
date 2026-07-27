"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { Mail, FileText, Check, Plus, PieChart } from "lucide-react"

export default function EmailPage() {
  const [templates, setTemplates] = useState([
    { id: "TMP-01", subject: "RFP Bid Invitation - Equipment Supply", status: "Ready", sentCount: 145 },
    { id: "TMP-02", subject: "Vendor Registration Approved", status: "Ready", sentCount: 420 },
    { id: "TMP-03", subject: "Contract Agreement Pending Signature", status: "Draft", sentCount: 0 },
  ])
  const [inputText, setInputText] = useState("")

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newTemplate = {
      id: `TMP-${Math.floor(10 + Math.random() * 90)}`,
      subject: inputText,
      status: "Draft",
      sentCount: 0
    }

    setTemplates([newTemplate, ...templates])
    setInputText("")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <Mail className="h-8 w-8 text-indigo-500 animate-pulse-glow" />
            <span>Email Campaigns Queue</span>
          </h1>
          <p className="text-muted-foreground text-sm">Design template drafts and audit outgoing mail servers.</p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
          <Mail className="h-4 w-4 mr-1" />
          <span>Email Port: 8994</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Email Templates Library</CardTitle>
            <CardDescription>Select and edit email campaign structures.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-xs">
              {templates.map((t) => (
                <div key={t.id} className="flex justify-between items-center gap-4 p-3 rounded border bg-card hover:bg-accent/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{t.subject}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono">{t.id} • Sent: <span className="font-bold text-foreground">{t.sentCount}</span> times</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    t.status === "Ready" 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  }`}>
                    {t.status}
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
              <CardTitle>Create Email Template</CardTitle>
              <CardDescription>Draft a new template subject structure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="temp-subject" className="text-xs font-semibold text-muted-foreground">Subject Line</label>
                  <input 
                    id="temp-subject"
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter email subject template..."
                    className="w-full bg-background border rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <Button type="submit" className="w-full font-bold bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center space-x-1">
                  <Plus className="h-4.5 w-4.5 mr-1" />
                  <span>Create Draft</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center space-x-1.5">
                <PieChart className="h-4 w-4 text-indigo-500" />
                <span>SMTP Server Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Host Target</span>
                <span className="font-mono">smtp.procureiq.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Encryption</span>
                <span className="font-mono text-emerald-500">STARTTLS (Port 587)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relay Status</span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
