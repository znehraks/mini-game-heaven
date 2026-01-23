const CACHE_NAME = 'mini-game-heaven-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on install
const PRECACHE_ASSETS = ['/', '/offline', '/icons/icon.svg', '/manifest.json'];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Claim clients immediately
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  // Skip API requests (should not be cached)
  if (event.request.url.includes('/api/')) return;

  // Skip Supabase requests
  if (event.request.url.includes('supabase')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If it's a navigation request, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }

          // Return empty response for other requests
          return new Response('', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});

// ============================================
// Push Notification Handling
// ============================================

/**
 * Handle incoming push notifications
 * Expected payload format:
 * {
 *   title: string,
 *   body: string,
 *   icon?: string,
 *   badge?: string,
 *   tag?: string,
 *   data?: {
 *     url?: string,
 *     type?: 'nemesis' | 'achievement' | 'general',
 *     gameId?: string,
 *     challengerId?: string,
 *     challengerName?: string,
 *   }
 * }
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('[SW] Push received but no data');
    return;
  }

  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    console.error('[SW] Failed to parse push data:', e);
    return;
  }

  console.log('[SW] Push received:', payload);

  const {
    title = 'Mini Game Heaven',
    body = 'You have a new notification',
    icon = '/icons/icon.svg',
    badge = '/icons/icon.svg',
    tag,
    data = {},
  } = payload;

  // Build notification options
  const options = {
    body,
    icon,
    badge,
    tag: tag || `notification-${Date.now()}`,
    data,
    vibrate: [100, 50, 100],
    requireInteraction: data.type === 'nemesis', // Keep nemesis alerts visible
    actions: getNotificationActions(data.type),
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Get action buttons based on notification type
 */
function getNotificationActions(type) {
  switch (type) {
    case 'nemesis':
      return [
        { action: 'play', title: '🎮 Play Now', icon: '/icons/icon.svg' },
        { action: 'view', title: '👀 View Score', icon: '/icons/icon.svg' },
      ];
    case 'achievement':
      return [
        { action: 'share', title: '📤 Share', icon: '/icons/icon.svg' },
        { action: 'view', title: '🏆 View', icon: '/icons/icon.svg' },
      ];
    default:
      return [{ action: 'open', title: 'Open App', icon: '/icons/icon.svg' }];
  }
}

/**
 * Handle notification click events
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { data, action } = event.notification;
  const notificationData = data || {};

  console.log('[SW] Notification clicked:', { action, data: notificationData });

  // Determine target URL based on action and data
  let targetUrl = '/';

  if (action === 'play' && notificationData.gameId) {
    // Go directly to the game
    targetUrl = `/games/${notificationData.gameId}`;
  } else if (action === 'view') {
    // View score/achievement - go to leaderboard or profile
    if (notificationData.gameId) {
      targetUrl = `/leaderboard?game=${notificationData.gameId}`;
    } else {
      targetUrl = '/profile';
    }
  } else if (action === 'share') {
    // For share action, go to profile to share from there
    targetUrl = '/profile';
  } else if (notificationData.url) {
    // Use custom URL if provided
    targetUrl = notificationData.url;
  } else if (notificationData.gameId) {
    // Default: go to the game
    targetUrl = `/games/${notificationData.gameId}`;
  }

  event.waitUntil(handleNotificationClick(targetUrl));
});

/**
 * Open or focus the app window
 */
async function handleNotificationClick(targetUrl) {
  // Get all open windows
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  // Check if app is already open
  for (const client of windowClients) {
    const clientUrl = new URL(client.url);

    // If app is open, focus it and navigate
    if (clientUrl.origin === self.location.origin) {
      await client.focus();
      // Navigate to target URL
      client.postMessage({
        type: 'NAVIGATE',
        url: targetUrl,
      });
      return;
    }
  }

  // App not open, open new window
  return self.clients.openWindow(targetUrl);
}

/**
 * Handle notification close without click
 */
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);
  // Could track analytics here
});

// ============================================
// Push Subscription Change
// ============================================

/**
 * Handle push subscription changes (renewal, expiration)
 */
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] Push subscription changed');

  event.waitUntil(
    // Re-subscribe with new subscription
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: event.oldSubscription?.options?.applicationServerKey,
      })
      .then((subscription) => {
        // Send new subscription to server
        return fetch('/api/push/resubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oldEndpoint: event.oldSubscription?.endpoint,
            newSubscription: subscription.toJSON(),
          }),
        });
      })
      .catch((err) => {
        console.error('[SW] Failed to resubscribe:', err);
      })
  );
});

// ============================================
// Message Handling
// ============================================

self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_URLS':
      // Cache specific URLs on demand
      if (data?.urls && Array.isArray(data.urls)) {
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(data.urls);
          })
        );
      }
      break;

    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.delete(CACHE_NAME).then(() => {
          return caches.open(CACHE_NAME);
        })
      );
      break;

    default:
      console.log('[SW] Unknown message type:', type);
  }
});
