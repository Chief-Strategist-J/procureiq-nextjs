"use client";

import React, { useState, useEffect } from "react";
import { Activity, Bot, Bell, DollarSign, Plus, ArrowUpRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { DashboardApi } from "./api-client";

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
}

interface NotificationResponse {
  id: number;
  typeCode: string;
  sourceService: string;
  payload: Record<string, any>;
  metadata: Record<string, any>;
  priority: number;
  targetScope: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await DashboardApi.loadDashboardData();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const stats: StatCard[] = [
    { label: "Unread Notifications", value: unreadCount, icon: Bell },
    { label: "Active Agents", value: "4", icon: Bot },
    { label: "Avg Latency", value: "0.68s", change: "-0.09s vs last week", icon: Activity },
    { label: "Total Cost (MTD)", value: "$18.42", change: "+$2.10 this week", icon: DollarSign },
  ];

  const quickActions = [
    { label: "Dispatch Notification", description: "Create and broadcast a notification", href: "/notifications" },
    { label: "Field Service Work Orders", description: "Manage cases, accounts, and tasks", href: "/work-orders" },
    { label: "Configure Agents", description: "Set up procurement agents", href: "/agents" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-light tracking-tight">Welcome back</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Here&apos;s what&apos;s happening across your agents and system notifications today.
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
        {/* Recent Notifications */}
        <div className="lg:col-span-2 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
            <h2 className="text-sm font-medium">Recent Notifications</h2>
            <Link
              href="/notifications"
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 text-xs">
                    Loading dashboard info...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 text-xs">
                    No recent notifications.
                  </td>
                </tr>
              ) : (
                notifications.map((notif, i) => (
                  <tr
                    key={notif.id}
                    className={`text-zinc-350 hover:bg-zinc-900/40 transition-colors ${
                      i !== notifications.length - 1 ? "border-b border-zinc-800/70" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-xs font-mono text-zinc-400">{notif.typeCode}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-200 font-semibold">{notif.payload?.title || "No Title"}</span>
                        <span className="text-[10px] text-zinc-500 line-clamp-1">{notif.payload?.message}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        notif.status === "UNREAD" ? "bg-amber-950/60 text-amber-400" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {notif.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
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