# Technical Research Report: Mini-Game Heaven

> Generated: 2026-01-22
> Stage: 02-research
> AI Model: Claude (Analytical Investigator Persona)

---

## Executive Summary

This document provides technical research findings for the mini-game-heaven project. Key recommendations:
- **Game Engine**: Phaser 3 (full framework with batteries included)
- **Backend**: Supabase (PostgreSQL + Realtime + Auth)
- **PWA**: next-pwa with web-push for notifications
- **Anti-Cheat**: Server-side validation with pattern detection

---

## 1. Game Engine Comparison

### 1.1 Options Evaluated

| Feature | Phaser 3 | PixiJS | Vanilla Canvas |
|---------|----------|--------|----------------|
| **Type** | Full Game Framework | Rendering Library | Native API |
| **Bundle Size** | ~1.2MB minified | ~450KB minified | 0KB |
| **npm Downloads** | 2M+/month | 4M+/month | N/A |
| **GitHub Stars** | 36,000+ | 43,000+ | N/A |
| **Learning Curve** | Low-Medium | Medium | High |
| **Built-in Physics** | Yes (Arcade, Matter.js) | No | No |
| **Scene Management** | Yes | No | No |
| **Audio Support** | Yes | No | Manual |
| **Input Handling** | Yes | Limited | Manual |
| **Next.js Compatibility** | Official template | Good | Good |

### 1.2 Recommendation: **Phaser 3**

**Rationale:**
1. **Batteries Included**: Built-in physics, scene management, audio, tweening, and asset pipelines
2. **Rapid Development**: Create games in days, not weeks
3. **Official Next.js Template**: `phaserjs/template-nextjs` available on GitHub
4. **Community Support**: Large community, extensive documentation, many tutorials
5. **Hyper-casual Fit**: Optimized for the type of simple, addictive games we're building

**Trade-off**: Larger bundle size (1.2MB) compared to PixiJS (450KB), but acceptable for our use case since games will be cached via PWA service worker.

### 1.3 Next.js Integration

```typescript
// Dynamic import to avoid SSR issues
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('@/components/Game'), {
  ssr: false,
  loading: () => <div>Loading game...</div>
});
```

**Key Considerations:**
- Use dynamic imports with `ssr: false` for Phaser components
- Game canvas should be client-side only
- Consider code-splitting per game for faster initial load

---

## 2. Supabase Realtime for Leaderboards

### 2.1 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Supabase   │────▶│ PostgreSQL  │
│  (Browser)  │◀────│  Realtime   │◀────│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │
     │    WebSocket       │    Postgres Changes
     │    Connection      │    Subscription
```

### 2.2 Implementation Approach

**Database Schema:**
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_leaderboard_game_score
  ON leaderboard(game_id, score DESC);
```

**Realtime Subscription:**
```typescript
const channel = supabase
  .channel('leaderboard-changes')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'leaderboard' },
    (payload) => {
      // Update UI with new score
      updateLeaderboard(payload.new);
    }
  )
  .subscribe();
```

### 2.3 Performance Considerations

| Metric | Supabase Free Tier | Notes |
|--------|-------------------|-------|
| Database Size | 500MB | Sufficient for MVP |
| Realtime Connections | 200 concurrent | May need upgrade for scale |
| API Requests | 500K/month | Monitor during growth |
| Edge Function Invocations | 500K/month | For score validation |

**Recommendation**: Start with free tier, monitor usage, upgrade to Pro ($25/month) when approaching limits.

### 2.4 Alternative: Redis Sorted Sets

For high-scale scenarios (5M+ DAU), consider:
- Redis sorted sets for O(log n) rank operations
- Supabase for persistence, Redis for real-time rankings
- Not needed for MVP, consider for Phase 3

---

## 3. PWA Push Notifications

### 3.1 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Service Worker | next-pwa | Offline caching, background sync |
| Push API | web-push | Server-to-client notifications |
| VAPID Keys | Self-generated | Authentication |
| Subscription Storage | Supabase | Store push subscriptions |

### 3.2 Implementation Flow

```
1. User visits site
   ↓
2. Service Worker registers
   ↓
3. User clicks "Enable Notifications"
   ↓
4. Browser generates push subscription
   ↓
5. Subscription saved to Supabase
   ↓
6. When rank changes detected:
   Server sends push via web-push library
   ↓
7. Service Worker receives push
   ↓
8. Notification displayed to user
```

### 3.3 Key Code Components

**Generate VAPID Keys:**
```bash
npx web-push generate-vapid-keys
```

**Server Action (Next.js):**
```typescript
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@mini-game-heaven.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendNemesisNotification(
  subscription: PushSubscription,
  nemesisName: string,
  gameName: string
) {
  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: 'Your rank was stolen!',
      body: `${nemesisName} just beat your score in ${gameName}!`,
      icon: '/icons/nemesis.png',
      data: { url: `/game/${gameName}` }
    })
  );
}
```

### 3.4 Browser Support

| Browser | Push Support | Notes |
|---------|-------------|-------|
| Chrome | Full | Primary target |
| Safari | iOS 16.4+ | Added in 2023 |
| Firefox | Full | Works well |
| Samsung Internet | Full | Important for Korea |

