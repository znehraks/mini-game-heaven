'use client';

const DB_NAME = 'mini-game-heaven';
const DB_VERSION = 1;
const SCORES_STORE = 'pending_scores';

export interface PendingScore {
  id: string;
  gameId: string;
  score: number;
  timestamp: number;
  synced: boolean;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create pending scores store
      if (!db.objectStoreNames.contains(SCORES_STORE)) {
        const store = db.createObjectStore(SCORES_STORE, { keyPath: 'id' });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('gameId', 'gameId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Save a score to IndexedDB for later sync
 */
export async function savePendingScore(gameId: string, score: number): Promise<string> {
  const db = await openDB();
  const id = `${gameId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const pendingScore: PendingScore = {
    id,
    gameId,
    score,
    timestamp: Date.now(),
    synced: false,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SCORES_STORE], 'readwrite');
    const store = transaction.objectStore(SCORES_STORE);
    const request = store.add(pendingScore);

    request.onsuccess = () => {
      resolve(id);
    };

    request.onerror = () => {
      reject(new Error('Failed to save pending score'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Get all unsynced scores
 */
export async function getPendingScores(): Promise<PendingScore[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SCORES_STORE], 'readonly');
    const store = transaction.objectStore(SCORES_STORE);
    const index = store.index('synced');
    const request = index.getAll(IDBKeyRange.only(false));

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(new Error('Failed to get pending scores'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Mark a score as synced
 */
export async function markScoreSynced(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SCORES_STORE], 'readwrite');
    const store = transaction.objectStore(SCORES_STORE);
    const request = store.get(id);

    request.onsuccess = () => {
      const score = request.result as PendingScore | undefined;
      if (score) {
        score.synced = true;
        store.put(score);
        resolve();
      } else {
        reject(new Error('Score not found'));
      }
    };

    request.onerror = () => {
      reject(new Error('Failed to mark score as synced'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Delete a pending score
 */
export async function deletePendingScore(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SCORES_STORE], 'readwrite');
    const store = transaction.objectStore(SCORES_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to delete pending score'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * Clear all synced scores (cleanup)
 */
export async function clearSyncedScores(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SCORES_STORE], 'readwrite');
    const store = transaction.objectStore(SCORES_STORE);
    const index = store.index('synced');
    const request = index.openCursor(IDBKeyRange.only(true));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    request.onerror = () => {
      reject(new Error('Failed to clear synced scores'));
    };

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

/**
 * Get pending score count
 */
export async function getPendingScoreCount(): Promise<number> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SCORES_STORE], 'readonly');
    const store = transaction.objectStore(SCORES_STORE);
    const index = store.index('synced');
    const request = index.count(IDBKeyRange.only(false));

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to count pending scores'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}
