import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex-1 w-full min-h-[75vh] bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-6 selection:bg-zinc-800">
      {/* Soft emerald radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.12_0.03_145/0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Loading Indicator with glowing orbit */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-full border border-zinc-800 bg-zinc-950/80 flex items-center justify-center relative shadow-xl">
            <Spinner className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5 text-center">
          <h3 className="text-sm font-light tracking-widest text-zinc-400 font-sans uppercase">
            ProcureIQ
          </h3>
          <p className="text-xs font-mono text-zinc-500 animate-pulse">
            Resolving cluster topology...
          </p>
        </div>
      </div>
    </div>
  );
}
