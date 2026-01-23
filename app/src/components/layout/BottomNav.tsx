'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  testId: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Games', icon: '🎮', testId: 'nav-games' },
  { href: '/leaderboard', label: 'Ranks', icon: '🏆', testId: 'nav-leaderboard' },
  { href: '/profile', label: 'Profile', icon: '👤', testId: 'nav-profile' },
];

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      data-testid="bottom-nav"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-arcade-darker/95 backdrop-blur-md',
        'border-t border-arcade-border',
        'safe-area-bottom',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.testId}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg',
                  'transition-all duration-fast',
                  isActive ? 'text-neon-cyan scale-110' : 'text-text-secondary hover:text-white'
                )}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
