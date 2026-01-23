'use client';

import { cn } from '@/lib/utils';

interface GameSkeletonProps {
  className?: string;
}

export function GameSkeleton({ className }: GameSkeletonProps) {
  return (
    <div
      className={cn(
        'w-full max-w-md aspect-[9/16] rounded-game-lg',
        'bg-arcade-surface border border-arcade-border',
        'flex flex-col items-center justify-center gap-4',
        className
      )}
    >
      {/* Loading spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-arcade-border rounded-full" />
        <div className="absolute inset-0 border-4 border-neon-cyan rounded-full border-t-transparent animate-spin" />
      </div>

      {/* Loading text */}
      <p className="font-arcade text-xs text-neon-cyan animate-pulse-neon">LOADING...</p>

      {/* Fake progress bar */}
      <div className="w-48 h-2 bg-arcade-dark rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan animate-pulse-neon w-3/4" />
      </div>
    </div>
  );
}
