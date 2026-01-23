'use client';

import { Skeleton } from './Skeleton';

export function GameCardSkeleton() {
  return (
    <div className="bg-arcade-surface border border-arcade-border rounded-game overflow-hidden">
      {/* Thumbnail */}
      <Skeleton className="aspect-video w-full rounded-none" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and badge */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function GameGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}
