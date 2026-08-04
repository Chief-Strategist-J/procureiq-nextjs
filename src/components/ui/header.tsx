import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Bell, User, Layers } from 'lucide-react';
import { Badge } from './badge';

export interface HeaderProps {
  notificationCount?: number;
  userName?: string;
  userRole?: string;
}

export function Header({
  notificationCount = 3,
  userName = 'Jaydeep Vagh',
  userRole = 'Lead Strategist',
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 shadow-md shadow-brand-500/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">ProcureIQ</span>
              <Badge variant="info">Enterprise</Badge>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-brand-400 transition-colors">
            Overview
          </Link>
          <Link href="/procurement" className="hover:text-brand-400 transition-colors">
            Procurement
          </Link>
          <Link href="/notifications" className="hover:text-brand-400 transition-colors">
            Alerts
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/notifications"
            className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {notificationCount}
              </span>
            )}
          </Link>

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