---

## 4. Anti-Cheat Strategies

### 4.1 The Golden Rule

> **"Never trust the client"** - All critical calculations must be validated server-side.

### 4.2 Multi-Layer Defense Strategy

| Layer | Technique | Purpose |
|-------|-----------|---------|
| **L1** | Server-side validation | Primary defense |
| **L2** | Code obfuscation | Increase reverse-engineering difficulty |
| **L3** | Gameplay pattern analysis | Detect impossible scores |
| **L4** | Rate limiting | Prevent automated attacks |
| **L5** | Encrypted payloads | Prevent simple tampering |

### 4.3 Implementation Details

**L1: Server-Side Validation (Supabase Edge Function)**
```typescript
// Score validation function
export async function validateScore(
  gameId: string,
  score: number,
  gameplayData: GameplayData
): Promise<boolean> {
  // Check 1: Is score within theoretical maximum?
  const maxPossibleScore = calculateMaxScore(gameId, gameplayData.duration);
  if (score > maxPossibleScore) return false;

  // Check 2: Does gameplay duration make sense?
  if (gameplayData.duration < MIN_GAME_DURATION) return false;

  // Check 3: Score progression pattern
  if (!isValidScoreProgression(gameplayData.scoreHistory)) return false;

  return true;
}
```

**L2: Code Obfuscation**
- Use Terser with mangle option during build
- Avoid meaningful variable names for score-related logic
- Consider JavaScript obfuscator for production builds

**L3: Pattern Detection**
- Track score-to-time ratios
- Flag statistical outliers (>3 standard deviations)
- Human review for top leaderboard positions

### 4.4 Practical Limitations

For hyper-casual browser games, accept that:
- Perfect anti-cheat is impossible client-side
- Focus on making cheating **difficult**, not impossible
- Leaderboard wipes can reset obvious cheaters
- Community reporting can help identify cheaters

---

## 5. Development Tools & Libraries

### 5.1 Recommended Stack

| Category | Tool | Version | Purpose |
|----------|------|---------|---------|
| Framework | Next.js | 14.x | App Router, Server Actions |
| Game Engine | Phaser | 3.80+ | Game rendering |
| Backend | Supabase | Latest | Database, Auth, Realtime |
| PWA | next-pwa | 5.x | Service worker, offline |
| Push | web-push | 3.x | Push notifications |
| Styling | Tailwind CSS | 3.x | UI styling |
| Animation | Framer Motion | 11.x | UI animations |
| State | Zustand | 4.x | Client state management |

### 5.2 Development Workflow

```bash
# Project setup
npx create-next-app@latest mini-game-heaven --typescript --tailwind --app
cd mini-game-heaven
npm install phaser @supabase/supabase-js next-pwa web-push zustand
```

### 5.3 Folder Structure

```
mini-game-heaven/
├── app/
│   ├── (routes)/
│   │   ├── page.tsx           # Home
│   │   ├── game/[id]/page.tsx # Game pages
│   │   └── leaderboard/       # Leaderboard pages
│   ├── api/
│   │   └── push/              # Push notification endpoints
│   └── layout.tsx
├── components/
│   ├── games/                 # Phaser game components
│   │   ├── NeonTowerStack/
│   │   ├── GravitySwitcher/
│   │   └── ColorRush/
│   └── ui/                    # Shared UI components
├── lib/
│   ├── supabase/             # Supabase client
│   ├── phaser/               # Phaser utilities
│   └── push/                 # Push notification helpers
├── public/
│   ├── games/                # Game assets
│   └── icons/                # PWA icons
└── workers/
    └── sw.js                 # Service worker
```

---

## 6. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Game Load Time | < 2s | Custom metric |
| Frame Rate | 60 FPS | Phaser debug |
| API Latency (P95) | < 200ms | Supabase dashboard |

### 6.1 Optimization Strategies

1. **Code Splitting**: Load games on-demand
2. **Asset Optimization**: Compress sprites, use WebP
3. **Caching**: Aggressive PWA caching for game assets
4. **Lazy Loading**: Defer non-critical resources
5. **CDN**: Use Vercel Edge for static assets

---

## 7. Technical Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Phaser SSR issues | High | Medium | Dynamic imports, client-only rendering |
| Supabase rate limits | Medium | High | Implement caching, batch updates |
| PWA notification failures | Medium | Medium | Fallback to in-app notifications |
| Score cheating | High | Medium | Multi-layer defense, community moderation |
| Performance on low-end devices | Medium | High | Progressive enhancement, quality settings |

---

## 8. Conclusion & Recommendations

### Immediate Actions (Week 1)
1. Set up Next.js project with Phaser template
2. Configure Supabase project (database, auth)
3. Implement basic game rendering pipeline

### Short-term (Week 2-3)
1. Implement first game (Neon Tower Stack)
2. Set up leaderboard with Realtime
3. Configure PWA basics

### Medium-term (Week 4-6)
1. Add push notifications
2. Implement anti-cheat validation
3. Deploy MVP to Vercel

---

*End of Technical Research Report*
