'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isPushSupported,
  getNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribedToPush,
} from '@/lib/push';

export interface UsePushSubscriptionReturn {
  /** Whether push notifications are supported by the browser */
  isSupported: boolean;
  /** Current notification permission status */
  permission: NotificationPermission | 'unsupported';
  /** Whether user is currently subscribed to push notifications */
  isSubscribed: boolean;
  /** Whether an operation is in progress */
  isLoading: boolean;
  /** Error message if any operation failed */
  error: string | null;
  /** Subscribe to push notifications */
  subscribe: (userId?: string) => Promise<void>;
  /** Unsubscribe from push notifications */
  unsubscribe: () => Promise<void>;
  /** Refresh subscription status */
  refresh: () => Promise<void>;
}

export function usePushSubscription(userId?: string): UsePushSubscriptionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    'unsupported'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check support and initial state
  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supported = isPushSupported();
        setIsSupported(supported);

        if (!supported) {
          setPermission('unsupported');
          setIsSubscribed(false);
          return;
        }

        setPermission(getNotificationPermission());
        const subscribed = await isSubscribedToPush();
        setIsSubscribed(subscribed);
      } catch (err) {
        console.error('[Push Hook] Error checking status:', err);
        setError('Failed to check push notification status');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(
    async (subscribeUserId?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await subscribeToPush(subscribeUserId || userId);
        setPermission(getNotificationPermission());
        setIsSubscribed(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to subscribe';
        setError(message);
        setPermission(getNotificationPermission());
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await unsubscribeFromPush();
      setIsSubscribed(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh subscription status
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setPermission(getNotificationPermission());
      const subscribed = await isSubscribedToPush();
      setIsSubscribed(subscribed);
    } catch (err) {
      console.error('[Push Hook] Error refreshing status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    refresh,
  };
}
