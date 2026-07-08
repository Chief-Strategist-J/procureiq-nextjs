"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Package, BellOff, History, Sparkles, 
  DownloadCloud, Activity, Database, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia
} from "@/components/ui/empty";

type Scenario = "catalog" | "inbox" | "audit";

export default function EmptyShowcasePage() {
  const [activeScenario, setActiveScenario] = useState<Scenario>("catalog");
  const [isSimulating, setIsSimulating] = useState(false);

  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-16 bg-black text-zinc-100 font-sans selection:bg-zinc-800">
      
      {/* Back Link */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white transition-all text-xs font-mono mb-8 uppercase"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <div className="space-y-8">
        {/* Header */}
        <header className="space-y-2 border-b border-zinc-900 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive UI Kit
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Zero State Templates
            </h1>
            <p className="text-zinc-500 text-sm font-light">
              Showcasing premium interactive empty state designs utilizing reusable empty-layout structures.
            </p>
          </div>

          {/* Interactive Scenario Toggles */}
          <div className="flex bg-zinc-950 border border-zinc-900 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setActiveScenario("catalog")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${
                activeScenario === "catalog" 
                  ? "bg-zinc-800 text-white shadow" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => setActiveScenario("inbox")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${
                activeScenario === "inbox" 
                  ? "bg-zinc-800 text-white shadow" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Inbox
            </button>
            <button
              onClick={() => setActiveScenario("audit")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${
                activeScenario === "audit" 
                  ? "bg-zinc-800 text-white shadow" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Audit Logs
            </button>
          </div>
        </header>

        {/* Demo Stage */}
        <div className="border border-zinc-900 bg-zinc-950/40 rounded-2xl p-8 md:p-16 flex items-center justify-center min-h-[400px] relative overflow-hidden backdrop-blur-md">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
          
          {/* Glowing node in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

          {activeScenario === "catalog" && (
            <Empty className="max-w-md w-full relative z-10 border border-zinc-900 bg-black/50 p-8 rounded-xl shadow-2xl">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-12 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400">
                  <Database className="w-5 h-5" />
                </EmptyMedia>
                <EmptyTitle className="text-white text-base font-normal tracking-tight mt-2">
                  No Procurement Catalogs Loaded
                </EmptyTitle>
                <EmptyDescription className="text-zinc-500 text-xs mt-1">
                  Connect to your AlloyDB instance or upload a catalog schema file to start querying vendor supplies.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button 
                    onClick={triggerSimulation}
                    disabled={isSimulating}
                    className="flex-1 bg-white hover:bg-zinc-200 text-black text-xs font-medium cursor-pointer"
                  >
                    <DownloadCloud className="w-3.5 h-3.5 mr-1.5" />
                    {isSimulating ? "Importing..." : "Import Catalog"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={triggerSimulation}
                    disabled={isSimulating}
                    className="flex-1 border-zinc-850 hover:bg-zinc-900 text-zinc-300 text-xs"
                  >
                    Generate Seed Data
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          )}

          {activeScenario === "inbox" && (
            <Empty className="max-w-md w-full relative z-10 border border-zinc-900 bg-black/50 p-8 rounded-xl shadow-2xl">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-12 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400">
                  <BellOff className="w-5 h-5" />
                </EmptyMedia>
                <EmptyTitle className="text-white text-base font-normal tracking-tight mt-2">
                  Notification Dispatch Queue Empty
                </EmptyTitle>
                <EmptyDescription className="text-zinc-500 text-xs mt-1">
                  All active reminder calls, SMS alerts, and Slack notifications have been successfully resolved.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-4">
                <Link href="/reminders" className="w-full">
                  <Button className="w-full bg-white hover:bg-zinc-200 text-black text-xs font-medium">
                    Schedule Reminder Call
                  </Button>
                </Link>
              </EmptyContent>
            </Empty>
          )}

          {activeScenario === "audit" && (
            <Empty className="max-w-md w-full relative z-10 border border-zinc-900 bg-black/50 p-8 rounded-xl shadow-2xl">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-12 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400">
                  <History className="w-5 h-5" />
                </EmptyMedia>
                <EmptyTitle className="text-white text-base font-normal tracking-tight mt-2">
                  Audit History Uninitialized
                </EmptyTitle>
                <EmptyDescription className="text-zinc-500 text-xs mt-1">
                  Event logging streams have not recorded any transaction events yet. Turn on streams to inspect events.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-4">
                <Button 
                  onClick={triggerSimulation}
                  disabled={isSimulating}
                  variant="outline" 
                  className="w-full border-zinc-850 hover:bg-zinc-900 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  <Activity className={`w-3.5 h-3.5 mr-1.5 ${isSimulating ? "animate-spin" : ""}`} />
                  {isSimulating ? "Connecting stream..." : "Initialize Logging Pipeline"}
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>

        {/* Informative Footer Box */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-white">Component Architecture Note</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              These states are built composing subcomponents of <code className="text-zinc-300 font-mono">src/components/ui/empty.tsx</code>. 
              By nesting <code className="text-zinc-400 font-mono">EmptyMedia</code>, <code className="text-zinc-400 font-mono">EmptyHeader</code>, 
              and <code className="text-zinc-400 font-mono">EmptyContent</code>, developers can rapidly compile consistent zero-state interfaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
