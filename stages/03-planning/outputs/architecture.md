# System Architecture: Mini-Game Heaven

> Generated: 2026-01-22
> Stage: 03-planning
> AI Model: Claude (Strategic Architect Persona)

---

## 1. System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SYSTEMS                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   Discord    │    │   Google     │    │    PWA       │              │
│  │    OAuth     │    │   AdSense    │    │   Browser    │              │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘              │
│         │                   │                   │                       │
└─────────┼───────────────────┼───────────────────┼───────────────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        MINI-GAME-HEAVEN                                  │
│                                                                          │
│    ┌─────────────────────────────────────────────────────────────┐      │
│    │                     Next.js Application                      │      │
│    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │      │
│    │  │   Games     │  │    UI       │  │    API      │         │      │
│    │  │  (Phaser)   │  │ Components  │  │   Routes    │         │      │
│    │  └─────────────┘  └─────────────┘  └─────────────┘         │      │
│    └─────────────────────────────────────────────────────────────┘      │
│                               │                                          │
│                               ▼                                          │
│    ┌─────────────────────────────────────────────────────────────┐      │
│    │                        Supabase                              │      │
│    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │      │
│    │  │   Auth   │  │ Database │  │ Realtime │  │  Storage │   │      │
│    │  │(Discord) │  │(Postgres)│  │(WebSocket)│  │ (Assets) │   │      │
│    │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │      │
│    └─────────────────────────────────────────────────────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              USERS                                       │
├─────────────────────────────────────────────────────────────────────────┤
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│   │   Mobile     │    │   Desktop    │    │    PWA       │              │
│   │   Browser    │    │   Browser    │    │  Installed   │              │
│   └──────────────┘    └──────────────┘    └──────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Container Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MINI-GAME-HEAVEN                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    FRONTEND (Vercel Edge)                       │     │
│  ├────────────────────────────────────────────────────────────────┤     │
│  │                                                                 │     │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ │     │
│  │  │   App Shell     │  │   Game Engine   │  │  Service       │ │     │
│  │  │   (Next.js)     │  │   (Phaser 3)    │  │  Worker        │ │     │
│  │  │                 │  │                 │  │  (PWA)         │ │     │
│  │  │  - App Router   │  │  - Scene Mgmt   │  │                │ │     │
│  │  │  - SSR/SSG      │  │  - Physics      │  │  - Caching     │ │     │
│  │  │  - API Routes   │  │  - Input        │  │  - Push        │ │     │
│  │  │  - Middleware   │  │  - Audio        │  │  - Offline     │ │     │
│  │  └─────────────────┘  └─────────────────┘  └────────────────┘ │     │
│  │           │                    │                    │          │     │
│  │           └────────────────────┼────────────────────┘          │     │
│  │                                │                               │     │
│  │                                ▼                               │     │
│  │  ┌──────────────────────────────────────────────────────────┐ │     │
│  │  │                    State Management                       │ │     │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │     │
│  │  │  │   Zustand    │  │  React Query │  │  Local       │   │ │     │
│  │  │  │  (UI State)  │  │ (Server State│  │  Storage     │   │ │     │
│  │  │  │              │  │  + Realtime) │  │  (Guest)     │   │ │     │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │     │
│  │  └──────────────────────────────────────────────────────────┘ │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                   │                                      │
│                                   │ HTTPS / WebSocket                   │
│                                   ▼                                      │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                     BACKEND (Supabase)                          │     │
│  ├────────────────────────────────────────────────────────────────┤     │
│  │                                                                 │     │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │     │
│  │  │     Auth      │  │   Database    │  │   Realtime    │      │     │
│  │  │               │  │               │  │               │      │     │
│  │  │  - Discord    │  │  - users      │  │  - scores     │      │     │
│  │  │  - Anonymous  │  │  - scores     │  │  - presence   │      │     │
│  │  │  - Sessions   │  │  - games      │  │  - broadcast  │      │     │
│  │  └───────────────┘  └───────────────┘  └───────────────┘      │     │
│  │                                                                 │     │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │     │
│  │  │ Edge Functions│  │   Storage     │  │     RLS       │      │     │
│  │  │               │  │               │  │               │      │     │
│  │  │  - Validate   │  │  - Avatars    │  │  - Row Level  │      │     │
│  │  │    Score      │  │  - Assets     │  │    Security   │      │     │
│  │  │  - Push       │  │               │  │               │      │     │
│  │  └───────────────┘  └───────────────┘  └───────────────┘      │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          NEXT.JS APPLICATION                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  app/                                                                    │
│  ├── (routes)/                                                          │
│  │   ├── page.tsx ─────────────────┐                                    │
│  │   │                             │                                    │
│  │   ├── game/[id]/page.tsx ──────┼──┐                                 │
│  │   │                             │  │                                 │
│  │   └── leaderboard/page.tsx ────┼──┼──┐                              │
│  │                                 │  │  │                              │
│  └── layout.tsx                    │  │  │                              │
│         │                          │  │  │                              │
│         ▼                          ▼  ▼  ▼                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         COMPONENTS                               │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │   Layout     │  │  GameCard    │  │ Leaderboard  │          │   │
│  │  │  Components  │  │  Component   │  │  Component   │          │   │
│  │  │              │  │              │  │              │          │   │
│  │  │  - Header    │  │  - Thumbnail │  │  - Table     │          │   │
│  │  │  - Footer    │  │  - Title     │  │  - Row       │          │   │
│  │  │  - Nav       │  │  - PlayBtn   │  │  - Filters   │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │                    GAME COMPONENTS                        │  │   │
│  │  ├──────────────────────────────────────────────────────────┤  │   │
│  │  │                                                           │  │   │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │   │
│  │  │  │ GameLoader │  │ GameCanvas │  │ GameUI     │         │  │   │
│  │  │  │            │  │  (Phaser)  │  │            │         │  │   │
│  │  │  │ - Dynamic  │  │            │  │ - Score    │         │  │   │
│  │  │  │   Import   │  │ - Scenes   │  │ - Timer    │         │  │   │
│  │  │  │ - Loading  │  │ - Sprites  │  │ - Controls │         │  │   │
│  │  │  └────────────┘  └────────────┘  └────────────┘         │  │   │
│  │  │                                                           │  │   │
│  │  │  ┌────────────────────────────────────────────────────┐ │  │   │
│  │  │  │              INDIVIDUAL GAMES                       │ │  │   │
│  │  │  │                                                     │ │  │   │
│  │  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │ │  │   │
│  │  │  │  │  Neon    │ │ Gravity  │ │  Color   │           │ │  │   │
│  │  │  │  │  Tower   │ │ Switcher │ │  Rush    │           │ │  │   │
│  │  │  │  │  Stack   │ │          │ │          │           │ │  │   │
│  │  │  │  └──────────┘ └──────────┘ └──────────┘           │ │  │   │
│  │  │  └────────────────────────────────────────────────────┘ │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                           HOOKS                                  │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  useAuth    useGame    useLeaderboard    usePush    useSound    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                            LIB                                   │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  supabase/client    phaser/config    push/subscribe    utils    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema (ERD)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────┐         ┌─────────────────────┐               │
│  │       users         │         │       games         │               │
│  ├─────────────────────┤         ├─────────────────────┤               │
│  │ id          UUID PK │         │ id          TEXT PK │               │
│  │ discord_id  TEXT    │         │ name        TEXT    │               │
│  │ nickname    TEXT    │         │ description TEXT    │               │
│  │ avatar_url  TEXT    │         │ thumbnail   TEXT    │               │
│  │ created_at  TIMESTZ │         │ max_score   INT     │               │
│  │ updated_at  TIMESTZ │         │ config      JSONB   │               │
│  │ settings    JSONB   │         │ created_at  TIMESTZ │               │
│  └──────────┬──────────┘         └──────────┬──────────┘               │
│             │                               │                           │
│             │ 1                             │ 1                         │
│             │                               │                           │
│             ▼ N                             ▼ N                         │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │                        scores                            │           │
│  ├─────────────────────────────────────────────────────────┤           │
│  │ id              UUID PK                                  │           │
│  │ user_id         UUID FK → users.id (nullable for guest) │           │
│  │ game_id         TEXT FK → games.id                       │           │
│  │ nickname        TEXT (for guest players)                 │           │
│  │ score           INTEGER                                  │           │
│  │ duration_ms     INTEGER                                  │           │
│  │ metadata        JSONB (gameplay data for validation)     │           │
│  │ created_at      TIMESTAMPTZ                              │           │
│  │ validated       BOOLEAN DEFAULT false                    │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │                   push_subscriptions                     │           │
│  ├─────────────────────────────────────────────────────────┤           │
│  │ id              UUID PK                                  │           │
│  │ user_id         UUID FK → users.id (nullable)           │           │
│  │ endpoint        TEXT                                     │           │
│  │ p256dh          TEXT                                     │           │
│  │ auth            TEXT                                     │           │
│  │ created_at      TIMESTAMPTZ                              │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_id TEXT UNIQUE,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Games table
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  max_score INTEGER DEFAULT 999999,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  game_id TEXT REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  duration_ms INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  validated BOOLEAN DEFAULT false
);

