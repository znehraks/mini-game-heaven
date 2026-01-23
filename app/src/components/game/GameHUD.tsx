'use client';

import { cn } from '@/lib/utils';

interface GameHUDProps {
  score: number;
  className?: string;
}

export function GameHUD({ score, className }: GameHUDProps) {
  return (
    <div
      className={cn(
        'absolute top-4 left-4 right-4 z-10',
        'flex items-center justify-between',
        'pointer-events-none',
        className
      )}
    >
      {/* Score */}
      <div
        className={cn(
          'px-3 py-2 rounded-game',
          'bg-arcade-dark/80 backdrop-blur-sm border border-arcade-border'
        )}
      >
        <p className="font-arcade text-xs text-neon-cyan">SCORE</p>
        <p className="font-arcade text-sm text-white">{score.toLocaleString()}</p>
      </div>
    </div>
  );
}
