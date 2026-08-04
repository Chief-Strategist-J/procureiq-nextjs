'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building, UserPlus, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SignupInput } from '../types';
import { AuthStatusDialog } from './auth-status-dialog';

export interface SignupFormProps {
  onSubmit?: (data: SignupInput) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
}

export function SignupForm({
  onSubmit,
  isLoading = false,
  errorMessage,
  onClearError,
}: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrorModal(true);
    if (onSubmit) {
      onSubmit({ name, email, password, companyName, agreeToTerms });
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    if (onClearError) {
      onClearError();
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
                <UserPlus className="h-6 w-6 text-brand-400 animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-brand-300 tracking-wide">
                Creating your enterprise account...
              </p>
            </div>
          )}

          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400">
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Create Enterprise Account</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Join ProcureIQ to automate your corporate purchasing workflow
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
                <label htmlFor="signup-name" className="block text-xs font-medium text-slate-300">
                  Full Name / Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Jaydeep Vagh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="signup-email" className="block text-xs font-medium text-slate-300">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="jaydeep@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="signup-company" className="block text-xs font-medium text-slate-300">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-company"
                    type="text"
                    placeholder="Acme Global Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="signup-password" className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="signup-terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(Boolean(checked))}
                />
                <label htmlFor="signup-terms" className="text-xs text-slate-300 cursor-pointer">
                  I agree to the{' '}
                  <span className="text-brand-400 hover:underline">Terms of Service</span> and Privacy Policy.
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Get Started Free</span>
                )}
              </Button>

              <div className="text-center text-xs text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-brand-400 hover:underline">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      {/* Error Modal Dialog */}
      {errorMessage && (
        <AuthStatusDialog
          isOpen={showErrorModal}
          type="error"
          title="Registration Error"
          message={errorMessage}
          onClose={handleCloseModal}
          onAction={handleCloseModal}
          actionText="Try Again"
        />
      )}
    </>
  );
}
