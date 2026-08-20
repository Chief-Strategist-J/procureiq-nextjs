'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, LogOut, Activity, Calculator, Wrench, UserCheck } from 'lucide-react';
import { useAuthManagement } from '../hooks/use-auth-management';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resolveDashboardCardClasses } from '../styles/auth.styles';
import type { UserRole } from '../types';

export function DashboardView() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthManagement();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400">
          <ShieldCheck className="h-6 w-6 animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-slate-300">
          Redirecting to authentication portal...
        </p>
      </div>
    );
  }

  const role: UserRole = (user?.role as UserRole) || 'user';
  const isAdmin = role === 'admin';
  const isAccountant = role === 'accountant';
  const isEngineer = role === 'engineer';
  const isNormalUser = role === 'user';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="gap-1">
                <Activity className="h-3 w-3" /> Session Active
              </Badge>
              <Badge variant="info" className="uppercase font-semibold tracking-wider">
                Role: {role}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || user?.email}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Authenticated Account: <span className="font-mono text-brand-300">{user?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(isAdmin || isAccountant) && (
              <Button
                onClick={() => router.push('/ca')}
                className="gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg"
              >
                <Calculator className="h-4 w-4" /> CA Studio
              </Button>
            )}
            {isAdmin && (
              <Button
                onClick={() => router.push('/admin')}
                className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
              >
                <ShieldCheck className="h-4 w-4" /> Admin Center
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" /> End Session
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(isAdmin || isAccountant) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => router.push('/ca')}
            className={resolveDashboardCardClasses('emerald')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-emerald-400 group-hover:scale-110 transition-transform">
                <Calculator className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Launch CA Studio →
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
              CA & Financial Quantitative Studio
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Google TimesFM Zero-Shot time-series forecasting, CFA Time Value of Money (TVM) calculator, and cash flow quantitative risk models for Accountants & CAs.
            </p>
          </motion.div>
        )}

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={() => router.push('/admin')}
            className={resolveDashboardCardClasses('indigo')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 text-indigo-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                Launch Admin Center →
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
              Admin Control Center & Security Audit
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Manage principal role assignments, permission scopes, inspect tamper-evident audit log events, and verify SHA-256 cryptographic chain integrity.
            </p>
          </motion.div>
        )}

        {(isAdmin || isEngineer) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={resolveDashboardCardClasses('amber')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-amber-400 group-hover:scale-110 transition-transform">
                <Wrench className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-amber-400">
                Engineering Module
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
              Technical Operations & Field Service
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Technical work orders, asset maintenance plans, service appointments, and engineering field dispatch tools.
            </p>
          </motion.div>
        )}

        {(isAdmin || isNormalUser || isAccountant || isEngineer) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={resolveDashboardCardClasses('blue')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-blue-400 group-hover:scale-110 transition-transform">
                <UserCheck className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-blue-400">
                User Portal
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
              User Services & Procurement Portal
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Standard user services, procurement requests, profile settings, and self-service support tickets.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
