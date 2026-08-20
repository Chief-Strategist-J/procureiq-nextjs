import { UserRole } from '../types';

export function resolveRoleButtonClasses(currentRole: UserRole, targetRole: UserRole): string {
  const base = 'flex flex-1 flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer';
  if (currentRole === targetRole) {
    return `${base} bg-brand-600/30 border-brand-500 text-white shadow-md shadow-brand-500/10`;
  }
  return `${base} bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200`;
}

export function resolveMultiRoleButtonClasses(isSelected: boolean): string {
  const base = 'flex flex-1 flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer';
  if (isSelected) {
    return `${base} bg-brand-600/30 border-brand-500 text-white shadow-md shadow-brand-500/10`;
  }
  return `${base} bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200`;
}

export function resolveFieldErrorClasses(hasError: boolean): string {
  const base = 'pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500';
  if (hasError) {
    return `${base} border-rose-500 bg-rose-500/5 focus-visible:ring-rose-500`;
  }
  return `${base} focus-visible:ring-brand-500`;
}

export function resolvePasswordInputClasses(hasError: boolean): string {
  const base = 'pl-9 pr-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500';
  if (hasError) {
    return `${base} border-rose-500 bg-rose-500/5 focus-visible:ring-rose-500`;
  }
  return `${base} focus-visible:ring-brand-500`;
}

export function resolveDashboardCardClasses(variant: 'emerald' | 'indigo' | 'amber' | 'blue'): string {
  const base = 'group cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md transition hover:bg-slate-900/90';
  switch (variant) {
    case 'emerald':
      return `${base} hover:border-emerald-500/50`;
    case 'indigo':
      return `${base} hover:border-indigo-500/50`;
    case 'amber':
      return `${base} hover:border-amber-500/50`;
    case 'blue':
      return `${base} hover:border-blue-500/50`;
    default:
      return base;
  }
}