-- Push subscriptions table
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scores_game_score ON scores(game_id, score DESC);
CREATE INDEX idx_scores_user ON scores(user_id);
CREATE INDEX idx_scores_created ON scores(created_at DESC);
CREATE INDEX idx_push_user ON push_subscriptions(user_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read scores" ON scores
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Anyone can insert scores" ON scores
  FOR INSERT TO authenticated, anon WITH CHECK (true);

CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);
```

---

## 5. Sequence Diagrams

### 5.1 Game Play Flow

```
┌──────┐    ┌──────────┐    ┌────────┐    ┌─────────┐    ┌──────────┐
│ User │    │ Browser  │    │ Phaser │    │ Next.js │    │ Supabase │
└──┬───┘    └────┬─────┘    └───┬────┘    └────┬────┘    └────┬─────┘
   │             │              │              │              │
   │ Click Game  │              │              │              │
   │────────────>│              │              │              │
   │             │              │              │              │
   │             │ Load Page    │              │              │
   │             │─────────────────────────────>│              │
   │             │              │              │              │
   │             │ HTML + Assets│              │              │
   │             │<─────────────────────────────│              │
   │             │              │              │              │
   │             │ Initialize   │              │              │
   │             │─────────────>│              │              │
   │             │              │              │              │
   │             │ Game Ready   │              │              │
   │             │<─────────────│              │              │
   │             │              │              │              │
   │ Play Game   │              │              │              │
   │────────────>│─────────────>│              │              │
   │             │              │              │              │
   │ Game Over   │              │              │              │
   │<────────────│<─────────────│              │              │
   │             │              │              │              │
   │             │ Submit Score │              │              │
   │             │─────────────────────────────>│              │
   │             │              │              │              │
   │             │              │     Validate │              │
   │             │              │     & Insert │              │
   │             │              │              │─────────────>│
   │             │              │              │              │
   │             │              │              │    Success   │
   │             │              │              │<─────────────│
   │             │              │              │              │
   │             │ Updated Rank │              │              │
   │             │<─────────────────────────────│              │
   │             │              │              │              │
   │ Show Result │              │              │              │
   │<────────────│              │              │              │
   │             │              │              │              │
