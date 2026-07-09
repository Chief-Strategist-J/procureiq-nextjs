"use client";

import { useState } from "react";
import { Search, Clock, MoreVertical } from "lucide-react";

interface Session {
  id: string;
  roomId: string;
  createdAt: string;
  duration: string;
  latency: string;
  latencyGood: boolean;
  totalCost: string;
  recording: string;
  status: "Closed" | "Active" | "Failed";
}

const sessions: Session[] = [
  {
    id: "6a4693a56...",
    roomId: "rcdf-ir12-6ecb",
    createdAt: "02 Jul 2026 10:06 PM",
    duration: "1 min",
    latency: "0.42s",
    latencyGood: true,
    totalCost: "~$0.0879",
    recording: "-",
    status: "Closed",
  },
  {
    id: "6a4692884...",
    roomId: "oxbv-6btk-1yfd",
    createdAt: "02 Jul 2026 10:02 PM",
    duration: "1 min 48 secs",
    latency: "1.16s",
    latencyGood: true,
    totalCost: "~$0.0469",
    recording: "-",
    status: "Closed",
  },
];

function StatusBadge({ status }: { status: Session["status"] }) {
  const styles: Record<Session["status"], string> = {
    Closed: "bg-zinc-800 text-zinc-300",
    Active: "bg-emerald-950/60 text-emerald-400",
    Failed: "bg-red-950/60 text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function SessionsPage() {
  const [query, setQuery] = useState("");

  const filtered = sessions.filter(
    (s) =>
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.roomId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl font-light tracking-tight">Sessions</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-56 rounded-md bg-zinc-900 border border-zinc-800 pl-8 pr-12 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
          <span className="hidden sm:inline absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 border border-zinc-800 rounded px-1 py-0.5">
            Ctrl+K
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="bg-zinc-900/80 text-left text-xs text-zinc-300 border-b border-zinc-800">
                <th className="px-4 py-3 font-medium whitespace-nowrap">Session ID</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Room ID</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Created At</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Duration</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Latency</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Total Cost</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Recording</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((session, i) => (
                <tr
                  key={session.id}
                  className={`text-zinc-300 hover:bg-zinc-900/40 transition-colors ${
                    i !== filtered.length - 1 ? "border-b border-zinc-800/70" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{session.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{session.roomId}</td>
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{session.createdAt}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{session.duration}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 px-2 py-0.5 text-xs">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      <span className={session.latencyGood ? "text-emerald-400" : "text-amber-400"}>
                        {session.latency}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{session.totalCost}</td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{session.recording}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-zinc-500 text-xs">
                    No sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}