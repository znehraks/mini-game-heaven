'use client';

import { usePushSubscription } from '@/hooks/usePushSubscription';
import { cn } from '@/lib/utils';

interface PushNotificationToggleProps {
  /** User ID to associate with the subscription */
  userId?: string;
  /** Additional CSS classes */
  className?: string;
  /** Show detailed status information */
  showStatus?: boolean;
}

export function PushNotificationToggle({
  userId,
  className,
  showStatus = false,
}: PushNotificationToggleProps) {
  const { isSupported, permission, isSubscribed, isLoading, error, subscribe, unsubscribe } =
    usePushSubscription(userId);

  const handleToggle = async () => {
    if (isLoading) return;

    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe(userId);
      }
    } catch {
      // Error is handled by the hook
    }
  };

  // Get status text
  const getStatusText = (): string => {
    if (!isSupported) return 'Not supported';
    if (permission === 'denied') return 'Blocked by browser';
    if (isSubscribed) return 'Enabled';
    return 'Disabled';
  };

  const getStatusColor = (): string => {
    if (!isSupported || permission === 'denied') return 'text-game-danger';
    if (isSubscribed) return 'text-game-success';
    return 'text-arcade-muted';
  };

  const isDisabled = !isSupported || permission === 'denied' || isLoading;

  return (
    <div className={cn('flex items-center justify-between py-3', className)}>
      <div className="flex items-center gap-3">
        <span className="text-xl">🔔</span>
        <div>
          <div className="font-pixel text-xs text-white">PUSH NOTIFICATIONS</div>
          {showStatus ? (
            <div className={cn('text-[10px] mt-0.5', getStatusColor())}>{getStatusText()}</div>
          ) : (
            <div className="text-arcade-muted text-[10px] mt-0.5">
              Get alerts for new high scores
            </div>
          )}
          {error && <div className="text-game-danger text-[10px] mt-0.5">{error}</div>}
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={isDisabled}
        className={cn(
          'relative w-12 h-6 rounded-full transition-colors duration-200',
          isSubscribed ? 'bg-neon-cyan' : 'bg-arcade-muted/50',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Toggle push notifications"
      >
        {isLoading ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </span>
        ) : (
          <span
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200',
              isSubscribed ? 'translate-x-7' : 'translate-x-1'
            )}
          />
        )}
      </button>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