```

### 5.2 Nemesis Notification Flow

```
┌──────────┐    ┌─────────┐    ┌──────────────┐    ┌────────────┐
│ Player A │    │Supabase │    │ Edge Function│    │  Player B  │
│ (beats B)│    │         │    │              │    │ (notified) │
└────┬─────┘    └────┬────┘    └──────┬───────┘    └─────┬──────┘
     │               │                │                   │
     │ Submit Score  │                │                   │
     │──────────────>│                │                   │
     │               │                │                   │
     │               │ INSERT score   │                   │
     │               │                │                   │
     │               │ Trigger        │                   │
     │               │───────────────>│                   │
     │               │                │                   │
     │               │                │ Query: Who was    │
     │               │                │ overtaken?        │
     │               │<───────────────│                   │
     │               │                │                   │
     │               │ Player B's     │                   │
     │               │ subscription   │                   │
     │               │───────────────>│                   │
     │               │                │                   │
     │               │                │ Send Push         │
     │               │                │ "A stole your     │
     │               │                │  rank!"           │
     │               │                │──────────────────>│
     │               │                │                   │
     │               │                │                   │ Notification
     │               │                │                   │ Displayed
     │               │                │                   │
```

---

## 6. Folder Structure

```
mini-game-heaven/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Route groups
│   │   ├── page.tsx             # Home page
│   │   ├── game/
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Game page
│   │   ├── leaderboard/
│   │   │   └── page.tsx         # Global leaderboard
│   │   └── profile/
│   │       └── page.tsx         # User profile
│   ├── api/                      # API routes
│   │   ├── scores/
│   │   │   └── route.ts         # Score submission
│   │   └── push/
│   │       ├── subscribe/
│   │       │   └── route.ts     # Push subscribe
│   │       └── send/
│   │           └── route.ts     # Send notification
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── manifest.ts              # PWA manifest
│
├── components/                   # Shared components
│   ├── ui/                      # UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Nav.tsx
│   ├── game/                    # Game-related
│   │   ├── GameLoader.tsx       # Dynamic loader
│   │   ├── GameCanvas.tsx       # Phaser wrapper
│   │   └── GameUI.tsx           # Overlay UI
│   └── leaderboard/             # Leaderboard
│       ├── LeaderboardTable.tsx
│       └── LeaderboardRow.tsx
│
├── games/                        # Phaser games
│   ├── shared/                  # Shared game utilities
│   │   ├── BaseScene.ts
│   │   └── utils.ts
│   ├── neon-tower-stack/
│   │   ├── index.ts
│   │   ├── scenes/
│   │   │   ├── BootScene.ts
│   │   │   ├── GameScene.ts
│   │   │   └── GameOverScene.ts
│   │   └── config.ts
│   ├── gravity-switcher/
│   │   └── ...
│   └── color-rush/
│       └── ...
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useGame.ts
│   ├── useLeaderboard.ts
│   ├── usePush.ts
│   └── useSound.ts
│
├── lib/                          # Utilities
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   └── types.ts             # Database types
│   ├── phaser/
│   │   └── config.ts            # Phaser config
│   └── push/
│       └── subscribe.ts         # Push utilities
│
├── stores/                       # Zustand stores
│   ├── gameStore.ts
│   └── uiStore.ts
│
├── types/                        # TypeScript types
│   ├── game.ts
│   ├── user.ts
│   └── score.ts
│
├── public/                       # Static assets
│   ├── games/                   # Game assets
│   │   ├── neon-tower-stack/
│   │   ├── gravity-switcher/
│   │   └── color-rush/
│   ├── icons/                   # PWA icons
│   └── sounds/                  # Sound effects
│
├── workers/                      # Service workers
│   └── sw.ts                    # PWA service worker
│
├── styles/                       # Global styles
│   └── theme.css                # CSS variables
│
├── config/                       # Configuration
│   └── games.ts                 # Game registry
│
└── [config files]
    ├── next.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## 7. API Design

