"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorTestPage() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("Simulation triggered: Failed to fetch AlloyDB cluster topology due to replica sync lag.");
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-16 bg-black text-zinc-100 font-sans selection:bg-zinc-800">
      <Link 
        href="/" 
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white transition-all text-xs font-mono mb-8 uppercase"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <div className="space-y-6">
        <header className="space-y-2 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-2 text-red-500 text-xs font-mono uppercase tracking-widest">
            <Bug className="w-4 h-4" />
            Testing Environment
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">
            Error Boundary Playground
          </h1>
          <p className="text-zinc-500 text-sm font-light">
            Use this page to test the client-side recovery functionality of Next.js `error.tsx` error boundaries.
          </p>
        </header>

        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-medium text-white">How does it work?</h2>
          <p className="text-zinc-400 text-xs font-light leading-relaxed">
            In the Next.js App Router, any component within a route segment that throws an unhandled error will trigger the closest parent <code className="text-zinc-300 font-mono">error.tsx</code> file. 
            This prevents the entire app from crashing, showing a premium fallback UI and offering the user a retry action.
          </p>
          <div className="h-px bg-zinc-900" />
          
          <div className="flex flex-col gap-4">
            <div className="text-xs text-zinc-500 font-light flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              This will trigger a state change that throws an exception during React's render lifecycle.
            </div>
            
            <Button
              onClick={() => setShouldCrash(true)}
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 text-sm font-medium py-6 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              Simulate Client-Side Crash
            </Button>
          </div>
        </div>

        <div className="text-[10px] text-zinc-650 font-mono tracking-widest text-center">
          ProcureIQ Sandbox • Simulation Panel
        </div>
      </div>
    </div>
  );
}
