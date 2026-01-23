'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ServiceWorkerMessage {
  type: string;
  url?: string;
  [key: string]: unknown;
}

/**
 * Hook to handle messages from the service worker
 * Primarily used for handling notification deeplinks
 */
export function useServiceWorkerMessages() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const handleMessage = (event: MessageEvent<ServiceWorkerMessage>) => {
      const { type, url } = event.data || {};

      switch (type) {
        case 'NAVIGATE':
          // Navigate to the specified URL
          if (url) {
            console.log('[App] Navigating to:', url);
            router.push(url);
          }
          break;

        case 'NOTIFICATION_RECEIVED':
          // Could trigger UI update or toast notification
          console.log('[App] Notification received');
          break;

        case 'SUBSCRIPTION_CHANGED':
          // Handle subscription change event
          console.log('[App] Push subscription changed');
          break;

        default:
          console.log('[App] Unknown SW message:', type);
      }
    };

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [router]);
}

/**
 * Send a message to the active service worker
 */
export async function sendMessageToSW(message: ServiceWorkerMessage): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage(message);
}

/**
 * Tell SW to skip waiting and activate new version
 */
export async function activateNewServiceWorker(): Promise<void> {
  await sendMessageToSW({ type: 'SKIP_WAITING' });
}

/**
 * Request SW to cache specific URLs
 */
export async function cacheUrls(urls: string[]): Promise<void> {
  await sendMessageToSW({ type: 'CACHE_URLS', data: { urls } });
}

/**
 * Request SW to clear all caches
 */
export async function clearCache(): Promise<void> {
  await sendMessageToSW({ type: 'CLEAR_CACHE' });
}
