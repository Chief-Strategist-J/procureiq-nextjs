'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, Loader2, Eye, EyeOff, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginInput, UserRole } from '../types';
import { AuthStatusDialog } from './auth-status-dialog';
import { AuthValidator } from '../utils/validation';
import { useAuthManagement } from '../hooks/use-auth-management';

export interface LoginFormProps {
  onSubmit?: (data: LoginInput) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
}

export function LoginForm({
  onSubmit,
  isLoading: propIsLoading,
  errorMessage: propErrorMessage,
  onClearError,
}: LoginFormProps) {
  const {
    loginForm,
    fieldErrors,
    dialog,
    isLoading: storeIsLoading,
    error: storeError,
    updateLoginForm,
    toggleLoginPasswordVisibility,
    closeDialog,
    submitLoginForm,
  } = useAuthManagement();

  const isLoading = propIsLoading ?? storeIsLoading;
  const { email, password, showPassword, role = 'admin' } = loginForm;

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get('email');
      if (urlEmail && !loginForm.email) {
        updateLoginForm({ email: urlEmail });
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (onSubmit) {
      onSubmit({ email: loginForm.email, password: loginForm.password, role });
    } else {
      submitLoginForm(loginForm);
    }
  };

  const handleCloseDialog = () => {
    closeDialog();
    if (onClearError) {
      onClearError();
    }
  };

  const currentError = propErrorMessage || storeError || (dialog.isOpen ? dialog.message : '');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="relative overflow-hidden border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm space-y-3">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute h-12 w-12 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
                <ShieldCheck className="h-6 w-6 text-brand-400 animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-brand-300 tracking-wide">
                Authenticating credentials with ProcureIQ backend...
              </p>
            </div>
          )}

          <CardHeader className="space-y-2 text-left pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Sign in to access your ProcureIQ IAM dashboard
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {propErrorMessage && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                  {propErrorMessage}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="role-select" className="block text-xs font-medium text-slate-300">
                  Select Access Role
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <select
                    id="role-select"
                    value={role}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'admin' || val === 'accountant' || val === 'engineer' || val === 'user') {
                        updateLoginForm({ role: val });
                      }
                    }}
                    className="w-full rounded-md border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-200 focus:border-brand-500 focus:outline-none transition-colors"
                  >
                    <option value="admin">Administrator (Full Access to All Modules)</option>
                    <option value="accountant">Accountant / CA (Financial Modules)</option>
                    <option value="engineer">Engineer (Technical & Field Services)</option>
                    <option value="user">Normal User (Services Portal)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email-input" className="block text-xs font-medium text-slate-300">
                  Work Email / Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="email-input"
                    type="text"
                    placeholder="name@company.com or username"
                    value={email}
                    onChange={(e) => updateLoginForm({ email: e.target.value })}
                    className={`pl-9 ${fieldErrors.email ? 'border-rose-500 bg-rose-500/5' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password-input" className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-brand-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => updateLoginForm({ password: e.target.value })}
                    className={`pl-9 pr-10 ${fieldErrors.password ? 'border-rose-500 bg-rose-500/5' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleLoginPasswordVisibility}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
                    aria-label={showPassword ? 'Hide password text' : 'Show password text'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{fieldErrors.password}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In to ProcureIQ</span>
                )}
              </Button>

              <div className="text-left text-xs text-slate-400">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-brand-400 hover:underline">
                  Register Account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      {dialog.isOpen && (
        <AuthStatusDialog
          isOpen={dialog.isOpen}
          type={dialog.type}
          title={dialog.title}
          message={dialog.message}
          onClose={handleCloseDialog}
          onAction={handleCloseDialog}
          actionText={dialog.actionText}
        />
      )}
    </>
  );
}
