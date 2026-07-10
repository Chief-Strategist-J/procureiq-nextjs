"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, Plus, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Phone, MessageSquare, Send, Clock, User, Info, Database, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const INITIAL_PEOPLE = [
  { name: "John Doe (Project Lead)", contact: "+15550199", channel: "CALL" },
  { name: "Jane Smith (Legal Counsel)", contact: "+15550188", channel: "SMS" },
  { name: "Alex Rivera (Procurement Analyst)", contact: "#procure-alerts", channel: "SLACK" },
  { name: "Myself", contact: "+15550100", channel: "CALL" }
];

export default function CreateReminderPage() {
  const router = useRouter();
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [recurrence, setRecurrence] = useState("NONE");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [assigneeIndex, setAssigneeIndex] = useState("0");
  const [contactPreference, setContactPreference] = useState<"CALL" | "SMS" | "SLACK">("CALL");
  const [customName, setCustomName] = useState("");
  const [customContact, setCustomContact] = useState("");
  const [useCustomAssignee, setUseCustomAssignee] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Set default due time to 1 hour from now
    const oneHourAhead = new Date(Date.now() + 60 * 60 * 1000);
    setDueAt(oneHourAhead.toISOString().slice(0, 16));
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setSuccess("");

    let targetName = "";
    let targetContact = "";

    if (useCustomAssignee) {
      targetName = customName || "External Recipient";
      targetContact = customContact || "No contact info";
    } else {
      const selected = INITIAL_PEOPLE[parseInt(assigneeIndex)];
      targetName = selected.name;
      targetContact = selected.contact;
    }

    const payload = {
      title,
      description,
      dueAt: new Date(dueAt).toISOString(),
      recurrence,
      priority,
      contactPreference,
      assigneeName: targetName,
      assigneeContact: targetContact,
      status: "PENDING",
      snoozeCount: 0
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${backendUrl}/api/v1/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule reminder on backend");
      }

      setSuccess("AI Reminder task scheduled successfully!");
    } catch (err: any) {
      console.warn("Backend offline. Scheduling reminder locally in sandbox database.", err);
      
      const newReminder = {
        ...payload,
        id: Math.random().toString(36).substring(2, 9),
      };

      // Save to LocalStorage
      const stored = localStorage.getItem("procureiq_reminders");
      const currentReminders = stored ? JSON.parse(stored) : [];
      localStorage.setItem("procureiq_reminders", JSON.stringify([newReminder, ...currentReminders]));

      setSuccess("[Offline Sandbox] AI Reminder task scheduled successfully!");
    } finally {
      // Add log locally
      const storedLogs = localStorage.getItem("procureiq_reminder_logs");
      const currentLogs = storedLogs ? JSON.parse(storedLogs) : [];
      const newLog = {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        taskTitle: title,
        assigneeName: targetName,
        channel: contactPreference,
        status: "SENT",
        details: `Scheduled reminder successfully for ${new Date(dueAt).toLocaleString()}`
      };
      localStorage.setItem("procureiq_reminder_logs", JSON.stringify([newLog, ...currentLogs]));

      setLoading(false);
      setTimeout(() => {
        router.push("/reminders");
      }, 1500);
    }
  };

  const getGeneratedJSON = () => {
    let targetName = "";
    let targetContact = "";

    if (useCustomAssignee) {
      targetName = customName || "External Recipient";
      targetContact = customContact || "No contact info";
    } else {
      const selected = INITIAL_PEOPLE[parseInt(assigneeIndex)];
      targetName = selected.name;
      targetContact = selected.contact;
    }

    return JSON.stringify(
      {
        title,
        description,
        dueAt,
        recurrence,
        priority,
        contactPreference,
        assignee: {
          name: targetName,
          contact: targetContact,
        },
        status: "PENDING",
      },
      null,
      2
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative flex flex-col">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
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

      {success && (
        <div className="mb-6 p-3.5 text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md w-full">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch">
        
        {/* Left Side: Create Form (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-800 bg-zinc-950/30 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <form onSubmit={handleCreateTask} className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">Reminder details</h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Task Title</label>
              <input 
                type="text"
                placeholder="e.g. Call vendor for contract renewal" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Context/Instructions (AI Prompt)</label>
              <textarea 
                placeholder="Provide prompt details for the AI caller..." 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full h-24 rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all resize-none"
              />
            </div>

            {/* Contact selection section */}
            <div className="rounded-lg border border-zinc-850 bg-zinc-900/20 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-400">Recipient Contact Detail</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500">Custom Recipient</span>
                  <Switch 
                    checked={useCustomAssignee} 
                    onCheckedChange={setUseCustomAssignee}
                    className="scale-75"
                  />
                </div>
              </div>

              {!useCustomAssignee ? (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Select Standard Contact</label>
                  <select
                    value={assigneeIndex}
                    onChange={e => {
                      setAssigneeIndex(e.target.value);
                      const val = parseInt(e.target.value);
                      setContactPreference(INITIAL_PEOPLE[val].channel as any);
                    }}
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                  >
                    {INITIAL_PEOPLE.map((p, idx) => (
                      <option key={idx} value={idx}>{p.name} ({p.contact})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Name</label>
                    <input 
                      type="text"
                      placeholder="Recipient Name" 
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-medium">Phone / Channel ID</label>
                    <input 
                      type="text"
                      placeholder="+1555..." 
                      value={customContact}
                      onChange={e => setCustomContact(e.target.value)}
                      className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-semibold">Due Time</label>
                <input 
                  type="datetime-local" 
                  value={dueAt}
                  onChange={e => setDueAt(e.target.value)}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-semibold">Priority Level</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-555 uppercase tracking-widest block font-semibold">Preferred Dispatch Channel</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Voice Call", value: "CALL", icon: Phone },
                  { label: "SMS Text", value: "SMS", icon: MessageSquare },
                  { label: "Slack Bot", value: "SLACK", icon: Send }
                ].map((channel) => (
                  <button
                    key={channel.value}
                    type="button"
                    onClick={() => setContactPreference(channel.value as any)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg border text-xs gap-1 cursor-pointer transition-all duration-300 ${
                      contactPreference === channel.value
                        ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    <channel.icon className="w-4 h-4" />
                    <span>{channel.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">Recurrence</label>
              <select
                value={recurrence}
                onChange={e => setRecurrence(e.target.value)}
                className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
              >
                <option value="NONE">One-time Reminder</option>
                <option value="DAILY">Every Day</option>
                <option value="WEEKLY">Every Week</option>
                <option value="CUSTOM">Custom Cron</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900">
              <Link
                href="/reminders"
                className="px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all text-center"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-white text-black hover:bg-zinc-150 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
              >
                {loading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                Schedule Alert
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side: Instructions and JSON preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Follow-up Rules
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>The AI Engine parses the Context Prompt to conduct conversational calls with target recipients.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span><strong>Voice Calls:</strong> Simulates active phone rings and processes transcripts in real time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span><strong>Slack/SMS:</strong> Pings custom API payloads to selected channels.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/20 backdrop-blur-md p-6 flex-1 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-indigo-400" />
                Live Job Object (JSON)
              </h3>
              <div className="relative rounded-lg bg-zinc-900/80 border border-zinc-850 p-4 font-mono text-[10px] text-zinc-400 overflow-x-auto h-72">
                <pre>{getGeneratedJSON()}</pre>
              </div>
            </div>
            <div className="text-[10px] text-zinc-550 mt-4 leading-normal flex items-start gap-2">
              <Info className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span>
                Task metadata is queued inside the scheduler state. Executions are simulated client-side.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
