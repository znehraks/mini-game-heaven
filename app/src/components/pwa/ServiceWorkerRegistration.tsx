'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ServiceWorkerMessage {
  type: string;
  url?: string;
}

export function ServiceWorkerRegistration() {
  const router = useRouter();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let refreshing = false;

    // Handle messages from service worker (deeplinks)
    const handleMessage = (event: MessageEvent<ServiceWorkerMessage>) => {
      const { type, url } = event.data || {};

      if (type === 'NAVIGATE' && url) {
        console.log('[App] Navigating via push notification to:', url);
        router.push(url);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, prompt user to refresh
                console.log('[SW] New content available, refresh to update');
                setUpdateAvailable(true);
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error);
      });

    // Handle controller change (when new SW takes over)
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, [router]);

  // Show update prompt when new version is available
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
        <div className="bg-arcade-surface border border-neon-cyan rounded-game p-4 shadow-lg shadow-neon-cyan/20">
          <p className="font-pixel text-xs text-white mb-3">NEW VERSION AVAILABLE</p>
          <p className="text-arcade-muted text-[10px] mb-4">Refresh to get the latest features.</p>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-neon-cyan text-arcade-dark font-pixel text-[10px] py-2 px-3 rounded-game hover:bg-neon-cyan/80 transition-colors"
            >
              REFRESH NOW
            </button>
            <button
              onClick={() => setUpdateAvailable(false)}
              className="px-3 py-2 text-arcade-muted hover:text-white transition-colors"
            >
              LATER
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
