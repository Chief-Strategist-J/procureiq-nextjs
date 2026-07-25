"use client";

import React from "react";
import { Activity, Bot, Bell, DollarSign, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
}

export default function Home() {
  const loading = false;
  const unreadCount = 0;
  const notifications: any[] = [];

  const stats: StatCard[] = [
    { label: "Unread Notifications", value: unreadCount, icon: Bell },
    { label: "Active Agents", value: "4", icon: Bot },
    { label: "Avg Latency", value: "0.68s", change: "-0.09s vs last week", icon: Activity },
    { label: "Total Cost (MTD)", value: "$18.42", change: "+$2.10 this week", icon: DollarSign },
  ];

  const quickActions = [
    { label: "Crypto & Market Intelligence", description: "Real-time market tickers, orderbook and gainers", href: "/crypto" },
    { label: "Dispatch Notification", description: "Create and broadcast a notification", href: "/notifications" },
    { label: "Field Service Work Orders", description: "Manage cases, accounts, and tasks", href: "/work-orders" },
    { label: "Configure Agents", description: "Set up procurement agents", href: "/agents" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-xl font-light tracking-tight">Welcome back</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Here&apos;s what&apos;s happening across your agents and system notifications today.
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
            <h2 className="text-sm font-medium">Recent Notifications</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Title & Message</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 text-xs">
                  No recent notifications.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
            <h2 className="text-sm font-medium">Quick actions</h2>
          </div>
          <div className="p-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="w-full flex items-start gap-3 rounded-md px-3 py-3 text-left hover:bg-zinc-900/60 transition-colors block"
              >
                <div className="h-7 w-7 shrink-0 rounded-md border border-zinc-800 flex items-center justify-center mt-0.5">
                  <Plus className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <div>
                  <div className="text-sm text-white">{action.label}</div>
                  <div className="text-xs text-zinc-500">{action.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
