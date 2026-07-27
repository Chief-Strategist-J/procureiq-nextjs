"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { Megaphone, Plus, Percent, Users, Award } from "lucide-react"

export default function CampaignsPage() {
  const [bids, setBids] = useState([
    { id: "BID-401", title: "Enterprise Database Hardware Procurement", responses: 12, rate: "85%", status: "Active" },
    { id: "BID-402", title: "Office Workspace Refurbishment", responses: 6, rate: "60%", status: "Active" },
    { id: "BID-403", title: "Global Logistics and Cargo Supply Chain", responses: 15, rate: "90%", status: "Closed" },
  ])
  const [inputText, setInputText] = useState("")

  const handleCreateBid = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newBid = {
      id: `BID-${Math.floor(400 + Math.random() * 100)}`,
      title: inputText,
      responses: 0,
      rate: "0%",
      status: "Active"
    }

    setBids([newBid, ...bids])
    setInputText("")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <Megaphone className="h-8 w-8 text-violet-500 animate-pulse-glow" />
            <span>Procurement Campaigns</span>
          </h1>
          <p className="text-muted-foreground text-sm">Create Requests For Proposals (RFPs) and track live vendor bidding.</p>
        </div>
        <div className="flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 text-violet-500 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
          <Megaphone className="h-4 w-4 mr-1" />
          <span>Campaigns Port: 8995</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active RFP Bidding Campaigns</CardTitle>
            <CardDescription>Live stats on incoming proposal packages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-xs">
              {bids.map((b) => (
                <div key={b.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 rounded border bg-card hover:bg-accent/20 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded bg-violet-500/10 border border-violet-500/20 text-violet-500">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{b.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono">{b.id} • Responded: <span className="font-bold text-foreground">{b.responses}</span> vendors</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 self-end sm:self-auto">
                    <span className="flex items-center text-xs font-semibold text-violet-500">
                      <Percent className="h-3.5 w-3.5 mr-0.5" />
                      <span>{b.rate}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      b.status === "Active" 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}>
                      {b.status}
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
              <CardTitle>Launch RFP Campaign</CardTitle>
              <CardDescription>Initiate a new procurement proposal run.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBid} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="bid-title" className="text-xs font-semibold text-muted-foreground">Campaign Title</label>
                  <input 
                    id="bid-title"
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter RFP bidding project name..."
                    className="w-full bg-background border rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
                <Button type="submit" className="w-full font-bold bg-violet-500 hover:bg-violet-600 text-white flex items-center justify-center space-x-1">
                  <Plus className="h-4.5 w-4.5 mr-1" />
                  <span>Launch Campaign</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center space-x-1.5">
                <Users className="h-4 w-4 text-violet-500" />
                <span>Vendor Reach Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registered Bidders</span>
                <span className="font-semibold">324 vendors</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Response Time</span>
                <span className="font-mono text-emerald-500">1.8 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campaign Success Rate</span>
                <span className="text-emerald-500 font-semibold">94.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
