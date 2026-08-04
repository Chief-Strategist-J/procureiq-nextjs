import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, UserPlus, KeyRound, User } from 'lucide-react';
import { Badge } from './badge';

export interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({
  userName = 'IAM Guest',
  userRole = 'Unauthenticated',
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 shadow-md shadow-brand-500/20">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">ProcureIQ</span>
              <Badge variant="info">Auth IAM Portal</Badge>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/login" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
            <Lock className="h-4 w-4" /> Sign In
          </Link>
          <Link href="/signup" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
            <UserPlus className="h-4 w-4" /> Register
          </Link>
          <Link href="/forgot-password" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
            <KeyRound className="h-4 w-4" /> Recovery
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-slate-200">{userName}</p>
              <p className="text-[10px] text-slate-400">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
