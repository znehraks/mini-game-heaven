'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const openSettings = useUIStore((state) => state.openSettings);

  return (
    <header
      data-testid="header"
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-arcade-darker/80 backdrop-blur-md',
        'border-b border-arcade-border',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" data-testid="home-link" className="flex items-center gap-2">
            <span className="text-2xl">🕹️</span>
            <span className="font-arcade text-xs text-neon-cyan text-glow-cyan hidden sm:block">
              MINI GAME HEAVEN
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/leaderboard"
              className={cn(
                'text-sm text-text-secondary hover:text-white',
                'transition-colors duration-fast'
              )}
            >
              🏆 Leaderboard
            </Link>
            <button
              onClick={openSettings}
              data-testid="settings-button"
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg',
                'text-text-secondary hover:text-white hover:bg-arcade-surface',
                'transition-colors duration-fast'
              )}
              aria-label="Open settings"
            >
              ⚙️
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
