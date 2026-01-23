'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import { GameSkeleton } from './GameSkeleton';
import { setupScoreListener } from '@/lib/scores';
import { GameErrorBoundary } from '@/components/error';
import { getGameById } from '@/config/games';

// Dynamic import for Phaser game loader (no SSR)
const GameLoader = dynamic(() => import('./GameLoader').then((mod) => mod.GameLoader), {
  ssr: false,
  loading: () => <GameSkeleton />,
});

interface GameContainerProps {
  gameId: string;
}

export function GameContainer({ gameId }: GameContainerProps) {
  const game = getGameById(gameId);

  // Set up score listener to automatically submit scores when game ends
  useEffect(() => {
    const cleanup = setupScoreListener(gameId);
    return cleanup;
  }, [gameId]);

  return (
    <GameErrorBoundary gameName={game?.name}>
      <div className="flex flex-col items-center">
        <Suspense fallback={<GameSkeleton />}>
          <GameLoader gameId={gameId} />
        </Suspense>
      </div>
    </GameErrorBoundary>
  );
}
