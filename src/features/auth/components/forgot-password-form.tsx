'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ForgotPasswordInput } from '../types';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
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
              isLoading={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg"
            >
              Send Password Reset Link
            </Button>
            {onBackToLogin && (
              <Button
                type="button"
                variant="ghost"
                onClick={onBackToLogin}
                className="gap-2 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
