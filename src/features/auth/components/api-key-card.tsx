'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, Trash2, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiKeyItem } from '../types';
import { formatDate } from '@/lib/utils';

export interface ApiKeyCardProps {
  apiKeys: ApiKeyItem[];
  onGenerateNewKey?: () => void;
  onRevokeKey?: (id: string) => void;
}

export function ApiKeyCard({ apiKeys, onGenerateNewKey, onRevokeKey }: ApiKeyCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, prefix: string) => {
    navigator.clipboard.writeText(`${prefix}...mock_secret_key`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className="w-full border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-white">API Access Credentials</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Manage developer tokens for ProcureIQ integrations
            </CardDescription>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={onGenerateNewKey} className="bg-brand-600 hover:bg-brand-500">
          Create New API Key
        </Button>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {apiKeys.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No active API keys generated.
          </div>
        ) : (
          apiKeys.map((keyItem) => (
            <motion.div
              key={keyItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{keyItem.name}</span>
                  <Badge variant="success">ACTIVE</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{keyItem.keyPrefix}••••••••••••••••</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Created: {formatDate(keyItem.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(keyItem.id, keyItem.keyPrefix)}
                  className="gap-1.5 text-xs border-slate-700 text-slate-200"
                >
                  {copiedId === keyItem.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Key
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRevokeKey?.(keyItem.id)}
                  className="h-8 w-8 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
