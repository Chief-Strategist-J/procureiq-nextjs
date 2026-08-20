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
import { ShieldCheck, ShieldAlert, Lock } from 'lucide-react';

export default function AdminDashboardPage() {
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
    if (selectedOrgId && isAdmin) {
      fetchAssignments(selectedOrgId);
      fetchAuditEvents(selectedOrgId);
    }
  }, [selectedOrgId, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-slate-100 flex items-center justify-center font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-rose-500/30 text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center font-bold text-xl border border-rose-500/20">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-sm text-slate-400">
            The Admin Portal and Tamper-Evident Audit Ledger are restricted exclusively to System Administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                Admin Control Center & Security Audit
              </h1>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                Admin Module
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Centralized Administrative Management: RBAC assignments, organization context switches, and cryptographic audit log chain verification.
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
              <span className="text-xs text-slate-400 font-medium">Role:</span>
              <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 font-mono text-xs text-indigo-300 uppercase font-semibold">
                ADMIN
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AuditLogViewer
              events={auditEvents}
              verificationResult={verificationResult}
              onVerifyChain={() => verifyAuditChain(selectedOrgId)}
              isLoading={isLoading}
            />
            <RoleAssignmentList assignments={assignments} isLoading={isLoading} />
          </div>

          <div>
            <AssignRoleForm
              orgId={selectedOrgId}
              onSubmit={(input) => assignRole(input)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
