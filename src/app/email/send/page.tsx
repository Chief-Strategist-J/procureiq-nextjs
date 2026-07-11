"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { EmailApi } from "../api-client";

export default function SendEmailPage() {
  const router = useRouter();
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess("");

    const recipientList = recipients
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    try {
      const result = await EmailApi.sendNow({ recipients: recipientList, subject, body });
      setSuccess(result.message || "Email sent successfully.");
      setTimeout(() => router.push("/email"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative flex flex-col">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4 mb-8 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/email"
            className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Send Email Now
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Deliver an email immediately to one or more recipients via Gmail SMTP.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 text-xs bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 text-xs bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-8 flex-1 flex flex-col justify-between w-full max-w-2xl">
        <div className="space-y-8 w-full">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Recipients (comma-separated)</label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="procurement@acme.example, supply@globex.example"
              required
              className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Vendor Insurance Certificate Reminder"
              required
              className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Write the message content here..."
              required
              className="w-full rounded-lg bg-zinc-900/40 border border-zinc-800/80 p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 mt-12 border-t border-zinc-900">
          <Link
            href="/email"
            className="px-8 py-3 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-xs font-semibold cursor-pointer transition-all text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={sending}
            className="px-10 py-3 rounded-lg bg-white text-black hover:bg-zinc-150 hover:scale-[1.02] active:scale-[0.98] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            {sending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
