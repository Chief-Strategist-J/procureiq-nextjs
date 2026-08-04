'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ForgotPasswordInput } from '../types';
import { AuthStatusDialog } from './auth-status-dialog';

export interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordInput) => void;
  isLoading?: boolean;
  successMessage?: string;
  onBackToLogin?: () => void;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
  successMessage,
  onBackToLogin,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
    if (onSubmit) {
      onSubmit({ email });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="relative overflow-hidden border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          {/* Animated Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm space-y-3">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute h-12 w-12 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
                <KeyRound className="h-6 w-6 text-brand-400 animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-brand-300 tracking-wide">
                Generating password recovery token...
              </p>
            </div>
          )}

          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400">
              <KeyRound className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Reset Your Password</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Enter your email to receive a secure recovery link
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-medium">
                  {successMessage}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="forgot-email" className="block text-xs font-medium text-slate-300">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="admin@procureiq.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Token...</span>
                  </>
                ) : (
                  <span>Send Password Reset Link</span>
                )}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white pt-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      {/* Success Modal Dialog */}
      {successMessage && (
        <AuthStatusDialog
          isOpen={showSuccessModal}
          type="success"
          title="Recovery Instructions Sent"
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
          onAction={() => setShowSuccessModal(false)}
          actionText="OK"
        />
      )}
    </>
  );
}
