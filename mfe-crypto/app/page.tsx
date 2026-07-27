"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { Cpu, ShieldAlert, CheckCircle, Database, Coins } from "lucide-react"

export default function CryptoPage() {
  const [contracts, setContracts] = useState([
    { id: "CON-78891", type: "Vendor Service Agreement", value: "45,000 USD", status: "Active" },
    { id: "CON-78892", type: "Hardware Lease SLA", value: "12,500 USD", status: "Active" },
    { id: "CON-78893", type: "Cloud Credits Purchase", value: "150,000 USD", status: "Awaiting Signatures" },
  ])
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState("")

  const handleDeployContract = () => {
    setLoading(true)
    setLog("Initiating block sequence...")
    setTimeout(() => {
      setLog("Verifying signers credentials on AlloyDB...")
      setTimeout(() => {
        setLog("Deploying smart contract bytecode on virtual ledger...")
        setTimeout(() => {
          const newContract = {
            id: `CON-${Math.floor(10000 + Math.random() * 90000)}`,
            type: "Custom Equipment Purchase Bid",
            value: "85,200 USD",
            status: "Active"
          }
          setContracts([newContract, ...contracts])
          setLoading(false)
          setLog("")
        }, 1000)
      }, 1000)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 space-y-6 flex-1">
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-2">
            <Cpu className="h-8 w-8 text-amber-500 animate-pulse-glow" />
            <span>Crypto & Smart Contracts</span>
          </h1>
          <p className="text-muted-foreground text-sm">Distributed Ledger Auditing Portal linked to AlloyDB.</p>
        </div>
        <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs px-3 py-1.5 rounded-full font-mono font-semibold">
          <Coins className="h-4 w-4 mr-1" />
          <span>Ledger Port: 8991</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deployed Procurement Contracts</CardTitle>
            <CardDescription>Audited list of active cryptographic vendor agreements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground font-semibold text-xs uppercase">
                    <th className="py-3 px-2">Contract ID</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Total Value</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs font-mono">
                  {contracts.map((c) => (
                    <tr key={c.id} className="hover:bg-accent/30 transition-colors">
                      <td className="py-4 px-2 font-bold text-amber-500">{c.id}</td>
                      <td className="py-4 px-2 text-foreground font-sans">{c.type}</td>
                      <td className="py-4 px-2">{c.value}</td>
                      <td className="py-4 px-2 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === "Active" 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Deploy side panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deploy Smart Contract</CardTitle>
              <CardDescription>Verify signers database keys and deploy dynamic contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground leading-relaxed">
                Clicking Deploy will sign a new agreement with target vendor using audited cryptographic signatures, storing block logs in your AlloyDB container.
              </div>
              
              {loading ? (
                <div className="bg-muted p-3 rounded border font-mono text-[10px] text-amber-500 animate-pulse">
                  {log}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded">
                  <CheckCircle className="h-4 w-4" />
                  <span>Ledger state: Fully Synced</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleDeployContract} 
                disabled={loading} 
                className="w-full font-bold bg-amber-500 hover:bg-amber-600 text-slate-950"
              >
                {loading ? "Deploying..." : "Deploy Contract"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Platform Diagnostics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ledger Provider</span>
                <span className="font-mono">Hyperledger / AlloyDB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WS Node IP</span>
                <span className="font-mono text-amber-500">127.0.0.1:8991</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AlloyDB Sync</span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
