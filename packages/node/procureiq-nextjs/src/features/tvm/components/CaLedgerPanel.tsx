"use client";

import React, { useState, useCallback, useMemo } from "react";
import { BookOpen, Download, Pencil, Check, X, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface LedgerRecord {
  id: string;
  calculationType: string;
  presentValue: number;
  futureValue: number;
  pmtAmount: number;
  statedRate: number;
  compoundingFrequency: number;
  years: number;
  currencySymbol: string;
  notes: string;
  actorRole: string;
  createdAt: string;
  exportedAt: string | null;
}

interface CaLedgerPanelProps {
  records: LedgerRecord[];
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  onExportCsv: () => void;
  currencySymbol?: string;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CALC_TYPE_LABELS: Record<string, string> = {
  ORDINARY_ANNUITY: "Ordinary Annuity",
  ANNUITY_DUE:      "Annuity Due",
  UNEQUAL_FLOWS:    "Unequal Flows",
  SINGLE_SUM:       "Single Sum",
  PERPETUITY:       "Perpetuity",
};

const CALC_TYPE_COLORS: Record<string, string> = {
  ORDINARY_ANNUITY: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  ANNUITY_DUE:      "text-purple-400 bg-purple-500/10 border-purple-500/30",
  UNEQUAL_FLOWS:    "text-amber-400 bg-amber-500/10 border-amber-500/30",
  SINGLE_SUM:       "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  PERPETUITY:       "text-pink-400 bg-pink-500/10 border-pink-500/30",
};

// ---------------------------------------------------------------------------
// Inline note editor
// ---------------------------------------------------------------------------
function NoteEditor({
  recordId, initialNote, onSave,
}: {
  recordId: string;
  initialNote: string;
  onSave: (id: string, notes: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialNote);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    await onSave(recordId, draft);
    setSaving(false);
    setEditing(false);
  }, [recordId, draft, onSave]);

  if (!editing) {
    return (
      <div className="flex items-start gap-2 group">
        <span className="text-[10px] text-slate-500 flex-1 min-h-4 italic line-clamp-2">
          {initialNote || "No notes — click to add"}
        </span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition-all"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={2}
        autoFocus
        className="w-full bg-slate-950 border border-slate-600 rounded-lg px-2 py-1.5 text-[10px] text-white resize-none focus:border-indigo-500 focus:outline-none"
      />
      <div className="flex gap-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-500 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="h-2.5 w-2.5 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Check className="h-2.5 w-2.5" /> Save
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => { setDraft(initialNote); setEditing(false); }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 text-[10px] hover:bg-slate-600 transition-colors"
        >
          <X className="h-2.5 w-2.5" /> Cancel
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function CaLedgerPanel({
  records,
  onSaveNotes,
  onExportCsv,
  currencySymbol = "$",
  isLoading = false,
}: CaLedgerPanelProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return records.filter((r) =>
      (filterType === "ALL" || r.calculationType === filterType) &&
      (term === "" ||
        r.calculationType.toLowerCase().includes(term) ||
        r.notes.toLowerCase().includes(term) ||
        r.id.toLowerCase().includes(term))
    );
  }, [records, filterType, search]);

  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 md:p-5 backdrop-blur-2xl shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-400" />
          CA Calculation Ledger
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">{filtered.length} records</span>
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-600/30 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search notes, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white w-48 focus:border-indigo-500 focus:outline-none placeholder:text-slate-600"
        />
        <div className="flex gap-1 flex-wrap">
          {["ALL", ...Object.keys(CALC_TYPE_LABELS)].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                filterType === t
                  ? "bg-slate-700 text-white border-slate-600"
                  : "text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              {t === "ALL" ? "All" : CALC_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Records / Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm">
          No records found. Run a calculation and save it to your ledger.
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((record) => {
            const badgeClass = CALC_TYPE_COLORS[record.calculationType] ?? "text-slate-400 bg-slate-800 border-slate-700";
            return (
              <div
                key={record.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex flex-wrap items-start gap-3">
                  {/* Type badge + date */}
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${badgeClass}`}>
                      {CALC_TYPE_LABELS[record.calculationType] ?? record.calculationType}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">{formatDate(record.createdAt)}</span>
                    {record.exportedAt && (
                      <span className="text-[9px] text-amber-600 font-mono flex items-center gap-1">
                        <Download className="h-2.5 w-2.5" /> Exported
                      </span>
                    )}
                  </div>

                  {/* Financial values */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                    <div>
                      <span className="text-[9px] text-slate-600 block uppercase tracking-wider">PV</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {record.currencySymbol}{fmt(record.presentValue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-600 block uppercase tracking-wider">FV</span>
                      <span className="text-xs font-bold text-cyan-400 font-mono">
                        {record.currencySymbol}{fmt(record.futureValue)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-600 block uppercase tracking-wider">Rate</span>
                      <span className="text-xs font-bold text-indigo-400 font-mono">
                        {(record.statedRate * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-600 block uppercase tracking-wider">Years</span>
                      <span className="text-xs font-bold text-slate-300 font-mono">{record.years}</span>
                    </div>
                  </div>

                  {/* Notes inline editor */}
                  <div className="w-full sm:w-48">
                    <span className="text-[9px] text-slate-600 block uppercase tracking-wider mb-1">CA Notes</span>
                    <NoteEditor
                      recordId={record.id}
                      initialNote={record.notes}
                      onSave={onSaveNotes}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
