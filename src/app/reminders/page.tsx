"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, Phone, MessageSquare, AlertCircle, Plus, Check, Clock, User, 
  Trash2, Play, RefreshCw, Send, CheckCircle2, Volume2, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface TaskReminder {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  recurrence: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  contactPreference: "CALL" | "SMS" | "SLACK";
  assigneeName: string;
  assigneeContact: string;
  status: "PENDING" | "COMPLETED" | "SNOOZED" | "FAILED";
  snoozeCount: number;
}

interface DispatchLog {
  id: string;
  time: string;
  taskTitle: string;
  assigneeName: string;
  channel: "CALL" | "SMS" | "SLACK";
  status: "CALLING" | "SENT" | "SNOOZED" | "COMPLETED" | "NO_ANSWER";
  details: string;
}

const INITIAL_PEOPLE = [
  { name: "John Doe (Project Lead)", contact: "+15550199", channel: "CALL" },
  { name: "Jane Smith (Legal Counsel)", contact: "+15550188", channel: "SMS" },
  { name: "Alex Rivera (Procurement Analyst)", contact: "#procure-alerts", channel: "SLACK" },
  { name: "Myself", contact: "+15550100", channel: "CALL" }
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<TaskReminder[]>([]);
  const [logs, setLogs] = useState<DispatchLog[]>([]);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [recurrence, setRecurrence] = useState("NONE");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [assigneeIndex, setAssigneeIndex] = useState("0");
  const [contactPreference, setContactPreference] = useState<"CALL" | "SMS" | "SLACK">("CALL");
  
  // Custom contact details override
  const [customName, setCustomName] = useState("");
  const [customContact, setCustomContact] = useState("");
  const [useCustomAssignee, setUseCustomAssignee] = useState(false);

  useEffect(() => {
    // Load existing reminders from localStorage or seed initial tasks
    const storedReminders = localStorage.getItem("procureiq_reminders");
    const storedLogs = localStorage.getItem("procureiq_reminder_logs");
    
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    } else {
      const seedReminders: TaskReminder[] = [
        {
          id: "1",
          title: "Verify Vendor Insurance Certificates",
          description: "Follow up on the expired general liability certificate for Acme Corp.",
          dueAt: new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 16), // 10 mins from now
          recurrence: "NONE",
          priority: "HIGH",
          contactPreference: "CALL",
          assigneeName: "John Doe (Project Lead)",
          assigneeContact: "+15550199",
          status: "PENDING",
          snoozeCount: 0
        },
        {
          id: "2",
          title: "Sign SLA Contract Addendum",
          description: "Final addendum approval needed for vendor onboarding.",
          dueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
          recurrence: "NONE",
          priority: "HIGH",
          contactPreference: "SMS",
          assigneeName: "Jane Smith (Legal Counsel)",
          assigneeContact: "+15550188",
          status: "PENDING",
          snoozeCount: 0
        },
        {
          id: "3",
          title: "Review Quarter Bid Submissions",
          description: "Verify that all 3 submitted RFPs have matched standard requirements.",
          dueAt: new Date(Date.now() - 5 * 60 * 1000).toISOString().slice(0, 16),
          recurrence: "WEEKLY",
          priority: "MEDIUM",
          contactPreference: "SLACK",
          assigneeName: "Alex Rivera (Procurement Analyst)",
          assigneeContact: "#procure-alerts",
          status: "SNOOZED",
          snoozeCount: 1
        }
      ];
      setReminders(seedReminders);
      localStorage.setItem("procureiq_reminders", JSON.stringify(seedReminders));
    }

    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      const seedLogs: DispatchLog[] = [
        {
          id: "101",
          time: new Date(Date.now() - 120 * 60 * 1000).toLocaleTimeString(),
          taskTitle: "Review Quarter Bid Submissions",
          assigneeName: "Alex Rivera",
          channel: "SLACK",
          status: "SNOOZED",
          details: "Slack ping sent. User replied: 'snooze 15m'."
        },
        {
          id: "102",
          time: new Date(Date.now() - 105 * 60 * 1000).toLocaleTimeString(),
          taskTitle: "Review Quarter Bid Submissions",
          assigneeName: "Alex Rivera",
          channel: "SLACK",
          status: "SENT",
          details: "Rescheduled Slack alert dispatched."
        }
      ];
      setLogs(seedLogs);
      localStorage.setItem("procureiq_reminder_logs", JSON.stringify(seedLogs));
    }

    // Set default due time to 1 hour from now
    const oneHourAhead = new Date(Date.now() + 60 * 60 * 1000);
    setDueAt(oneHourAhead.toISOString().slice(0, 16));
  }, []);

  const saveToStorage = (newReminders: TaskReminder[], newLogs?: DispatchLog[]) => {
    setReminders(newReminders);
    localStorage.setItem("procureiq_reminders", JSON.stringify(newReminders));
    if (newLogs) {
      setLogs(newLogs);
      localStorage.setItem("procureiq_reminder_logs", JSON.stringify(newLogs));
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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

    const newReminder: TaskReminder = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      dueAt,
      recurrence,
      priority,
      contactPreference,
      assigneeName: targetName,
      assigneeContact: targetContact,
      status: "PENDING",
      snoozeCount: 0
    };

    const updated = [newReminder, ...reminders];
    saveToStorage(updated);

    // Reset Form
    setTitle("");
    setDescription("");
    // Add log
    addLogEntry(title, targetName, contactPreference, "SENT", `Scheduled reminder successfully for ${new Date(dueAt).toLocaleString()}`);
  };

  const addLogEntry = (
    taskTitle: string, 
    assigneeName: string, 
    channel: "CALL" | "SMS" | "SLACK", 
    status: DispatchLog["status"], 
    details: string
  ) => {
    const newLog: DispatchLog = {
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      taskTitle,
      assigneeName,
      channel,
      status,
      details
    };
    const updatedLogs = [newLog, ...logs].slice(0, 20); // Keep last 20
    setLogs(updatedLogs);
    localStorage.setItem("procureiq_reminder_logs", JSON.stringify(updatedLogs));
  };

  const handleDelete = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    saveToStorage(updated);
  };

  const triggerCallSimulation = (reminder: TaskReminder) => {
    // Add dynamic log showing active AI call simulation
    addLogEntry(
      reminder.title,
      reminder.assigneeName,
      reminder.contactPreference,
      reminder.contactPreference === "CALL" ? "CALLING" : "SENT",
      `System dispatched active AI ${reminder.contactPreference.toLowerCase()} to ${reminder.assigneeName} (${reminder.assigneeContact})`
    );

    // Simulate callback behavior after 2 seconds
    setTimeout(() => {
      const options = [
        { status: "COMPLETED", detail: "User confirmed completion: 'Yes, just completed it.'" },
        { status: "SNOOZED", detail: "User requested snooze: 'Snooze this for 30 minutes.'" },
        { status: "NO_ANSWER", detail: "Call was unanswered or rejected." }
      ];
      // Random response
      const outcome = options[Math.floor(Math.random() * options.length)];
      
      const updated = reminders.map(r => {
        if (r.id === reminder.id) {
          return {
            ...r,
            status: (outcome.status === "NO_ANSWER" ? "PENDING" : outcome.status) as TaskReminder["status"],
            snoozeCount: outcome.status === "SNOOZED" ? r.snoozeCount + 1 : r.snoozeCount
          };
        }
        return r;
      });

      addLogEntry(
        reminder.title,
        reminder.assigneeName,
        reminder.contactPreference,
        outcome.status as DispatchLog["status"],
        `Agent feedback loop: ${outcome.detail}`
      );
      
      saveToStorage(updated);
    }, 2000);
  };

  const getPriorityColor = (p: TaskReminder["priority"]) => {
    switch (p) {
      case "HIGH": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "MEDIUM": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "LOW": return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const getStatusBadge = (s: TaskReminder["status"]) => {
    switch (s) {
      case "PENDING": return <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 gap-1.5"><Clock className="w-3 h-3" /> Scheduled</Badge>;
      case "COMPLETED": return <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 gap-1.5"><Check className="w-3 h-3" /> Completed</Badge>;
      case "SNOOZED": return <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/5 gap-1.5"><RefreshCw className="w-3 h-3 animate-spin-slow" /> Snoozed</Badge>;
      case "FAILED": return <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5 gap-1.5"><AlertCircle className="w-3 h-3" /> Call Failed</Badge>;
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 bg-black text-zinc-100 font-sans selection:bg-zinc-800">
      
      {/* Title Header */}
      <header className="mb-10 text-left border-b border-zinc-900 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Dispatch Layer Active
          </div>
          <h1 className="text-3xl font-extralight tracking-tight text-white mb-2">
            Proactive Reminder Agent
          </h1>
          <p className="text-zinc-500 text-sm max-w-2xl font-light">
            Assign tasks that call or message team members automatically when due. Integrates LLM conversations and VideoSDK telephony for active task follow-ups.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Create Form */}
        <section className="lg:col-span-4">
          <Card className="bg-zinc-950 border-zinc-900 shadow-xl shadow-black/40 backdrop-blur-md">
            <CardHeader className="border-b border-zinc-900">
              <CardTitle className="text-lg font-light tracking-tight text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                Schedule New Reminder
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs">
                AI will generate custom reminder text dynamically based on description.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateTask}>
              <CardContent className="space-y-4 pt-5">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Task Title</label>
                  <Input 
                    placeholder="e.g. Call vendor for contract renewal" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="bg-black border-zinc-800 focus:border-zinc-700 text-zinc-100 text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Context/Instructions (AI Prompt)</label>
                  <Textarea 
                    placeholder="Context for AI. (e.g. Remind them addendum is overdue and ask if they can sign it now.)" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="bg-black border-zinc-800 focus:border-zinc-700 text-zinc-100 text-sm min-h-[80px]"
                  />
                </div>

                {/* Assignee Selection */}
                <div className="space-y-3 p-3 rounded-lg border border-zinc-900 bg-black/40">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-zinc-400">Assign To (Contact)</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-zinc-500">Custom Recipient</span>
                      <Switch 
                        checked={useCustomAssignee} 
                        onCheckedChange={setUseCustomAssignee}
                        className="scale-75"
                      />
                    </div>
                  </div>

                  {!useCustomAssignee ? (
                    <select
                      value={assigneeIndex}
                      onChange={e => {
                        setAssigneeIndex(e.target.value);
                        // Auto-align channel preference to matching standard channel
                        const val = parseInt(e.target.value);
                        setContactPreference(INITIAL_PEOPLE[val].channel as any);
                      }}
                      className="w-full h-9 rounded-md border border-zinc-800 bg-black px-3 py-1 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
                    >
                      {INITIAL_PEOPLE.map((p, idx) => (
                        <option key={idx} value={idx}>{p.name} ({p.contact})</option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <Input 
                        placeholder="Recipient Name" 
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        className="bg-black border-zinc-800 focus:border-zinc-700 text-zinc-100 text-xs"
                      />
                      <Input 
                        placeholder="Phone Number / Channel URL" 
                        value={customContact}
                        onChange={e => setCustomContact(e.target.value)}
                        className="bg-black border-zinc-800 focus:border-zinc-700 text-zinc-100 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Grid for Due At & Preference */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">Due Time</label>
                    <Input 
                      type="datetime-local" 
                      value={dueAt}
                      onChange={e => setDueAt(e.target.value)}
                      required
                      className="bg-black border-zinc-800 focus:border-zinc-700 text-zinc-100 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">Priority</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as any)}
                      className="w-full h-9 rounded-md border border-zinc-800 bg-black px-3 py-1 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                {/* Contact Preference */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Preferred Dispatch Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setContactPreference("CALL")}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-lg border text-xs gap-1 transition-all ${
                        contactPreference === "CALL" 
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" 
                          : "border-zinc-900 bg-black text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      <span>Voice Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactPreference("SMS")}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-lg border text-xs gap-1 transition-all ${
                        contactPreference === "SMS" 
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" 
                          : "border-zinc-900 bg-black text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>SMS Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactPreference("SLACK")}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-lg border text-xs gap-1 transition-all ${
                        contactPreference === "SLACK" 
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" 
                          : "border-zinc-900 bg-black text-zinc-400 hover:border-zinc-800"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>Slack Bot</span>
                    </button>
                  </div>
                </div>

                {/* Recurrence */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Recurrence</label>
                  <select
                    value={recurrence}
                    onChange={e => setRecurrence(e.target.value)}
                    className="w-full h-9 rounded-md border border-zinc-800 bg-black px-3 py-1 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="NONE">One-time Reminder</option>
                    <option value="DAILY">Every Day</option>
                    <option value="WEEKLY">Every Week</option>
                    <option value="CUSTOM">Custom Cron</option>
                  </select>
                </div>

              </CardContent>
              <CardFooter className="border-t border-zinc-900 pt-4">
                <Button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-medium transition-all gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule AI Call/Ping
                </Button>
              </CardFooter>
            </form>
          </Card>
        </section>

        {/* Right Side: Reminders List & Dispatch logs */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Active Reminders List */}
          <Card className="bg-zinc-950 border-zinc-900 shadow-xl">
            <CardHeader className="border-b border-zinc-900 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-light tracking-tight text-white">Scheduled Tasks</CardTitle>
                <CardDescription className="text-zinc-500 text-xs">
                  Active follow-up jobs currently in trigger queue.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-zinc-850 text-zinc-400 bg-zinc-950">
                {reminders.length} Active Reminders
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 px-0">
              {reminders.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-sm font-light">
                  No active scheduled reminders. Use the form to schedule your first alert.
                </div>
              ) : (
                <div className="divide-y divide-zinc-900 max-h-[480px] overflow-y-auto">
                  {reminders.map(reminder => (
                    <div key={reminder.id} className="p-4 hover:bg-zinc-900/30 transition-all flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-normal text-white">{reminder.title}</h3>
                          <Badge variant="outline" className={`text-[10px] font-mono py-0.5 px-2 ${getPriorityColor(reminder.priority)}`}>
                            {reminder.priority}
                          </Badge>
                          {getStatusBadge(reminder.status)}
                          {reminder.recurrence !== "NONE" && (
                            <Badge variant="outline" className="border-zinc-800 text-zinc-400 bg-zinc-950 text-[10px]">
                              {reminder.recurrence}
                            </Badge>
                          )}
                        </div>

                        <p className="text-zinc-400 text-xs font-light max-w-xl">
                          {reminder.description || "No specific conversation instructions provided."}
                        </p>

                        <div className="flex items-center gap-4 text-zinc-500 text-[11px] font-mono">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            {reminder.assigneeName} ({reminder.assigneeContact})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(reminder.dueAt).toLocaleString()}
                          </span>
                          {reminder.snoozeCount > 0 && (
                            <span className="text-amber-500">
                              Snoozed {reminder.snoozeCount}x
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Force Trigger button */}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => triggerCallSimulation(reminder)}
                          className="h-8 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-xs gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Simulate
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(reminder.id)}
                          className="h-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 px-2.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dispatch Logs / Terminal simulation */}
          <Card className="bg-zinc-950 border-zinc-900 shadow-xl">
            <CardHeader className="border-b border-zinc-900 flex justify-between items-center flex-row">
              <div>
                <CardTitle className="text-lg font-light tracking-tight text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  AI Agent Dispatch logs
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs">
                  Real-time events log showing LLM content creation and Telephony/Message responses.
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-zinc-500 hover:text-zinc-300"
                onClick={() => {
                  setLogs([]);
                  localStorage.removeItem("procureiq_reminder_logs");
                }}
              >
                Clear Log
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-black border border-zinc-900 rounded-lg p-3 font-mono text-[11px] text-zinc-400 space-y-2 h-[220px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-zinc-600 text-center py-10">No recent dispatch activity. Click "Simulate" to trigger an agent call.</div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="border-b border-zinc-950 pb-2 last:border-b-0">
                      <div className="flex justify-between text-zinc-500">
                        <span>[{log.time}] {log.taskTitle.substring(0, 30)}...</span>
                        <span className="flex items-center gap-1">
                          {log.channel === "CALL" && <Phone className="w-2.5 h-2.5" />}
                          {log.channel === "SMS" && <MessageSquare className="w-2.5 h-2.5" />}
                          {log.channel === "SLACK" && <Send className="w-2.5 h-2.5" />}
                          {log.channel}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 mt-1">
                        <span className={`px-1 py-0.2 rounded text-[9px] uppercase font-bold shrink-0 ${
                          log.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" :
                          log.status === "SNOOZED" ? "bg-amber-500/10 text-amber-400" :
                          log.status === "CALLING" ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                          log.status === "SENT" ? "bg-purple-500/10 text-purple-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-zinc-300 font-light flex-1">
                          <strong>{log.assigneeName}:</strong> {log.details}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </section>

      </div>
    </div>
  );
}
