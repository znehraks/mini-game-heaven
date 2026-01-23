'use client';

import { createClient } from '@/lib/supabase/client';
import type { ScoreInsert } from '@/types/database';
import { getGuestUser, getCurrentUser } from '@/lib/auth';
import { savePendingScore } from '@/lib/offline/indexedDB';

interface SubmitScoreParams {
  gameId: string;
  score: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

interface ScoreResult {
  success: boolean;
  error?: string;
  scoreId?: string;
  savedOffline?: boolean;
}

/**
 * Submit a score to the leaderboard
 * Works for both authenticated users and guests
 */
export async function submitScore({
  gameId,
  score,
  durationMs,
  metadata = {},
}: SubmitScoreParams): Promise<ScoreResult> {
  const supabase = createClient();

  try {
    // Get user info
    const authUser = await getCurrentUser();
    const guestUser = getGuestUser();

    if (!authUser && !guestUser) {
      return {
        success: false,
        error: 'No user session found. Please login or play as guest.',
      };
    }

    // Determine nickname and user_id
    let nickname: string;
    let userId: string | null = null;

    if (authUser) {
      userId = authUser.id;
      nickname =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split('@')[0] ||
        'Player';
    } else if (guestUser) {
      nickname = guestUser.name;
    } else {
      return { success: false, error: 'Unable to determine user identity' };
    }

    // Insert score
    const scoreData: ScoreInsert = {
      game_id: gameId,
      user_id: userId,
      nickname,
      score,
      duration_ms: durationMs,
      metadata,
      validated: false, // Server-side validation would set this to true
    };

    const { data, error } = await supabase
      .from('scores')
      .insert(scoreData as never)
      .select('id')
      .single();

    if (error) {
      console.error('Score submission error:', error);

      // Save offline if we're offline or got a network error
      if (
        !navigator.onLine ||
        error.message.includes('network') ||
        error.message.includes('fetch')
      ) {
        try {
          const offlineId = await savePendingScore(gameId, score);
          console.log('Score saved offline:', offlineId);
          return {
            success: true,
            scoreId: offlineId,
            savedOffline: true,
          };
        } catch (offlineErr) {
          console.error('Failed to save score offline:', offlineErr);
        }
      }

      return {
        success: false,
        error: error.message,
      };
    }

    const result = data as { id: string } | null;
    return {
      success: true,
      scoreId: result?.id,
    };
  } catch (err) {
    console.error('Score submission error:', err);

    // Try to save offline if network error
    if (!navigator.onLine || (err instanceof Error && err.message.includes('network'))) {
      try {
        const offlineId = await savePendingScore(gameId, score);
        console.log('Score saved offline:', offlineId);
        return {
          success: true,
          scoreId: offlineId,
          savedOffline: true,
        };
      } catch (offlineErr) {
        console.error('Failed to save score offline:', offlineErr);
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Get user's best score for a game
 */
export async function getUserBestScore(gameId: string): Promise<number | null> {
  const supabase = createClient();

  const authUser = await getCurrentUser();
  const guestUser = getGuestUser();

  if (!authUser && !guestUser) {
    return null;
  }

  try {
    let query = supabase
      .from('scores')
      .select('score')
      .eq('game_id', gameId)
      .order('score', { ascending: false })
      .limit(1);

    if (authUser) {
      query = query.eq('user_id', authUser.id);
    } else if (guestUser) {
      query = query.eq('nickname', guestUser.name);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return null;
    }

    const scores = data as Array<{ score: number }>;
    return scores[0]?.score ?? null;
  } catch {
    return null;
  }
}

/**
 * Get user's recent scores
 */
export async function getUserRecentScores(
  gameId?: string,
  limit = 10
): Promise<Array<{ game_id: string; score: number; created_at: string }>> {
  const supabase = createClient();

  const authUser = await getCurrentUser();
  const guestUser = getGuestUser();

  if (!authUser && !guestUser) {
    return [];
  }

  try {
    let query = supabase
      .from('scores')
      .select('game_id, score, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (gameId) {
      query = query.eq('game_id', gameId);
    }

    if (authUser) {
      query = query.eq('user_id', authUser.id);
    } else if (guestUser) {
      query = query.eq('nickname', guestUser.name);
    }

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    return data as Array<{ game_id: string; score: number; created_at: string }>;
  } catch {
    return [];
  }
}

/**
 * Listen for game score events and submit automatically
 * Call this in the game page to handle score submission
 */
export function setupScoreListener(gameId: string): () => void {
  const handleGameScore = (event: Event) => {
    const customEvent = event as CustomEvent<{ score: number; gameId: string }>;
    if (customEvent.detail.gameId !== gameId) return;

    submitScore({
      gameId: customEvent.detail.gameId,
      score: customEvent.detail.score,
    }).then((result) => {
      if (result.success) {
        console.log('Score submitted successfully:', result.scoreId);
      } else {
        console.error('Failed to submit score:', result.error);
        // Could save to IndexedDB for offline storage here
      }
    });
  };

  window.addEventListener('gameScore', handleGameScore);

  return () => {
    window.removeEventListener('gameScore', handleGameScore);
  };
}
