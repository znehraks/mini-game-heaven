'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { usePushSubscription } from '@/hooks/usePushSubscription';
import { cn } from '@/lib/utils';

interface PushNotificationPromptProps {
  /** User ID to associate with the subscription */
  userId?: string;
  /** Called when prompt is dismissed */
  onDismiss?: () => void;
  /** Called when subscription succeeds */
  onSuccess?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Variant: 'banner' for top banner, 'card' for card style, 'compact' for inline */
  variant?: 'banner' | 'card' | 'compact';
}

const DISMISS_KEY = 'push_prompt_dismissed';
const DISMISS_EXPIRY_DAYS = 7;

/**
 * Check if prompt was dismissed in localStorage (with expiry check)
 */
function checkLocalStorageDismissed(): boolean {
  if (typeof window === 'undefined') return true;

  const dismissedUntil = localStorage.getItem(DISMISS_KEY);
  if (dismissedUntil) {
    const expiryDate = new Date(dismissedUntil);
    if (expiryDate > new Date()) {
      return true;
    }
    // Expired, remove
    localStorage.removeItem(DISMISS_KEY);
  }
  return false;
}

export function PushNotificationPrompt({
  userId,
  onDismiss,
  onSuccess,
  className,
  variant = 'card',
}: PushNotificationPromptProps) {
  // Track user-initiated dismiss action
  const [userDismissed, setUserDismissed] = useState(false);
  const { isSupported, permission, isSubscribed, isLoading, error, subscribe } =
    usePushSubscription(userId);

  // Compute whether prompt should be shown
  const shouldShow = useMemo(() => {
    // Not on server
    if (typeof window === 'undefined') return false;
    // User dismissed this session
    if (userDismissed) return false;
    // Already subscribed
    if (isSubscribed) return false;
    // Not supported
    if (!isSupported) return false;
    // Permission denied
    if (permission === 'denied') return false;
    // Check localStorage dismiss state
    if (checkLocalStorageDismissed()) return false;

    return true;
  }, [userDismissed, isSubscribed, isSupported, permission]);

  const handleDismiss = useCallback(() => {
    // Set dismiss expiry in localStorage
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + DISMISS_EXPIRY_DAYS);
    localStorage.setItem(DISMISS_KEY, expiryDate.toISOString());

    setUserDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  const handleEnable = async () => {
    try {
      await subscribe(userId);
      onSuccess?.();
    } catch {
      // Error is handled by the hook
    }
  };

  // Don't render if should not show
  if (!shouldShow) {
    return null;
  }

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'w-full bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20',
          'border-b border-arcade-border',
          'px-4 py-3',
          className
        )}
      >
        <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-pixel text-xs text-white">ENABLE NOTIFICATIONS</p>
              <p className="text-arcade-muted text-[10px]">
                Get alerts when someone beats your high score!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="neon" size="sm" onClick={handleEnable} isLoading={isLoading}>
              Enable
            </Button>
            <button
              onClick={handleDismiss}
              className="text-arcade-muted hover:text-white p-1 transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
        {error && <p className="text-game-danger text-[10px] mt-2 text-center">{error}</p>}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 p-3',
          'bg-arcade-surface/50 border border-arcade-border rounded-game',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔔</span>
          <span className="font-pixel text-[10px] text-white">Enable push notifications</span>
        </div>
        <Button variant="neon" size="sm" onClick={handleEnable} isLoading={isLoading}>
          Enable
        </Button>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div
      className={cn(
        'relative p-6 rounded-game-lg',
        'bg-gradient-to-br from-arcade-surface to-arcade-dark',
        'border border-arcade-border',
        'shadow-lg shadow-black/30',
        className
      )}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className={cn(
          'absolute top-3 right-3',
          'w-6 h-6 rounded-full flex items-center justify-center',
          'text-arcade-muted hover:text-white hover:bg-arcade-border',
          'transition-colors duration-fast'
        )}
        aria-label="Dismiss"
      >
        ✕
      </button>

      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center">
          <span className="text-4xl">🔔</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-arcade text-sm text-center text-neon-cyan mb-2">STAY IN THE GAME!</h3>

      {/* Description */}
      <p className="text-arcade-muted text-center text-xs mb-6">
        Enable notifications to get alerts when someone beats your high score. Never let a nemesis
        go unchallenged!
      </p>

      {/* Error message */}
      {error && <p className="text-game-danger text-center text-[10px] mb-4">{error}</p>}

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <Button variant="primary" fullWidth onClick={handleEnable} isLoading={isLoading}>
          ENABLE NOTIFICATIONS
        </Button>
        <Button variant="ghost" fullWidth onClick={handleDismiss} disabled={isLoading}>
          MAYBE LATER
        </Button>
      </div>
    </div>
  );
}
