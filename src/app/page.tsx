"use client";

import { Activity, Bot, Clock, DollarSign, Plus, ArrowUpRight } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  change?: string;
  icon: React.ElementType;
}

const stats: StatCard[] = [
  { label: "Total Sessions", value: "142", change: "+12 this week", icon: Activity },
  { label: "Active Agents", value: "4", icon: Bot },
  { label: "Avg Latency", value: "0.68s", change: "-0.09s vs last week", icon: Clock },
  { label: "Total Cost (MTD)", value: "$18.42", change: "+$2.10 this week", icon: DollarSign },
];

interface RecentSession {
  id: string;
  roomId: string;
  createdAt: string;
  duration: string;
  status: "Closed" | "Active" | "Failed";
}

const recentSessions: RecentSession[] = [
  { id: "6a4693a56...", roomId: "rcdf-ir12-6ecb", createdAt: "02 Jul 2026 10:06 PM", duration: "1 min", status: "Closed" },
  { id: "6a4692884...", roomId: "oxbv-6btk-1yfd", createdAt: "02 Jul 2026 10:02 PM", duration: "1 min 48 secs", status: "Closed" },
  { id: "6a4691a12...", roomId: "mplk-9dtr-3xzq", createdAt: "01 Jul 2026 04:18 PM", duration: "3 min 12 secs", status: "Closed" },
];

function StatusBadge({ status }: { status: RecentSession["status"] }) {
  const styles: Record<RecentSession["status"], string> = {
    Closed: "bg-zinc-800 text-zinc-300",
    Active: "bg-emerald-950/60 text-emerald-400",
    Failed: "bg-red-950/60 text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

const quickActions = [
  { label: "Start a session", description: "Launch a new agent room" },
  { label: "Create an agent", description: "Configure a new procurement agent" },
  { label: "View documentation", description: "API and integration guides" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-light tracking-tight">Welcome back</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Here&apos;s what&apos;s happening across your agents today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-zinc-600" />
            </div>
            <div className="text-2xl font-light">{stat.value}</div>
            {stat.change && (
              <div className="text-xs text-zinc-500 mt-1">{stat.change}</div>
            )}
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent sessions */}
        <div className="lg:col-span-2 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
            <h2 className="text-sm font-medium">Recent sessions</h2>
            <a
              href="/sessions"
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                <th className="px-4 py-2 font-medium">Room ID</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Duration</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session, i) => (
                <tr
                  key={session.id}
                  className={`text-zinc-300 hover:bg-zinc-900/40 transition-colors ${
                    i !== recentSessions.length - 1 ? "border-b border-zinc-800/70" : ""
                  }`}
                >
                  <td className="px-4 py-3">{session.roomId}</td>
                  <td className="px-4 py-3 text-zinc-500">{session.createdAt}</td>
                  <td className="px-4 py-3">{session.duration}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={session.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick actions */}
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
            <h2 className="text-sm font-medium">Quick actions</h2>
          </div>
          <div className="p-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="w-full flex items-start gap-3 rounded-md px-3 py-3 text-left hover:bg-zinc-900/60 transition-colors"
              >
                <div className="h-7 w-7 shrink-0 rounded-md border border-zinc-800 flex items-center justify-center mt-0.5">
                  <Plus className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <div>
                  <div className="text-sm text-white">{action.label}</div>
                  <div className="text-xs text-zinc-500">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}