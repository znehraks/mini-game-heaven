'use client';

import { Skeleton } from './Skeleton';

export function ProfileSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Profile header */}
      <div className="bg-arcade-surface border border-arcade-border rounded-game p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent games */}
      <div className="bg-arcade-surface border border-arcade-border rounded-game p-4">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-game" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-arcade-surface border border-arcade-border rounded-game p-4">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-game" />
          ))}
        </div>
      </div>
    </div>
  );
}
