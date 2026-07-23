"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, RefreshCw, CheckCircle2, Phone, MessageSquare, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCreateReminderPageState, INITIAL_PEOPLE } from "@/features/reminders/CreateReminderPageState";
import { remindersActions } from "@/features/reminders/remindersSlice";

export default function CreateReminderPage() {
  const state = useCreateReminderPageState();

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative flex flex-col">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4 mb-8 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/reminders"
            className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Reminder Scheduler Console
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Configure trigger conditions, custom voice calls, SMS text, or team Slack reminders.
            </p>
          </div>
        </div>
      </div>

      {state.success && (
        <div className="mb-6 p-3.5 text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md w-full">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span className="font-medium">{state.success}</span>
        </div>
      )}

      <form onSubmit={state.handleCreateTask} className="space-y-8 flex-1 flex flex-col justify-between w-full">
        <div className="space-y-8 w-full">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-450">Reminder Details</h3>
            <p className="text-[11px] text-zinc-555 mt-0.5">Specify task configurations and dynamic AI prompts.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Task Title</label>
            <input 
              type="text"
              placeholder="e.g. Call vendor for contract renewal" 
              value={state.title} 
              onChange={e => state.dispatch(remindersActions.setFormField({ field: "title", value: e.target.value }))}
              className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Context/Instructions (AI Prompt)</label>
            <textarea 
              placeholder="Provide prompt details for the AI caller..." 
              value={state.description}
              onChange={e => state.dispatch(remindersActions.setFormField({ field: "description", value: e.target.value }))}
              className="w-full h-32 rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all resize-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          <div className="rounded-lg border border-zinc-850 bg-zinc-900/20 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-450">Recipient Contact Detail</label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500">Custom Recipient</span>
                <Switch 
                  checked={state.useCustomAssignee} 
                  onCheckedChange={(val) => state.dispatch(remindersActions.setFormField({ field: "useCustomAssignee", value: val }))}
                  className="scale-75"
                />
              </div>
            </div>

            {!state.useCustomAssignee ? (
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Select Standard Contact</label>
                <select
                  value={state.assigneeIndex}
                  onChange={e => {
                    state.dispatch(remindersActions.setFormField({ field: "assigneeIndex", value: e.target.value }));
                    const val = parseInt(e.target.value);
                    state.dispatch(remindersActions.setFormField({ field: "contactPreference", value: INITIAL_PEOPLE[val].channel }));
                  }}
                  className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700"
                >
                  {INITIAL_PEOPLE.map((p, idx) => (
                    <option key={idx} value={idx}>{p.name} ({p.contact})</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Name</label>
                  <input 
                    type="text"
                    placeholder="Recipient Name" 
                    value={state.customName}
                    onChange={e => state.dispatch(remindersActions.setFormField({ field: "customName", value: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3 text-xs text-white focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Phone / Channel ID</label>
                  <input 
                    type="text"
                    placeholder="+1555..." 
                    value={state.customContact}
                    onChange={e => state.dispatch(remindersActions.setFormField({ field: "customContact", value: e.target.value }))}
                    className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3 text-xs text-white focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Due Time</label>
              <input 
                type="datetime-local" 
                value={state.dueAt}
                onChange={e => state.dispatch(remindersActions.setFormField({ field: "dueAt", value: e.target.value }))}
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Priority Level</label>
              <select
                value={state.priority}
                onChange={e => state.dispatch(remindersActions.setFormField({ field: "priority", value: e.target.value }))}
                className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Preferred Dispatch Channel</label>
            <div className="grid grid-cols-3 gap-4 max-w-xl">
              {[
                { label: "Voice Call", value: "CALL", icon: Phone },
                { label: "SMS Text", value: "SMS", icon: MessageSquare },
                { label: "Slack Bot", value: "SLACK", icon: Send }
              ].map((channel) => (
                <button
                  key={channel.value}
                  type="button"
                  onClick={() => state.dispatch(remindersActions.setFormField({ field: "contactPreference", value: channel.value }))}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg border text-xs gap-1 cursor-pointer transition-all duration-300 ${
                    state.contactPreference === channel.value
                      ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
                      : "border-zinc-850 bg-zinc-900/20 text-zinc-505 hover:text-zinc-350 hover:border-zinc-750"
                  }`}
                >
                  <channel.icon className="w-4 h-4" />
                  <span>{channel.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Recurrence</label>
            <select
              value={state.recurrence}
              onChange={e => state.dispatch(remindersActions.setFormField({ field: "recurrence", value: e.target.value }))}
              className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
            >
              <option value="NONE">One-time Reminder</option>
              <option value="DAILY">Every Day</option>
              <option value="WEEKLY">Every Week</option>
              <option value="CUSTOM">Custom Cron</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 mt-12 border-t border-zinc-900">
          <Link
            href="/reminders"
            className="px-8 py-3 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-xs font-semibold cursor-pointer transition-all text-center"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={state.loading}
            className="px-10 py-3 rounded-lg bg-white text-black hover:bg-zinc-150 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            {state.loading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            Schedule Alert
          </Button>
        </div>
      </form>
    </div>
  );
}
