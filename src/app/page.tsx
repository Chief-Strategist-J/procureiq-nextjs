import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProcureIQ",
  description: "ProcureIQ Enterprise Procurement Platform",
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      <main className="flex flex-col items-center max-w-lg p-8 text-center space-y-6">
        <h1 className="text-4xl font-light tracking-tight">
          ProcureIQ
        </h1>
        <p className="text-zinc-400 text-sm font-light leading-relaxed">
          Enterprise procurement platform built on AlloyDB for PostgreSQL. Connect services, manage catalogs, and run AI-powered evaluations.
        </p>
        <div className="w-full h-px bg-zinc-800" />
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AlloyDB Local Ready
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-400">
            Node.js API Active
          </span>
        </div>
      </main>
    </div>
  );
}
