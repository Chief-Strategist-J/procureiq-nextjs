'use client';

import React from 'react';
import type { RoleAssignment } from '../types';

interface RoleAssignmentListProps {
  assignments: RoleAssignment[];
  isLoading?: boolean;
}

export function RoleAssignmentList({ assignments, isLoading }: RoleAssignmentListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mr-3" />
        Loading role assignments...
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-md">
        <p className="text-slate-400">No role assignments found for this organization.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
      <div className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-950/40">
        <h3 className="font-semibold text-slate-100 text-lg">Role Assignments</h3>
        <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">
          {assignments.length} Total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-medium uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Principal</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Scope</th>
              <th className="px-6 py-3">Assigned Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {assignments.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-slate-800/40">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{item.id}</td>
                <td className="px-6 py-4 font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.principalType === 'user' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span>{item.principalType} ({item.principalId})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 border border-slate-700">
                    {item.roleName}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400 uppercase">
                  {item.scopeType} {item.scopeId ? `(${item.scopeId})` : ''}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
