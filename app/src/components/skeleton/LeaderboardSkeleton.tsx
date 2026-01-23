'use client';

import { Skeleton } from './Skeleton';

export function LeaderboardSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32 rounded-game" />
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2">
        <Skeleton className="col-span-1 h-4" />
        <Skeleton className="col-span-5 h-4" />
        <Skeleton className="col-span-3 h-4" />
        <Skeleton className="col-span-3 h-4" />
      </div>

      {/* Rows */}
      {[...Array(10)].map((_, i) => (
        <LeaderboardRowSkeleton key={i} />
      ))}
    </div>
  );
}

function LeaderboardRowSkeleton() {
  return (
    <div className="bg-arcade-surface border border-arcade-border rounded-game p-4">
      <div className="grid grid-cols-12 gap-2 items-center">
        {/* Rank */}
        <div className="col-span-1">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        {/* Player */}
        <div className="col-span-5 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Score */}
        <div className="col-span-3">
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Date */}
        <div className="col-span-3">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
