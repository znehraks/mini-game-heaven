'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/stores/gameStore';
import { GameHUD } from './GameHUD';

interface GameLoaderProps {
  gameId: string;
}

export function GameLoader({ gameId }: GameLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { score, isPlaying, reset } = useGameStore();

  useEffect(() => {
    let mounted = true;

    const initGame = async () => {
      if (!containerRef.current || gameRef.current) return;

      try {
        // Dynamically import Phaser
        const Phaser = (await import('phaser')).default;

        // Import game-specific configuration
        const gameConfig = await import(`@/games/${gameId}/config`);

        if (!mounted) return;

        // Create Phaser game instance
        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: containerRef.current,
          width: 360,
          height: 640,
          backgroundColor: '#0a0a0f',
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { x: 0, y: 0 },
              debug: false,
            },
          },
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          ...gameConfig.default,
        };

        gameRef.current = new Phaser.Game(config);
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load game:', err);
        setError('Failed to load game. Please try again.');
      }
    };

    initGame();

    return () => {
      mounted = false;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      reset();
    };
  }, [gameId, reset]);

  if (error) {
    return (
      <div
        className={cn(
          'w-full max-w-md aspect-[9/16] rounded-game-lg',
          'bg-arcade-surface border border-game-danger',
          'flex flex-col items-center justify-center gap-4 p-6 text-center'
        )}
      >
        <span className="text-4xl">😢</span>
        <p className="font-arcade text-xs text-game-danger">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-arcade-dark rounded-game text-sm text-white hover:bg-arcade-border transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Game HUD */}
      {isLoaded && isPlaying && <GameHUD score={score} />}

      {/* Phaser Game Container */}
      <div
        ref={containerRef}
        className={cn(
          'w-full aspect-[9/16] rounded-game-lg overflow-hidden',
          'bg-arcade-dark border border-arcade-border',
          !isLoaded && 'opacity-0'
        )}
      />
    </div>
  );
}
