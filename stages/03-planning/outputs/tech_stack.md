# Technology Stack Decision: Mini-Game Heaven

> Generated: 2026-01-22
> Stage: 03-planning
> AI Model: Claude (Strategic Architect Persona)

---

## Executive Summary

This document finalizes the technology stack for mini-game-heaven based on research from Stage 02. All decisions prioritize rapid development, low cost, and scalability.

---

## 1. Final Stack Overview

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Frontend Framework** | Next.js | 14.x | App Router, Server Actions, SSR |
| **Game Engine** | Phaser | 3.80+ | Full framework, Next.js template |
| **Language** | TypeScript | 5.x | Type safety, better DX |
| **Styling** | Tailwind CSS | 3.x | Rapid UI development |
| **State (Client)** | Zustand | 4.x | Simple, lightweight |
| **State (Server)** | TanStack Query | 5.x | Caching, Realtime integration |
| **Backend** | Supabase | Latest | Database, Auth, Realtime |
| **PWA** | next-pwa | 5.x | Service worker, offline |
| **Push Notifications** | web-push | 3.x | VAPID-based push |
| **Hosting** | Vercel | Latest | Edge network, CI/CD |
| **Analytics** | Vercel Analytics | Latest | Performance monitoring |

---

## 2. Frontend Stack

### 2.1 Next.js 14

**Version**: 14.x (latest stable)

**Features Used**:
- App Router (file-based routing)
- Server Components (for static pages)
- Client Components (for games)
- Server Actions (for score submission)
- Dynamic imports (for game loading)
- Middleware (for auth checks)

**Configuration**:
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: '*.supabase.co' },
    ],
  },
  experimental: {
    serverActions: true,
  },
});
```

### 2.2 Phaser 3

**Version**: 3.80+

**Why Phaser over alternatives**:
| Criteria | Phaser | PixiJS | Canvas |
|----------|--------|--------|--------|
| Learning Curve | Low | Medium | High |
| Built-in Physics | Yes | No | No |
| Audio Support | Yes | No | Manual |
| Bundle Size | 1.2MB | 450KB | 0KB |
| Next.js Support | Official | Good | Good |
| Time to MVP | Days | Weeks | Months |

**Integration Pattern**:
```typescript
// components/game/GameLoader.tsx
import dynamic from 'next/dynamic';

const GameCanvas = dynamic(
  () => import('./GameCanvas'),
  {
    ssr: false,
    loading: () => <GameSkeleton />
  }
);
```

### 2.3 TypeScript

**Version**: 5.x

**Configuration**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "ES2020"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"],
      "@/games/*": ["./games/*"]
    }
  }
}
```

### 2.4 Tailwind CSS

**Version**: 3.x

**Why Tailwind**:
- Rapid prototyping
- Consistent design system
- Small production bundle
- Dark mode support built-in

**Custom Theme**:
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff00ff',
          cyan: '#00ffff',
          purple: '#8b5cf6',
        },
        arcade: {
          dark: '#0a0a0f',
          darker: '#050508',
        }
      },
      fontFamily: {
        arcade: ['Press Start 2P', 'monospace'],
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    }
  }
};
```

---

## 3. State Management

### 3.1 Zustand (Client State)

**Version**: 4.x

**Use Cases**:
- UI state (modals, menus)
- Game state (current score, lives)
- User preferences (sound, theme)

**Example Store**:
```typescript
// stores/gameStore.ts
import { create } from 'zustand';

