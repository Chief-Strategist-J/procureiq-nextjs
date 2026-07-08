import Link from "next/link";
import { Compass, Home, CornerDownLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] bg-black text-white relative overflow-hidden px-6 selection:bg-zinc-800">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,oklch(0.15_0.05_140/0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-xl text-center space-y-8 flex flex-col items-center">
        {/* Animated Compass Icon with Glowing Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
          <div className="w-20 h-20 rounded-full border border-emerald-500/20 bg-zinc-950 flex items-center justify-center relative shadow-2xl">
            <Compass className="w-10 h-10 text-emerald-400 animate-[spin_120s_linear_infinite]" />
          </div>
        </div>

        {/* 404 Status */}
        <div className="space-y-3">
          <h1 className="text-8xl font-extralight tracking-tighter text-emerald-400 font-mono">
            404
          </h1>
          <h2 className="text-3xl font-light tracking-tight text-white">
            Lost in the Catalog
          </h2>
          <p className="text-zinc-500 text-sm font-light leading-relaxed max-w-md mx-auto">
            The procurement route or resource you are looking for has expired, been relocated, or is temporarily archived.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 active:scale-95 transition-all shadow-lg shadow-white/5"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/reminders"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-sm font-medium active:scale-95 transition-all"
          >
            <CornerDownLeft className="w-4 h-4 text-emerald-500" />
            <span>Reminders Agent</span>
          </Link>
        </div>

        {/* Decorative micro-feedback */}
        <div className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
          ProcureIQ Dispatch Layer • Error Code 0x1A4
        </div>
      </div>
    </div>
  );
}
