'use client';

import React, { useEffect } from 'react';
import { useAuthManagement } from '@/features/auth';
import {
  useIdentityManagement,
  RoleAssignmentList,
  AssignRoleForm,
  AuditLogViewer,
  OrgSwitcher,
} from '@/features/identity';
import { Lock } from 'lucide-react';

export default function IdentityPage() {
  const { user } = useAuthManagement();
  const isAdmin = user?.role === 'admin';

  const {
    organizations,
    assignments,
    auditEvents,
    verificationResult,
    isLoading,
    error,
    selectedOrgId,
    setOrgId,
    fetchOrganizations,
    fetchAssignments,
    assignRole,
    fetchAuditEvents,
    verifyAuditChain,
  } = useIdentityManagement();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrgId) {
      if (isAdmin) {
        fetchAssignments(selectedOrgId);
        fetchAuditEvents(selectedOrgId);
      } else {
        fetchAssignments(selectedOrgId, 'user', user?.id || '1');
      }
    }
  }, [selectedOrgId, isAdmin, user?.id]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              Identity & Multi-Organization RBAC
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {isAdmin
                ? 'Full Administrative View: Managing organization contexts, role assignments, and tamper-evident audit ledger'
                : 'Personal Profile View: Viewing assigned roles and scoped permissions within selected organization'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <OrgSwitcher
              organizations={organizations}
              selectedOrgId={selectedOrgId}
              onSelectOrg={(orgId) => setOrgId(orgId)}
              isLoading={isLoading}
            />
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <span className="text-xs text-slate-400 font-medium">Active Role:</span>
              <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 font-mono text-xs text-indigo-300 uppercase font-semibold">
                {user?.role || 'user'}
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        {!isAdmin && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-300 flex items-center gap-3">
            <Lock className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Role-Scoped Visibility Active:</span> As a <strong className="uppercase">{user?.role}</strong>, you can view your personal assigned permissions within the active organization. Only Administrators can manage role assignments and verify cryptographic ledgers across organizations.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-8`}>
            <RoleAssignmentList assignments={assignments} isLoading={isLoading} />
            {isAdmin && (
              <AuditLogViewer
                events={auditEvents}
                verificationResult={verificationResult}
                onVerifyChain={() => verifyAuditChain(selectedOrgId)}
                isLoading={isLoading}
              />
            )}
          </div>

          {isAdmin && (
            <div>
              <AssignRoleForm
                orgId={selectedOrgId}
                onSubmit={(input) => assignRole(input)}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
