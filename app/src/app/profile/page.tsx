'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser, getGuestUser, signOut, clearGuestUser } from '@/lib/auth';
import { GAMES } from '@/config/games';
import type { User } from '@supabase/supabase-js';
import type { GuestUser } from '@/lib/auth';

interface GameStats {
  gameId: string;
  gameName: string;
  highScore: number;
  gamesPlayed: number;
  lastPlayed: string | null;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

const BADGES: Badge[] = [
  {
    id: 'first-game',
    name: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    earned: false,
  },
  {
    id: 'century',
    name: 'Century',
    description: 'Score 100 points in any game',
    icon: '💯',
    earned: false,
  },
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Score 500 points in any game',
    icon: '⭐',
    earned: false,
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Play 10 games total',
    icon: '🏆',
    earned: false,
  },
  {
    id: 'master',
    name: 'Master',
    description: 'Score 1000 points in any game',
    icon: '👑',
    earned: false,
  },
  {
    id: 'all-rounder',
    name: 'All-Rounder',
    description: 'Play all available games',
    icon: '🌟',
    earned: false,
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  const fetchStats = useCallback(async (userId: string | null, nickname: string | null) => {
    const supabase = createClient();

    try {
      // Fetch scores based on user type
      let query = supabase.from('scores').select('game_id, score, created_at');

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (nickname) {
        query = query.eq('nickname', nickname);
      } else {
        return;
      }

      const { data } = await query;

      // Type assertion for Supabase query result
      interface ScoreRow {
        game_id: string;
        score: number;
        created_at: string;
      }
      const scores = data as ScoreRow[] | null;

      if (!scores) return;

      // Calculate stats per game
      const statsMap = new Map<string, { scores: number[]; dates: string[] }>();

      scores.forEach((score) => {
        const existing = statsMap.get(score.game_id) || { scores: [], dates: [] };
        existing.scores.push(score.score);
        existing.dates.push(score.created_at);
        statsMap.set(score.game_id, existing);
      });

      const stats: GameStats[] = GAMES.map((game) => {
        const gameData = statsMap.get(game.id);
        if (!gameData) {
          return {
            gameId: game.id,
            gameName: game.name,
            highScore: 0,
            gamesPlayed: 0,
            lastPlayed: null,
          };
        }
        return {
          gameId: game.id,
          gameName: game.name,
          highScore: Math.max(...gameData.scores),
          gamesPlayed: gameData.scores.length,
          lastPlayed: gameData.dates.sort().reverse()[0] || null,
        };
      });

      setGameStats(stats);
      setTotalGamesPlayed(scores.length);

      // Calculate badges
      const earnedBadges = BADGES.map((badge) => {
        let earned = false;

        switch (badge.id) {
          case 'first-game':
            earned = scores.length > 0;
            break;
          case 'century':
            earned = scores.some((s) => s.score >= 100);
            break;
          case 'high-scorer':
            earned = scores.some((s) => s.score >= 500);
            break;
          case 'dedicated':
            earned = scores.length >= 10;
            break;
          case 'master':
            earned = scores.some((s) => s.score >= 1000);
            break;
          case 'all-rounder':
            earned = stats.every((s) => s.gamesPlayed > 0);
            break;
        }

        return { ...badge, earned };
      });

      setBadges(earnedBadges);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    async function loadUser() {
      const auth = await getCurrentUser();
      const guest = getGuestUser();

      if (!auth && !guest) {
        router.push('/login');
        return;
      }

      setAuthUser(auth);
      setGuestUser(guest);
      setIsLoading(false);

      // Fetch stats
      if (auth) {
        fetchStats(auth.id, null);
      } else if (guest) {
        fetchStats(null, guest.name);
      }
    }

    loadUser();
  }, [router, fetchStats]);

  const handleLogout = async () => {
    if (authUser) {
      await signOut();
    } else {
      clearGuestUser();
    }
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-arcade-darker flex items-center justify-center">
        <div className="text-neon-cyan font-pixel text-sm animate-pulse">LOADING...</div>
      </div>
    );
  }

  const displayName =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.email?.split('@')[0] ||
    guestUser?.name ||
    'Player';

  const avatarUrl = authUser?.user_metadata?.avatar_url;
  const isGuest = !authUser && !!guestUser;
  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  return (
    <div className="min-h-screen bg-arcade-darker pb-24">
      {/* Header */}
      <div className="bg-arcade-dark border-b border-neon-magenta/30 px-4 py-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{isGuest ? '👤' : '🎮'}</span>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-xl font-pixel text-neon-cyan">{displayName}</h1>
            <p className="text-arcade-muted font-pixel text-xs mt-1">
              {isGuest ? 'GUEST PLAYER' : 'DISCORD PLAYER'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2 p-4">
        <div className="bg-arcade-dark rounded-lg p-3 text-center border border-arcade-muted/20">
          <div className="text-neon-cyan font-pixel text-lg">{totalGamesPlayed}</div>
          <div className="text-arcade-muted font-pixel text-[10px] mt-1">GAMES</div>
        </div>
        <div className="bg-arcade-dark rounded-lg p-3 text-center border border-arcade-muted/20">
          <div className="text-neon-magenta font-pixel text-lg">
            {Math.max(...gameStats.map((s) => s.highScore), 0)}
          </div>
          <div className="text-arcade-muted font-pixel text-[10px] mt-1">BEST</div>
        </div>
        <div className="bg-arcade-dark rounded-lg p-3 text-center border border-arcade-muted/20">
          <div className="text-neon-yellow font-pixel text-lg">
            {earnedBadgesCount}/{badges.length}
          </div>
          <div className="text-arcade-muted font-pixel text-[10px] mt-1">BADGES</div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-4 mb-6">
        <h2 className="font-pixel text-neon-yellow text-sm mb-3">BADGES</h2>
        <div className="grid grid-cols-3 gap-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-arcade-dark rounded-lg p-3 text-center border ${
                badge.earned
                  ? 'border-neon-yellow/50 bg-neon-yellow/10'
                  : 'border-arcade-muted/20 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="font-pixel text-[10px] text-white">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Stats */}
      <div className="px-4 mb-6">
        <h2 className="font-pixel text-neon-cyan text-sm mb-3">GAME STATS</h2>
        <div className="space-y-2">
          {gameStats.map((stat) => (
            <div
              key={stat.gameId}
              className="bg-arcade-dark rounded-lg p-4 border border-arcade-muted/20"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-pixel text-xs text-white">{stat.gameName}</div>
                  <div className="text-arcade-muted font-pixel text-[10px] mt-1">
                    {stat.gamesPlayed} plays
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-pixel text-sm text-neon-cyan">
                    {stat.highScore > 0 ? stat.highScore.toLocaleString() : '-'}
                  </div>
                  <div className="text-arcade-muted font-pixel text-[10px]">HIGH SCORE</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guest Warning */}
      {isGuest && (
        <div className="px-4 mb-6">
          <div className="bg-neon-yellow/10 border border-neon-yellow/50 rounded-lg p-4">
            <p className="text-neon-yellow font-pixel text-xs text-center">
              SIGN IN WITH DISCORD TO SAVE YOUR PROGRESS PERMANENTLY
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-3 w-full bg-[#5865F2] text-white py-2 rounded-lg font-pixel text-xs"
            >
              SIGN IN
            </button>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="px-4">
        <button
          onClick={handleLogout}
          className="w-full bg-arcade-dark border border-red-500/50 text-red-400 py-3 rounded-lg font-pixel text-xs hover:bg-red-500/10 transition-colors"
        >
          {isGuest ? 'CLEAR GUEST DATA' : 'SIGN OUT'}
        </button>
      </div>
    </div>
  );
}
