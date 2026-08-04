'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, LogOut, User, Lock, Activity, RefreshCw } from 'lucide-react';
import { useAuthManagement } from '../hooks/use-auth-management';
import { useApiKeyService } from '../hooks/use-api-key-service';
import { ApiKeyCard } from './api-key-card';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HttpClient } from '@/lib/http-client';

export function DashboardView() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthManagement();
  const { apiKeys, handleCreateKey, handleRevokeKey } = useApiKeyService();

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

  const token = HttpClient.getAuthToken();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-brand-400 mb-1">
              <User className="h-5 w-5" />
              <CardTitle className="text-base text-white">User Credentials</CardTitle>
            </div>
            <CardDescription className="text-slate-400 text-xs">
              Verified identity and role permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-300">
            {user?.id && (
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">User ID:</span>
                <span className="font-mono text-slate-200">{user.id}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-200">{user?.email}</span>
            </div>
            {user?.role && (
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Assigned Role:</span>
                <span className="font-semibold text-brand-400 uppercase">{user.role}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Lock className="h-5 w-5" />
              <CardTitle className="text-base text-white">JWT Session Token</CardTitle>
            </div>
            <CardDescription className="text-slate-400 text-xs">
              OAuth2 Bearer token active session info
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-500">Encryption:</span>
              <span className="font-mono text-emerald-400">HMAC-SHA256</span>
            </div>
            {token && (
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Bearer Token:</span>
                <span className="font-mono text-slate-400 truncate max-w-[140px]">
                  {token}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Expiration:</span>
              <span className="text-slate-300">24 Hours (Rolling)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <RefreshCw className="h-5 w-5" />
              <CardTitle className="text-base text-white">Token Rotation</CardTitle>
            </div>
            <CardDescription className="text-slate-400 text-xs">
              Automatic refresh token rotation security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-500">Rotation Mode:</span>
              <span className="text-amber-400 font-semibold">Strict Single-Use</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-500">Lockout Guard:</span>
              <span className="text-emerald-400">Active (3 Attempts)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Audit Status:</span>
              <span className="text-slate-300">Passed Formal TLA+ Invariants</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ApiKeyCard
        apiKeys={apiKeys}
        onGenerateNewKey={() => handleCreateKey()}
        onRevokeKey={handleRevokeKey}
      />
    </div>
  );
}
