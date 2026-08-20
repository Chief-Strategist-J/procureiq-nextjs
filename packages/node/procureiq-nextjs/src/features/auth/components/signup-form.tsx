'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building, UserPlus, Loader2, Eye, EyeOff, ShieldCheck, Calculator, Wrench, Briefcase, BadgeCheck, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SignupInput, UserRole } from '../types';
import { AuthStatusDialog } from './auth-status-dialog';
import { useSignupFormController } from '../hooks/use-signup-form-controller';
import { resolveMultiRoleButtonClasses, resolveFieldErrorClasses, resolvePasswordInputClasses } from '../styles/auth.styles';

export interface SignupFormProps {
  onSubmit?: (data: SignupInput) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
}

const ROLES_CONFIG: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { role: 'user', label: 'Buyer', icon: Briefcase },
  { role: 'accountant', label: 'Accountant', icon: Calculator },
  { role: 'engineer', label: 'Engineer', icon: Wrench },
  { role: 'admin', label: 'Admin', icon: ShieldCheck },
];

export function SignupForm({
  onSubmit,
  isLoading: propIsLoading,
  errorMessage: propErrorMessage,
}: SignupFormProps) {
  const controller = useSignupFormController(onSubmit);
  const isLoading = propIsLoading ?? controller.isLoading;

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
                Creating multi-tenant enterprise account...
              </p>
            </div>
          )}

          <CardHeader className="space-y-2 text-left pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400">
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Create Enterprise Account</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Select one or more roles for multi-tenant accountability access
            </CardDescription>
          </CardHeader>

          <form onSubmit={controller.handleSubmit}>
            <CardContent className="space-y-4">
              {propErrorMessage && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                  {propErrorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-medium text-slate-300">
                    Select Roles (Multi-Role Support)
                  </label>
                  <span className="text-[10px] text-brand-400 font-mono">
                    {controller.roles.length} Selected
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {ROLES_CONFIG.map((cfg) => {
                    const IconComponent = cfg.icon;
                    const isSelected = controller.roles.includes(cfg.role);
                    return (
                      <button
                        key={cfg.role}
                        type="button"
                        onClick={() => controller.toggleRoleSelection(cfg.role)}
                        className={resolveMultiRoleButtonClasses(isSelected)}
                      >
                        <IconComponent className="h-4 w-4 mb-1" />
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="signup-tenant" className="block text-xs font-medium text-slate-300">
                  Organization / Tenant ID
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-tenant"
                    type="text"
                    placeholder="acme-global"
                    value={controller.tenantId}
                    onChange={(e) => controller.updateSignupForm({ tenantId: e.target.value })}
                    className="pl-9 bg-slate-900 border-slate-700 text-white text-xs"
                    required
                  />
                </div>
              </div>

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
                    value={controller.name}
                    onChange={(e) => controller.updateSignupForm({ name: e.target.value })}
                    className={resolveFieldErrorClasses(Boolean(controller.fieldErrors.name))}
                    required
                  />
                </div>
                {controller.fieldErrors.name && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{controller.fieldErrors.name}</p>
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
                    value={controller.email}
                    onChange={(e) => controller.updateSignupForm({ email: e.target.value })}
                    className={resolveFieldErrorClasses(Boolean(controller.fieldErrors.email))}
                    required
                  />
                </div>
                {controller.fieldErrors.email && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{controller.fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="signup-company" className="block text-xs font-medium text-slate-300">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="signup-company"
                    type="text"
                    placeholder="Acme Global Inc."
                    value={controller.companyName}
                    onChange={(e) => controller.updateSignupForm({ companyName: e.target.value })}
                    className={resolveFieldErrorClasses(Boolean(controller.fieldErrors.companyName))}
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
                    type={controller.showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={controller.password}
                    onChange={(e) => controller.updateSignupForm({ password: e.target.value })}
                    className={resolvePasswordInputClasses(Boolean(controller.fieldErrors.password))}
                    required
                  />
                  <button
                    type="button"
                    onClick={controller.toggleSignupPasswordVisibility}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
                    aria-label={controller.showPassword ? 'Hide password text' : 'Show password text'}
                  >
                    {controller.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {controller.activeFields.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex items-center space-x-1.5 text-brand-400">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Role Verification & Audit Fields
                    </span>
                  </div>

                  {controller.activeFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="block text-xs font-medium text-slate-300">{field.label}</label>
                      <Input
                        type="text"
                        placeholder={field.placeholder}
                        value={String(controller.roleMetadata[field.key] ?? '')}
                        onChange={(e) => controller.handleMetadataChange(field.key, e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white text-xs"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1 pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="signup-terms"
                    checked={controller.agreeToTerms}
                    onCheckedChange={(checked) => controller.updateSignupForm({ agreeToTerms: Boolean(checked) })}
                  />
                  <label htmlFor="signup-terms" className="text-xs text-slate-300 cursor-pointer">
                    I agree to the <span className="text-brand-400 hover:underline">Terms of Service</span> and Privacy Policy.
                  </label>
                </div>
                {controller.fieldErrors.agreeToTerms && (
                  <p className="text-[11px] font-medium text-rose-400 mt-1">{controller.fieldErrors.agreeToTerms}</p>
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
                  <span>Register Multi-Tenant Account ({controller.roles.length} Roles)</span>
                )}
              </Button>

              <div className="text-left text-xs text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-brand-400 hover:underline">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      {controller.dialog.isOpen && (
        <AuthStatusDialog
          isOpen={controller.dialog.isOpen}
          type={controller.dialog.type}
          title={controller.dialog.title}
          message={controller.dialog.message}
          onClose={controller.closeDialog}
          onAction={() => {
            if (controller.dialog.redirectTo) {
              window.location.href = controller.dialog.redirectTo;
            } else {
              controller.closeDialog();
            }
          }}
          actionText={controller.dialog.actionText}
        />
      )}
    </>
  );
}
