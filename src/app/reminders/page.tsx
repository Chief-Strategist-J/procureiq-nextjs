"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, Phone, MessageSquare, AlertCircle, Plus, Check, Clock, User, 
  Trash2, Play, RefreshCw, Send, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useRemindersPageState } from "@/features/reminders/RemindersPageState";

export default function RemindersPage() {
  const state = useRemindersPageState();

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      <header className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-md">
            <Clock className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              AI Follow-up & Reminders
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Configure scheduled AI voice call simulations, SMS pings, and tracking triggers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={state.handleRefresh}
            disabled={state.refreshing}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-850 bg-zinc-950/60 backdrop-blur-md px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/80 hover:border-zinc-800 transition-all duration-300 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${state.refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          
          <button
            onClick={() => state.router.push("/reminders/create")}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            <Plus className="h-4 w-4" />
            Schedule Follow-up
          </button>
        </div>
      </header>

      {state.error && (
        <div className="mb-6 p-3.5 text-xs bg-red-955/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="mb-6 p-3.5 text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span className="font-medium">{state.success}</span>
        </div>
      )}

      <div className="space-y-8">
        <Card className="border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-zinc-900/80 bg-zinc-900/10 px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium tracking-tight text-white">Scheduled follow-up queue</CardTitle>
              <CardDescription className="text-zinc-550 text-xs mt-0.5">
                Active automated alerts that trigger dynamically.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-zinc-800 text-zinc-400 bg-zinc-900/50 px-2.5 py-0.5 text-xs font-mono">
              {state.reminders.length} queued
            </Badge>
          </CardHeader>
          
          <CardContent className="p-0 divide-y divide-zinc-900">
            {state.loading && !state.refreshing ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <RefreshCw className="h-8 w-8 animate-spin text-zinc-650 mb-2" />
                <p className="text-xs">Loading reminder registry...</p>
              </div>
            ) : state.reminders.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-xs">
                No active scheduled alerts. Click &apos;Schedule Follow-up&apos; to schedule one.
              </div>
            ) : (
              state.reminders.map(reminder => (
                <div key={reminder.id} className="p-5 hover:bg-zinc-900/20 transition-all duration-300 flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-semibold text-white">{reminder.title}</h3>
                      <Badge variant="outline" className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-semibold ${state.getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </Badge>
                      {state.getStatusBadge(reminder.status)}
                      {reminder.recurrence !== "NONE" && (
                        <Badge variant="outline" className="border-zinc-800 text-zinc-505 bg-zinc-909/30 text-[9px] uppercase tracking-wider font-semibold">
                          {reminder.recurrence}
                        </Badge>
                      )}
                    </div>

                    <p className="text-zinc-455 text-xs leading-relaxed max-w-2xl font-light">
                      {reminder.description || "No custom AI prompt instructions."}
                    </p>

                    <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-mono">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-zinc-650" />
                        {reminder.assigneeName} ({reminder.assigneeContact})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-650" />
                        {new Date(reminder.dueAt).toLocaleString()}
                      </span>
                      {reminder.snoozeCount > 0 && (
                        <span className="text-amber-500">
                          Snoozed {reminder.snoozeCount}x
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => state.triggerCallSimulation(reminder)}
                      className="px-3 py-1.5 rounded border border-emerald-500/20 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50 hover:border-emerald-500/40 text-[10px] uppercase font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      Simulate
                    </button>
                    <button
                      onClick={() => state.handleDelete(reminder.id)}
                      className="p-1.5 rounded border border-zinc-850 hover:border-red-500/30 hover:bg-red-955/20 text-zinc-550 hover:text-red-400 transition-all duration-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-zinc-900/80 bg-zinc-900/10 px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium tracking-tight text-white">Trigger event log</CardTitle>
              <CardDescription className="text-zinc-550 text-xs mt-0.5">
                Real-time connection simulation logs and status callbacks.
              </CardDescription>
            </div>
            <button
              onClick={() => {
                state.dispatch(remindersActions.setFormField({ field: "logs", value: [] }));
                localStorage.setItem("procureiq_reminder_logs", JSON.stringify([]));
              }}
              className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-wider font-semibold border border-zinc-850 px-2 py-1 rounded bg-zinc-900/20 transition-all cursor-pointer"
            >
              Clear Logs
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="font-mono text-[11px] p-4 bg-zinc-950/90 max-h-60 overflow-y-auto space-y-2">
              {state.logs.map((log) => (
                <div key={log.id} className="text-zinc-400 flex items-start gap-2 leading-relaxed">
                  <span className="text-zinc-655 shrink-0">[{log.time}]</span>
                  <span className="text-indigo-400 shrink-0 font-medium">{log.taskTitle}:</span>
                  <span className="text-zinc-500 font-semibold shrink-0">({log.assigneeName} via {log.channel})</span>
                  <span className={`px-1 rounded shrink-0 uppercase text-[9px] font-semibold ${
                    log.status === "COMPLETED" ? "bg-emerald-950/40 text-emerald-400" :
                    log.status === "CALLING" ? "bg-blue-950/40 text-blue-400 animate-pulse" :
                    "bg-zinc-900 text-zinc-500"
                  }`}>{log.status}</span>
                  <span className="text-zinc-350">{log.details}</span>
                </div>
              ))}
              {state.logs.length === 0 && (
                <div className="text-center py-6 text-zinc-600 text-xs font-light">
                  Console logs are empty.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
