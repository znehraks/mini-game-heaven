'use client';

import { createClient } from '@/lib/supabase/client';
import type { PushSubscriptionInsert } from '@/types/database';

// VAPID public key from environment
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

/**
 * Check if Push API is supported
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }
  return await Notification.requestPermission();
}

/**
 * Convert URL-safe base64 to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Get current push subscription if exists
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;

  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(userId?: string): Promise<PushSubscription> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new Error('VAPID public key is not configured');
  }

  // Request permission first
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  // Get service worker registration
  const registration = await navigator.serviceWorker.ready;

  // Check for existing subscription
  let subscription = await registration.pushManager.getSubscription();

  // If no subscription, create one
  if (!subscription) {
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
    });
  }

  // Save subscription to database
  await saveSubscriptionToDatabase(subscription, userId);

  return subscription;
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  const subscription = await getCurrentSubscription();

  if (!subscription) {
    return true; // Already unsubscribed
  }

  // Remove from database first
  await removeSubscriptionFromDatabase(subscription.endpoint);

  // Unsubscribe from push manager
  return await subscription.unsubscribe();
}

/**
 * Save push subscription to Supabase
 */
async function saveSubscriptionToDatabase(
  subscription: PushSubscription,
  userId?: string
): Promise<void> {
  const supabase = createClient();

  const subscriptionJson = subscription.toJSON();
  const keys = subscriptionJson.keys;

  if (!keys?.p256dh || !keys?.auth) {
    throw new Error('Invalid subscription keys');
  }

  const subscriptionData: PushSubscriptionInsert = {
    endpoint: subscription.endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    user_id: userId || null,
  };

  // Upsert subscription (update if endpoint exists, insert if not)
  const { error } = await supabase.from('push_subscriptions').upsert(subscriptionData as never, {
    onConflict: 'endpoint',
  });

  if (error) {
    console.error('[Push] Failed to save subscription:', error);
    throw new Error('Failed to save push subscription');
  }
}

/**
 * Remove push subscription from Supabase
 */
async function removeSubscriptionFromDatabase(endpoint: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);

  if (error) {
    console.error('[Push] Failed to remove subscription:', error);
    // Don't throw - we still want to unsubscribe locally
  }
}

/**
 * Update user_id for existing subscription (e.g., after login)
 */
export async function updateSubscriptionUser(userId: string): Promise<void> {
  const subscription = await getCurrentSubscription();

  if (!subscription) {
    return;
  }

  const supabase = createClient();

  const { error } = await supabase
    .from('push_subscriptions')
    .update({ user_id: userId } as never)
    .eq('endpoint', subscription.endpoint);

  if (error) {
    console.error('[Push] Failed to update subscription user:', error);
  }
}

/**
 * Check if user is currently subscribed to push notifications
 */
export async function isSubscribedToPush(): Promise<boolean> {
  const subscription = await getCurrentSubscription();
  return subscription !== null;
}