### 7.1 REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | List all games |
| GET | `/api/games/[id]` | Get game details |
| GET | `/api/scores?game_id=X` | Get leaderboard |
| POST | `/api/scores` | Submit score |
| POST | `/api/push/subscribe` | Subscribe to push |
| DELETE | `/api/push/unsubscribe` | Unsubscribe |

### 7.2 Score Submission API

```typescript
// POST /api/scores
interface ScoreSubmission {
  game_id: string;
  score: number;
  nickname: string;
  duration_ms: number;
  metadata: {
    actions: number;
    max_combo?: number;
    checkpoints?: number[];
  };
}

interface ScoreResponse {
  success: boolean;
  rank: number;
  is_personal_best: boolean;
  overtaken_players?: string[]; // For nemesis notifications
}
```

### 7.3 Realtime Subscriptions

```typescript
// Subscribe to leaderboard changes
supabase
  .channel('leaderboard')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'scores',
      filter: `game_id=eq.${gameId}`
    },
    (payload) => handleNewScore(payload)
  )
  .subscribe();
```

---

## 8. Security Architecture

### 8.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. GUEST MODE (Default)                                     │
│     ┌──────┐                                                │
│     │ User │──▶ Enter Nickname ──▶ localStorage             │
│     └──────┘        │                                       │
│                     ▼                                       │
│              Play immediately                               │
│                                                              │
│  2. DISCORD AUTH (Optional)                                  │
│     ┌──────┐    ┌─────────┐    ┌──────────┐                │
│     │ User │──▶ │ Discord │──▶ │ Supabase │                │
│     └──────┘    │  OAuth  │    │   Auth   │                │
│                 └─────────┘    └──────────┘                │
│                      │              │                       │
│                      ▼              ▼                       │
│              Get Discord ID   Create/Update User            │
│                      │              │                       │
│                      └──────┬───────┘                       │
│                             │                               │
│                             ▼                               │
│                      JWT Session                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Score Validation

```typescript
// Server-side validation in Edge Function
function validateScore(submission: ScoreSubmission): boolean {
  const game = GAME_CONFIGS[submission.game_id];

  // Check 1: Score within bounds
  if (submission.score > game.maxPossibleScore) return false;
  if (submission.score < 0) return false;

  // Check 2: Duration makes sense
  const minDuration = game.minGameDuration;
  if (submission.duration_ms < minDuration) return false;

  // Check 3: Score-to-time ratio
  const maxScorePerSecond = game.maxScorePerSecond;
  const actualRate = submission.score / (submission.duration_ms / 1000);
  if (actualRate > maxScorePerSecond * 1.5) return false;

  // Check 4: Action count plausibility
  const actionsPerScore = submission.metadata.actions / submission.score;
  if (actionsPerScore < game.minActionsPerScore) return false;

  return true;
}
```

---

## 9. Performance Considerations

| Area | Strategy | Target |
|------|----------|--------|
| Initial Load | Code splitting, lazy loading games | < 2s FCP |
| Game Load | Preload assets, cache via PWA | < 1s |
| Leaderboard | Server-side render, Realtime updates | < 200ms |
| API Response | Edge functions, connection pooling | < 100ms |
| Bundle Size | Tree shaking, dynamic imports | < 500KB initial |

---

*End of Architecture Document*
