'use client';

import React from 'react';
import type { AuditEvent, ChainVerificationResult } from '../types';

interface AuditLogViewerProps {
  events: AuditEvent[];
  verificationResult: ChainVerificationResult | null;
  onVerifyChain: () => void;
  isLoading?: boolean;
}

export function AuditLogViewer({
  events,
  verificationResult,
  onVerifyChain,
  isLoading,
}: AuditLogViewerProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
      <div className="border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-slate-950/40">
        <div>
          <h3 className="font-semibold text-slate-100 text-lg">Audit Trail & Chain Verification</h3>
          <p className="text-xs text-slate-400">Cryptographically verifiable immutable event ledger</p>
        </div>
        <div className="flex items-center gap-3">
          {verificationResult && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                verificationResult.isValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {verificationResult.isValid
                ? `✓ Chain Verified (${verificationResult.totalEventsChecked} events)`
                : `✗ Tamper Detected at #${verificationResult.brokenIndex}`}
            </span>
          )}
          <button
            onClick={onVerifyChain}
            disabled={isLoading}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Chain Integrity'}
          </button>
        </div>
      </div>

      {!events || events.length === 0 ? (
        <div className="p-8 text-center text-slate-400">No audit events recorded.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-medium uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Resource</th>
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {events.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-slate-800/40">
                  <td className="px-6 py-3 text-slate-400">{new Date(e.occurredAt).toLocaleString()}</td>
                  <td className="px-6 py-3 font-semibold text-slate-200">{e.action}</td>
                  <td className="px-6 py-3 text-slate-300">{e.resourceType} {e.resourceId ? `#${e.resourceId}` : ''}</td>
                  <td className="px-6 py-3 text-slate-400">{e.actorType} #{e.actorId ?? 'sys'}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded px-2 py-0.5 font-sans text-[10px] uppercase font-bold ${
                        e.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : e.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {e.severity}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500" title={`Prev: ${e.prevHash} | Current: ${e.entryHash}`}>
                    {e.entryHash ? e.entryHash.slice(0, 10) + '...' : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