interface GameState {
  currentScore: number;
  highScore: number;
  isPlaying: boolean;
  setScore: (score: number) => void;
  startGame: () => void;
  endGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentScore: 0,
  highScore: 0,
  isPlaying: false,
  setScore: (score) => set({ currentScore: score }),
  startGame: () => set({ isPlaying: true, currentScore: 0 }),
  endGame: () => set((state) => ({
    isPlaying: false,
    highScore: Math.max(state.highScore, state.currentScore)
  })),
}));
```

### 3.2 TanStack Query (Server State)

**Version**: 5.x

**Use Cases**:
- Leaderboard fetching
- User profile
- Realtime subscriptions

**Example Usage**:
```typescript
// hooks/useLeaderboard.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useLeaderboard(gameId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['leaderboard', gameId],
    queryFn: async () => {
      const { data } = await supabase
        .from('scores')
        .select('*')
        .eq('game_id', gameId)
        .order('score', { ascending: false })
        .limit(100);
      return data;
    },
  });

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`leaderboard-${gameId}`)
      .on('postgres_changes',
        { event: 'INSERT', table: 'scores', filter: `game_id=eq.${gameId}` },
        () => queryClient.invalidateQueries(['leaderboard', gameId])
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [gameId]);

  return query;
}
```

---

## 4. Backend Stack

### 4.1 Supabase

**Services Used**:

| Service | Purpose | Tier |
|---------|---------|------|
| Database | PostgreSQL for all data | Free |
| Auth | Discord OAuth | Free |
| Realtime | Leaderboard updates | Free |
| Edge Functions | Score validation | Free |
| Storage | Game assets (optional) | Free |

**Client Configuration**:
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Server Configuration**:
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set(name, value, options),
        remove: (name, options) => cookieStore.set(name, '', options),
      },
    }
  );
}
```

### 4.2 Edge Functions

**Use Cases**:
- Score validation
- Push notification sending
- Nemesis detection

**Example Edge Function**:
```typescript
// supabase/functions/validate-score/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';

serve(async (req) => {
  const { score, game_id, duration_ms, metadata } = await req.json();

  const isValid = validateScore({ score, game_id, duration_ms, metadata });

  if (!isValid) {
    return new Response(
      JSON.stringify({ error: 'Invalid score' }),
      { status: 400 }
    );
  }

  // Insert validated score...

  return new Response(JSON.stringify({ success: true }));
});
```

---

## 5. PWA & Push Stack

### 5.1 next-pwa

**Version**: 5.x

**Configuration**:
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
      },
    },
    {
      urlPattern: /\/games\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'game-assets',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
});
```

### 5.2 web-push

**Version**: 3.x

**Implementation**:
```typescript
// lib/push/subscribe.ts
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  // Save to Supabase
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
  });

  return subscription;
}
```

---

## 6. Development Tools

### 6.1 Code Quality

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 8.x | Linting |
| Prettier | 3.x | Formatting |
| Husky | 9.x | Git hooks |
| lint-staged | 15.x | Pre-commit linting |

### 6.2 Testing

| Tool | Version | Purpose |
|------|---------|---------|
| Vitest | 1.x | Unit tests |
| Playwright | 1.x | E2E tests |
| Testing Library | 14.x | Component tests |

### 6.3 Development

| Tool | Purpose |
|------|---------|
| VS Code | IDE |
| Supabase CLI | Local development |
| Vercel CLI | Deployment |

---

## 7. Package.json (Estimated)

```json
{
  "name": "mini-game-heaven",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "phaser": "^3.80.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.5.0",
    "next-pwa": "^5.6.0",
    "web-push": "^3.6.0",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "prettier": "^3.2.0",
    "vitest": "^1.2.0",
    "@playwright/test": "^1.41.0"
  }
}
```

---

## 8. Environment Variables

```bash
# .env.local
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BG...
VAPID_PRIVATE_KEY=...

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXX
```

---

## 9. Version Pinning Strategy

| Category | Strategy |
|----------|----------|
| Major dependencies | Pin minor version (^14.1.0) |
| Phaser | Pin exact (3.80.0) |
| Dev tools | Pin minor |
| Security patches | Auto-update |

---

## 10. Migration Paths

If scale requires changes:

| Scenario | Migration Path |
|----------|---------------|
| Supabase limits hit | Self-hosted PostgreSQL + PgBouncer |
| Realtime at scale | Add Redis sorted sets |
| Global latency | Vercel Edge + regional DB |
| Complex auth | Auth0 or Clerk |

---

*End of Technology Stack Document*
