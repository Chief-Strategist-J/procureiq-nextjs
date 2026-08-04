'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, UserPlus, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge variant="info" className="gap-1.5 py-1 px-3">
            <ShieldCheck className="h-3.5 w-3.5" /> Enterprise Identity & Access Management
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            ProcureIQ Authentication Portal
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Secure multi-factor authentication, single sign-on (SSO), and developer API access token management.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/login">
              <Button variant="primary" className="gap-2 bg-brand-600 hover:bg-brand-500 text-white">
                <Lock className="h-4 w-4" /> Sign In Portal
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="gap-2 border-slate-700 text-slate-200">
                <UserPlus className="h-4 w-4" /> Register Account
              </Button>
            </Link>
            <Link href="/forgot-password">
              <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white">
                <KeyRound className="h-4 w-4" /> Password Recovery
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Auth Features Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="pb-2">
            <Badge variant="success" className="w-fit mb-2">Security</Badge>
            <CardTitle className="text-base text-white">OAuth2 & SAML 2.0</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Enterprise single sign-on with Okta, Azure AD, and Google Workspace.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="pb-2">
            <Badge variant="info" className="w-fit mb-2">Tokens</Badge>
            <CardTitle className="text-base text-white">Scoped API Credentials</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Granular permission scopes for procurement service automation.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="pb-2">
            <Badge variant="warning" className="w-fit mb-2">Audit</Badge>
            <CardTitle className="text-base text-white">MFA & Session Guard</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Time-based OTP authorization and encrypted session persistence.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
