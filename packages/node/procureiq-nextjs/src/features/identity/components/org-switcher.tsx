'use client';

import React from 'react';
import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import type { Organization } from '../types';

interface OrgSwitcherProps {
  organizations: Organization[];
  selectedOrgId: string;
  onSelectOrg: (orgId: string) => void;
  isLoading?: boolean;
}

export function OrgSwitcher({
  organizations,
  selectedOrgId,
  onSelectOrg,
  isLoading,
}: OrgSwitcherProps) {
  const currentOrg = organizations.find((o) => o.id === selectedOrgId);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Building2 className="h-4 w-4 text-indigo-400" />
        <span>Organization:</span>
      </div>

      <div className="relative inline-block min-w-[220px]">
        <select
          value={selectedOrgId}
          onChange={(e) => onSelectOrg(e.target.value)}
          disabled={isLoading}
          className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-900/90 px-3.5 py-2 pr-9 text-xs font-semibold text-slate-200 shadow-inner backdrop-blur-md focus:border-indigo-500 focus:outline-none transition disabled:opacity-50"
        >
          {organizations.length === 0 ? (
            <option value={selectedOrgId}>Organization #{selectedOrgId}</option>
          ) : (
            organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.tier.toUpperCase()})
              </option>
            ))
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <ChevronsUpDown className="h-3.5 w-3.5" />
        </div>
      </div>

      {currentOrg && (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 text-[11px] font-medium text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {currentOrg.tier} tier
        </span>
      )}
    </div>
  );
}
