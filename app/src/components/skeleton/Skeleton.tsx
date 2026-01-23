'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse bg-arcade-surface rounded-game', className)} />;
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-4 w-full', className)} />;
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn('bg-arcade-surface border border-arcade-border rounded-game p-4', className)}
    >
      <div className="flex items-center gap-3 mb-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <SkeletonText className="w-1/2" />
          <SkeletonText className="w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText className="w-4/5" />
      </div>
    </div>
  );
}
