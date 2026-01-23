'use client';

import { getPendingScores, markScoreSynced, clearSyncedScores } from './indexedDB';
import { submitScore } from '@/lib/scores';

let isSyncing = false;

/**
 * Sync all pending scores to the server
 */
export async function syncPendingScores(): Promise<{ synced: number; failed: number }> {
  if (isSyncing) {
    console.log('[Sync] Already syncing, skipping...');
    return { synced: 0, failed: 0 };
  }

  if (!navigator.onLine) {
    console.log('[Sync] Offline, skipping sync...');
    return { synced: 0, failed: 0 };
  }

  isSyncing = true;
  let synced = 0;
  let failed = 0;

  try {
    const pendingScores = await getPendingScores();
    console.log(`[Sync] Found ${pendingScores.length} pending scores`);

    for (const pending of pendingScores) {
      try {
        const result = await submitScore({
          gameId: pending.gameId,
          score: pending.score,
        });

        if (result.success) {
          await markScoreSynced(pending.id);
          synced++;
          console.log(`[Sync] Score ${pending.id} synced successfully`);
        } else {
          failed++;
          console.error(`[Sync] Failed to sync score ${pending.id}:`, result.error);
        }
      } catch (error) {
        failed++;
        console.error(`[Sync] Error syncing score ${pending.id}:`, error);
      }
    }

    // Cleanup synced scores
    if (synced > 0) {
      await clearSyncedScores();
    }
  } catch (error) {
    console.error('[Sync] Error during sync:', error);
  } finally {
    isSyncing = false;
  }

  return { synced, failed };
}

/**
 * Set up online/offline event listeners for automatic sync
 */
export function setupOnlineSync(): () => void {
  const handleOnline = () => {
    console.log('[Sync] App is online, starting sync...');
    syncPendingScores();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      console.log('[Sync] App became visible and online, starting sync...');
      syncPendingScores();
    }
  };

  window.addEventListener('online', handleOnline);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Initial sync if online
  if (navigator.onLine) {
    syncPendingScores();
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
