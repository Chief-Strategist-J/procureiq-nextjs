'use client';

import React, { useState } from 'react';
import type { AssignRoleInput } from '../types';

interface AssignRoleFormProps {
  orgId: string;
  onSubmit: (input: AssignRoleInput) => void;
  isLoading?: boolean;
}

export function AssignRoleForm({ orgId, onSubmit, isLoading }: AssignRoleFormProps) {
  const [principalType, setPrincipalType] = useState<'user' | 'service_account'>('user');
  const [principalId, setPrincipalId] = useState('1');
  const [roleName, setRoleName] = useState('user');
  const [scopeType, setScopeType] = useState<'org' | 'workspace'>('org');

  const ROLE_MAP: Record<string, number> = {
    user: 1,
    admin: 2,
    purchaser: 3,
    manager: 4,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      orgId,
      executorId: '1',
      principalType,
      principalId,
      roleId: ROLE_MAP[roleName] ?? 1,
      roleName,
      scopeType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
      <h3 className="mb-4 text-lg font-semibold text-slate-100">Assign Role</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Principal Type</label>
          <select
            value={principalType}
            onChange={(e) => setPrincipalType(e.target.value as any)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="user">User</option>
            <option value="service_account">Service Account</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Principal ID</label>
          <input
            type="text"
            value={principalId}
            onChange={(e) => setPrincipalId(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Role</label>
          <select
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="purchaser">Purchaser</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Scope</label>
          <select
            value={scopeType}
            onChange={(e) => setScopeType(e.target.value as any)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="org">Organization</option>
            <option value="workspace">Workspace</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Assigning...' : 'Assign Role'}
        </button>
      </div>
    </form>
  );
}
