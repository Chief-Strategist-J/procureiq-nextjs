export function resolveOptionClasses(isSelected: boolean): string {
  if (isSelected) {
    return 'flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-xs font-bold transition-all text-left bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-md';
  }
  return 'flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-xs font-medium transition-all text-left text-slate-300 hover:bg-slate-800/80 hover:text-white';
}

export function resolveDropdownContainerClasses(): string {
  return 'absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl space-y-2 backdrop-blur-2xl ring-1 ring-slate-800';
}
