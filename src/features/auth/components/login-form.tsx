'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginInput } from '../types';

export interface LoginFormProps {
  onSubmit?: (data: LoginInput) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export function LoginForm({ onSubmit, isLoading = false, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Sign in to access your ProcureIQ dashboard
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email-input" className="block text-xs font-medium text-slate-300">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  id="email-input"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password-input" className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <a href="#" className="text-xs text-brand-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  id="password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              type="submit"
              variant="default"
              isLoading={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30"
            >
              Sign In to ProcureIQ
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
