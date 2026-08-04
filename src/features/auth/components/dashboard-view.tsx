'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, LogOut, Activity } from 'lucide-react';
import { useAuthManagement } from '../hooks/use-auth-management';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
              {user?.role && <Badge variant="info">Role: {user.role}</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || user?.email}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Authenticated Account: <span className="font-mono text-brand-300">{user?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" /> End Session & Logout
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
