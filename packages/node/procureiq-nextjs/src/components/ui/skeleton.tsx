import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-800/60 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-slate-700/20 before:to-transparent',
        className
      )}
      {...props}
    />
  );
}

function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-4 shadow-xl backdrop-blur-xl',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

function MetricSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50">
      <div className="border-b border-slate-800/80 bg-slate-950/60 px-6 py-4 flex items-center justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center gap-4 py-2 border-b border-slate-800/40 last:border-0">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton key={cIdx} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="relative w-full rounded-xl bg-slate-950/60 border border-slate-800/60 p-4 flex flex-col justify-between" style={{ height }}>
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-end justify-between gap-2 h-32 px-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="w-full rounded-t-sm" style={{ height: `${20 + ((i * 17) % 70)}%` }} />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, CardSkeleton, MetricSkeleton, TableSkeleton, ChartSkeleton };
