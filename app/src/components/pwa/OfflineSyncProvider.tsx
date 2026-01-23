'use client';

import { useEffect } from 'react';
import { setupOnlineSync } from '@/lib/offline/syncService';

export function OfflineSyncProvider() {
  useEffect(() => {
    const cleanup = setupOnlineSync();
    return cleanup;
  }, []);

  return null;
}
