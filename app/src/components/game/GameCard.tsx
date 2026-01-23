'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Game } from '@/types/database';

interface GameCardProps {
  game: Game;
  className?: string;
}

export function GameCard({ game, className }: GameCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/games/${game.id}`}
      data-testid="game-card"
      className={cn(
        'group relative block overflow-hidden rounded-game-lg',
        'bg-arcade-surface border border-arcade-border',
        'transition-all duration-normal',
        'hover:border-neon-purple hover:glow-purple hover:scale-[1.02]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {game.thumbnail && !imageError ? (
          <Image
            src={game.thumbnail}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-normal group-hover:scale-110"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-arcade-dark flex items-center justify-center">
            <span className="text-6xl">🎮</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-arcade-darker via-transparent to-transparent" />

        {/* Play icon on hover */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-fast'
          )}
        >
          <div className="w-16 h-16 rounded-full bg-neon-purple/80 flex items-center justify-center glow-purple">
            <span className="text-2xl ml-1">▶</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-arcade text-xs text-white mb-2 line-clamp-1">{game.name}</h3>
        <p className="text-sm text-text-secondary line-clamp-2">{game.description}</p>
      </div>
    </Link>
  );
}
