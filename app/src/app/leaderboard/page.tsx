'use client';

import { useState } from 'react';
import { GAMES } from '@/config/games';
import { LeaderboardTable } from '@/components/leaderboard';

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-arcade-darker pb-24">
      {/* Header */}
      <div className="bg-arcade-dark border-b border-neon-magenta/30 px-4 py-6">
        <h1 className="text-2xl font-pixel text-neon-cyan text-center">LEADERBOARD</h1>
        <p className="text-arcade-muted font-pixel text-xs text-center mt-2">
          TOP PLAYERS ACROSS ALL GAMES
        </p>
      </div>

      {/* Game Filter Tabs */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedGame(null)}
            className={`px-4 py-2 rounded-lg font-pixel text-xs whitespace-nowrap transition-all
              ${
                selectedGame === null
                  ? 'bg-neon-magenta text-white'
                  : 'bg-arcade-dark text-arcade-muted hover:text-white border border-arcade-muted/30'
              }`}
            data-testid="filter-all"
          >
            ALL GAMES
          </button>
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`px-4 py-2 rounded-lg font-pixel text-xs whitespace-nowrap transition-all
                ${
                  selectedGame === game.id
                    ? 'bg-neon-cyan text-arcade-darker'
                    : 'bg-arcade-dark text-arcade-muted hover:text-white border border-arcade-muted/30'
                }`}
              data-testid={`filter-${game.id}`}
            >
              {game.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="px-4">
        {selectedGame ? (
          <div className="mb-4">
            <h2 className="font-pixel text-neon-yellow text-sm mb-4">
              {GAMES.find((g) => g.id === selectedGame)?.name.toUpperCase()}
            </h2>
            <LeaderboardTable gameId={selectedGame} limit={20} showRealtime={true} />
          </div>
        ) : (
          <div className="space-y-8">
            {GAMES.map((game) => (
              <div
                key={game.id}
                className="border border-arcade-muted/20 rounded-xl p-4 bg-arcade-dark/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-pixel text-neon-yellow text-sm">{game.name.toUpperCase()}</h2>
                  <button
                    onClick={() => setSelectedGame(game.id)}
                    className="text-neon-cyan font-pixel text-xs hover:underline"
                  >
                    VIEW ALL →
                  </button>
                </div>
                <LeaderboardTable gameId={game.id} limit={5} showRealtime={true} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Realtime Indicator */}
      <div className="fixed bottom-20 right-4 flex items-center gap-2 bg-arcade-dark px-3 py-2 rounded-full border border-neon-green/50">
        <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
        <span className="font-pixel text-[10px] text-neon-green">LIVE</span>
      </div>
    </div>
  );
}
