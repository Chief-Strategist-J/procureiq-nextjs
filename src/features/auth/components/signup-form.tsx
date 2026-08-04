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
import { AuthValidator } from '../utils/validation';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = AuthValidator.validateSignupForm(
      name,
      email,
      password,
      companyName,
      agreeToTerms
    );

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      setDialogMessage(firstError);
      setShowDialog(true);
      return;
    }

    setFieldErrors({});
    setShowDialog(true);
    if (onSubmit) {
      onSubmit({ name, email, password, companyName, agreeToTerms });
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    if (onClearError) {
      onClearError();
    }
  };

  const currentError = errorMessage || (showDialog ? dialogMessage : '');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="relative overflow-hidden border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
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
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    className={`pl-9 ${fieldErrors.name ? 'border-rose-500 bg-rose-500/5' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="signup-email" className="block text-xs font-medium text-slate-300">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="jaydeep@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    className={`pl-9 ${fieldErrors.email ? 'border-rose-500 bg-rose-500/5' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{fieldErrors.email}</p>
                )}
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
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (fieldErrors.companyName) setFieldErrors((prev) => ({ ...prev, companyName: '' }));
                    }}
                    className={`pl-9 ${fieldErrors.companyName ? 'border-rose-500 bg-rose-500/5' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.companyName && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{fieldErrors.companyName}</p>
                )}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    className={`pl-9 ${fieldErrors.password ? 'border-rose-500 bg-rose-500/5' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="signup-terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => {
                      setAgreeToTerms(Boolean(checked));
                      if (fieldErrors.agreeToTerms) setFieldErrors((prev) => ({ ...prev, agreeToTerms: '' }));
                    }}
                  />
                  <label htmlFor="signup-terms" className="text-xs text-slate-300 cursor-pointer">
                    I agree to the <span className="text-brand-400 hover:underline">Terms of Service</span> and Privacy Policy.
                  </label>
                </div>
                {fieldErrors.agreeToTerms && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{fieldErrors.agreeToTerms}</p>
                )}
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

      {currentError && showDialog && (
        <AuthStatusDialog
          isOpen={showDialog}
          type="error"
          title="Registration Validation Error"
          message={currentError}
          onClose={handleCloseDialog}
          onAction={handleCloseDialog}
          actionText="Try Again"
        />
      )}
    </>
  );
}
