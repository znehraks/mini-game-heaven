'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Score } from '@/types/database';

interface LeaderboardEntry {
  rank: number;
  nickname: string;
  score: number;
  createdAt: string;
}

interface ScoreRow {
  nickname: string;
  score: number;
  created_at: string;
}

interface LeaderboardTableProps {
  gameId?: string;
  limit?: number;
  showRealtime?: boolean;
}

export function LeaderboardTable({
  gameId,
  limit = 10,
  showRealtime = true,
}: LeaderboardTableProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    const supabase = createClient();

    try {
      let query = supabase
        .from('scores')
        .select('nickname, score, created_at')
        .order('score', { ascending: false })
        .limit(limit);

      if (gameId) {
        query = query.eq('game_id', gameId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const scoreData = data as ScoreRow[] | null;
      const ranked: LeaderboardEntry[] = (scoreData || []).map((item, index) => ({
        rank: index + 1,
        nickname: item.nickname,
        score: item.score,
        createdAt: item.created_at,
      }));

      setEntries(ranked);
      setError(null);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, [gameId, limit]);

  useEffect(() => {
    fetchLeaderboard();

    // Set up realtime subscription
    if (showRealtime) {
      const supabase = createClient();
      const channel = supabase
        .channel('leaderboard-changes')
        .on<Score>(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'scores',
            ...(gameId && { filter: `game_id=eq.${gameId}` }),
          },
          () => {
            // Refetch on new score
            fetchLeaderboard();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchLeaderboard, gameId, showRealtime]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-arcade-dark rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
        <p className="text-red-400 font-pixel text-xs">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-arcade-muted font-pixel text-sm">NO SCORES YET</p>
        <p className="text-arcade-muted/50 font-pixel text-xs mt-2">BE THE FIRST TO PLAY!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="leaderboard-table">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 text-arcade-muted font-pixel text-xs">
        <div className="col-span-2">RANK</div>
        <div className="col-span-6">PLAYER</div>
        <div className="col-span-4 text-right">SCORE</div>
      </div>

      {/* Entries */}
      {entries.map((entry) => (
        <div
          key={`${entry.nickname}-${entry.createdAt}`}
          className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg font-pixel text-sm
            ${entry.rank === 1 ? 'bg-neon-yellow/20 border border-neon-yellow/50' : ''}
            ${entry.rank === 2 ? 'bg-white/10 border border-white/30' : ''}
            ${entry.rank === 3 ? 'bg-amber-600/20 border border-amber-600/50' : ''}
            ${entry.rank > 3 ? 'bg-arcade-dark border border-arcade-muted/20' : ''}
          `}
        >
          <div className="col-span-2 flex items-center">
            {entry.rank <= 3 ? (
              <span className="text-lg">
                {entry.rank === 1 && '🥇'}
                {entry.rank === 2 && '🥈'}
                {entry.rank === 3 && '🥉'}
              </span>
            ) : (
              <span className="text-arcade-muted">#{entry.rank}</span>
            )}
          </div>
          <div
            className={`col-span-6 truncate ${
              entry.rank === 1
                ? 'text-neon-yellow'
                : entry.rank === 2
                  ? 'text-white'
                  : entry.rank === 3
                    ? 'text-amber-500'
                    : 'text-arcade-light'
            }`}
          >
            {entry.nickname}
          </div>
          <div
            className={`col-span-4 text-right ${
              entry.rank === 1
                ? 'text-neon-yellow'
                : entry.rank === 2
                  ? 'text-white'
                  : entry.rank === 3
                    ? 'text-amber-500'
                    : 'text-neon-cyan'
            }`}
          >
            {entry.score.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
