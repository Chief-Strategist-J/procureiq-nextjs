'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AuthStatusDialogProps {
  isOpen: boolean;
  type: 'error' | 'success' | 'lockout' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onAction?: () => void;
  actionText?: string;
}

export function AuthStatusDialog({
  isOpen,
  type,
  title,
  message,
  onClose,
  onAction,
  actionText,
}: AuthStatusDialogProps) {
  if (!isOpen) return null;

  const isLockout = type === 'lockout' || message.toLowerCase().includes('locked');
  const isError = type === 'error' || isLockout;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-md overflow-hidden rounded-2xl border bg-slate-900 p-6 shadow-2xl ${
            isLockout
              ? 'border-amber-500/40 bg-gradient-to-b from-slate-900 to-amber-950/20'
              : isError
              ? 'border-rose-500/40 bg-gradient-to-b from-slate-900 to-rose-950/20'
              : 'border-emerald-500/40 bg-gradient-to-b from-slate-900 to-emerald-950/20'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                  isLockout
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    : isError
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {isLockout ? (
                  <ShieldAlert className="h-6 w-6" />
                ) : isError ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isLockout
                      ? 'text-amber-400'
                      : isError
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {isLockout ? 'Account Lockout Guard' : type}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
            {isLockout && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300 space-y-1">
                <p className="font-semibold">Security Protocol Enforced:</p>
                <p>3 failed consecutive password attempts detected. Account is locked for 15 minutes.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Dismiss
            </Button>
            {onAction && actionText && (
              <Button
                variant={isError ? 'destructive' : 'default'}
                size="sm"
                onClick={() => {
                  onAction();
                  onClose();
                }}
                className={
                  isError
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }
              >
                {actionText}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
