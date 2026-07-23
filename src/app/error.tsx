"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, ChevronRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("ProcureIQ Runtime Boundary Error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] bg-black text-white relative overflow-hidden px-6 selection:bg-zinc-800">
      {}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,oklch(0.12_0.04_25/0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-xl text-center space-y-8 flex flex-col items-center w-full">
        {}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl animate-pulse" />
          <div className="w-20 h-20 rounded-full border border-red-500/20 bg-zinc-950 flex items-center justify-center relative shadow-2xl">
            <AlertOctagon className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {}
        <div className="space-y-3">
          <h1 className="text-4xl font-extralight tracking-tight text-white">
            System Collision Detected
          </h1>
          <p className="text-zinc-500 text-sm font-light leading-relaxed max-w-md mx-auto">
            An unexpected error occurred during execution. The telemetry system has cataloged this event.
          </p>
        </div>

        {}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-sm">
          <Button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full px-6 py-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-sm font-medium active:scale-95 transition-all text-center"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {}
        <div className="w-full max-w-md border border-zinc-900 bg-zinc-950/60 rounded-xl overflow-hidden backdrop-blur-md">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all border-b border-zinc-950"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-red-400/80" />
              Technical Diagnostics
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                showDetails ? "rotate-90 text-zinc-200" : "text-zinc-500"
              }`}
            />
          </button>
          
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showDetails ? "max-h-[300px] border-t border-zinc-900" : "max-h-0"
            }`}
          >
            <div className="p-4 text-left font-mono text-[11px] space-y-3 bg-black/40 overflow-y-auto max-h-[280px]">
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-0.5">Message</span>
                <span className="text-red-400/90">{error.message || "An anonymous client-side error occurred."}</span>
              </div>
              {error.digest && (
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-0.5">Telemetry Digest</span>
                  <span className="text-zinc-300 select-all">{error.digest}</span>
                </div>
              )}
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-0.5">Stack Trace Status</span>
                <span className="text-zinc-400">
                  Reported via OTel OpenTelemetry Exporter v1.30.0
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-zinc-650 font-mono tracking-widest uppercase">
          ProcureIQ Dispatch Layer • Error Code 0x5E2
        </div>
      </div>
    </div>
  );
}
