'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building, UserPlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SignupInput } from '../types';

export interface SignupFormProps {
  onSubmit?: (data: SignupInput) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export function SignupForm({ onSubmit, isLoading = false, errorMessage }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, email, password, companyName, agreeToTerms });
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
              <label htmlFor="signup-name" className="block text-xs font-medium text-slate-300">Full Name</label>
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
              <label htmlFor="signup-email" className="block text-xs font-medium text-slate-300">Work Email</label>
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
              <label htmlFor="signup-company" className="block text-xs font-medium text-slate-300">Company Name</label>
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
              <label htmlFor="signup-password" className="block text-xs font-medium text-slate-300">Password</label>
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
                <a href="#" className="text-brand-400 hover:underline">
                  Terms of Service
                </a>{' '}
                and Privacy Policy.
              </label>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              type="submit"
              variant="default"
              isLoading={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg"
            >
              Get Started Free
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
