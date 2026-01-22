# User Flows: Mini-Game Heaven

> Generated: 2026-01-22
> Stage: 04-ui-ux
> AI Model: Claude (Structured Analysis)

---

## Overview

| Flow | Priority | User Type |
|------|----------|-----------|
| First-Time User Onboarding | HIGH | New |
| Play Game & Submit Score | HIGH | All |
| Nemesis Notification Loop | HIGH | Returning |
| View Leaderboard | MEDIUM | All |
| Authentication Flow | MEDIUM | New/Returning |
| Push Notification Opt-in | MEDIUM | Authenticated |

---

## 1. First-Time User Onboarding

**Goal**: Get user playing within 30 seconds
**Entry**: App launch (first visit)

### Flow Diagram

```mermaid
flowchart TD
    A[App Launch] --> B{First Visit?}
    B -->|Yes| C[Splash Screen<br/>2 seconds]
    B -->|No| H[Home Screen]

    C --> D[Login Screen]
    D --> E{User Choice}

    E -->|Discord| F[Discord OAuth]
    E -->|Guest| G[Set Nickname]

    F --> F1{Auth Success?}
    F1 -->|Yes| H[Home Screen]
    F1 -->|No| D

    G --> H

    H --> I[Featured Game<br/>Highlight]
    I --> J[Tap to Play]
    J --> K[Game Page]
    K --> L[Tutorial Overlay<br/>First game only]
    L --> M[Start Playing!]
```

### Step-by-Step

| Step | Screen | Action | Duration |
|------|--------|--------|----------|
| 1 | Splash | Auto-advance | 2s |
| 2 | Login | Tap "Guest" or "Discord" | User action |
| 3 | Home | View featured game | - |
| 4 | Home | Tap game card | User action |
| 5 | Game | See tutorial overlay | 3s |
| 6 | Game | Start playing | - |

### Key Metrics
- **Time to first game**: < 30 seconds (guest)
- **Conversion to Discord login**: Track percentage

---

## 2. Play Game & Submit Score (Core Loop)

**Goal**: Engaging gameplay loop with score persistence
**Entry**: Home screen → Game selection

### Flow Diagram

```mermaid
flowchart TD
    A[Home Screen] --> B[Select Game]
    B --> C[Game Loading]
    C --> D[Game Ready]

    D --> E[Play Game]
    E --> F{Game Over?}
    F -->|No| E
    F -->|Yes| G[Game Over Modal]

    G --> H{New High Score?}
    H -->|Yes| I[Celebration Animation]
    H -->|No| J[Show Score]

    I --> K[Score Submitted<br/>to Supabase]
    J --> K

    K --> L{User Choice}
    L -->|Retry| D
    L -->|Share| M[Share Modal]
    L -->|Leaderboard| N[Leaderboard Screen]
    L -->|Home| A

    M --> L
    N --> L
```

### States & Transitions

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Ready : assets loaded
    Ready --> Playing : user starts
    Playing --> Paused : tap pause
    Paused --> Playing : resume
    Playing --> GameOver : life = 0
    GameOver --> ScoreSubmit : auto
    ScoreSubmit --> Ready : retry
    ScoreSubmit --> [*] : exit
```

### Error Handling

| Error | User Message | Recovery |
|-------|--------------|----------|
| Score submit failed | "점수 저장 실패. 재시도..." | Auto-retry 3x, then queue for later |
| Game crash | "오류 발생. 다시 시도해주세요" | Return to home, log error |
| Network offline | "오프라인 모드. 점수는 나중에 저장됩니다" | Store locally, sync when online |

---

## 3. Nemesis Notification Loop (Retention Hook)

**Goal**: Re-engage users through competitive push notifications
**Entry**: Another user beats your score

### Flow Diagram

```mermaid
flowchart TD
    A[User A plays game] --> B[Submits high score]
    B --> C{Beat someone's<br/>high score?}

    C -->|Yes| D[Supabase Edge Function<br/>Detect nemesis]
    C -->|No| E[Normal leaderboard update]

    D --> F[Find affected user<br/>User B]
    F --> G{User B has<br/>push enabled?}

    G -->|Yes| H[Send Push Notification<br/>@UserA beat your score!]
    G -->|No| I[No notification]

    H --> J[User B receives notification]
    J --> K{User B taps?}

    K -->|Yes| L[Open App → Game Page]
    L --> M[User B plays to reclaim]
    M --> N[New high score?]
    N -->|Yes| A[Cycle repeats for User A]
    N -->|No| O[User B tries again]
    O --> M

    K -->|No| P[Notification dismissed]
```

### Push Notification Content

| Scenario | Title | Body |
|----------|-------|------|
| Score beaten | "⚔️ 네메시스 알림" | "@{username}이(가) NEON TOWER에서 당신의 기록을 깼습니다! 15,200점" |
| Reclaimed | "🏆 복수 성공!" | "당신이 NEON TOWER 1위를 되찾았습니다!" |
| Close call | "😰 위기!" | "@{username}이(가) 당신의 기록에 100점 차이로 접근 중!" |

### Notification Rules

- Max 3 notifications per user per day
- Min 1 hour between notifications for same game
- Only notify if user was previously in top 10

---

## 4. Authentication Flow

**Goal**: Seamless Discord OAuth with guest fallback
**Entry**: Login screen or profile upgrade prompt

### Flow Diagram

```mermaid
flowchart TD
    A[Login Screen] --> B{User Choice}

    B -->|Discord| C[Redirect to Discord]
    C --> D[User authorizes app]
    D --> E{Success?}

    E -->|Yes| F[Callback to /auth/callback]
    F --> G[Create/Update User in Supabase]
    G --> H[Set session cookie]
    H --> I[Redirect to Home]

    E -->|No| J[Show error toast]
    J --> A

    B -->|Guest| K[Show Nickname Input]
    K --> L[Generate guest UUID]
    L --> M[Store in localStorage]
    M --> I

    subgraph Guest Upgrade
    N[Guest plays games] --> O[Prompt: Save progress?]
    O --> P{User Choice}
    P -->|Yes| C
    P -->|Later| Q[Continue as guest]
    end
```

### Session States

```mermaid
stateDiagram-v2
    [*] --> Anonymous : first visit
    Anonymous --> Guest : set nickname
    Guest --> Authenticated : Discord login
    Authenticated --> [*] : logout
    Guest --> [*] : clear data
```

### Data Migration (Guest → Authenticated)

| Data Type | Migration Action |
|-----------|------------------|
| High scores | Merge with existing Discord user |
| Preferences | Transfer to user profile |
| Guest UUID | Archive, not deleted |

---

## 5. View Leaderboard Flow

**Goal**: Quick access to rankings with filtering
**Entry**: Bottom nav or game over modal

### Flow Diagram

```mermaid
flowchart TD
    A[Entry Point] --> B[Leaderboard Screen]
    B --> C[Load Global Rankings]

    C --> D{Filter Selection}
    D -->|Global| E[All games combined]
    D -->|Per Game| F[Select game dropdown]

    E --> G[Display Top 100]
    F --> G

    G --> H[Highlight user's rank]

    H --> I{User Action}
    I -->|Scroll| J[Infinite scroll<br/>Load more]
    I -->|Tap player| K[Player mini-profile]
    I -->|Tap game| L[Go to game page]

    J --> G
    K --> I
    L --> M[Game Page]
```

### Realtime Updates

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Supabase

    User->>App: Open leaderboard
    App->>Supabase: Subscribe to scores channel
    Supabase-->>App: Initial data

    loop Realtime
        Supabase-->>App: New score event
        App->>App: Animate rank change
        App->>User: Show "NEW" badge
    end

    User->>App: Leave screen
    App->>Supabase: Unsubscribe
```

---

## 6. Push Notification Opt-in Flow

**Goal**: Maximize push notification opt-in rate
**Timing**: After first successful game (score > 0)

### Flow Diagram

```mermaid
flowchart TD
    A[First Game Over] --> B{Authenticated?}

    B -->|No| C[Skip push prompt]
    B -->|Yes| D{Already prompted?}

    D -->|Yes| E[Skip]
    D -->|No| F[Show Push Modal]

    F --> G{User Choice}
    G -->|Enable| H[Request browser permission]
    G -->|Later| I[Set reminder for next session]

    H --> J{Permission granted?}
    J -->|Yes| K[Subscribe to push]
    K --> L[Save subscription to Supabase]
    L --> M[Show success toast]

    J -->|No| N[Show instruction modal<br/>How to enable later]

    I --> O[Show prompt again next time]
```

### Permission Request UI

| State | UI Element | Action |
|-------|------------|--------|
| Pre-prompt | Custom modal | Explain value proposition |
| Browser prompt | Native dialog | Wait for response |
| Success | Toast | "알림이 활성화되었습니다!" |
| Denied | Modal | Instructions to enable in browser settings |

---

## 7. Error States & Edge Cases

### Network Error Flow

```mermaid
flowchart TD
    A[User Action] --> B{Online?}

    B -->|Yes| C[Normal flow]
    B -->|No| D[Show offline banner]

    D --> E{Action type?}
    E -->|Read| F[Load from cache]
    E -->|Write| G[Queue for sync]

    F --> H[Display cached data]
    G --> I[Show pending indicator]

    subgraph Reconnection
    J[Network restored] --> K[Sync queued actions]
    K --> L[Update UI]
    L --> M[Hide offline banner]
    end
```

### Session Expiry Flow

```mermaid
flowchart TD
    A[API Request] --> B{Session valid?}

    B -->|Yes| C[Normal response]
    B -->|No| D[401 Unauthorized]

    D --> E[Clear local session]
    E --> F[Show toast: 세션이 만료되었습니다]
    F --> G[Redirect to login]
    G --> H[Preserve current page for redirect back]
```

---

## 8. User Journey Map

### New User (First Day)

```
Timeline: 0 ────────────────────────────────────────────────── 10 min

Actions:  [Land] → [Login] → [Browse] → [Play] → [Score] → [Share] → [Close]
              ↓                   ↓         ↓         ↓
Screens:  Splash   Home     Game Page  Game Over  Share Modal
              ↓                   ↓         ↓
Emotions: Curious  Excited   Engaged    Proud/Frustrated
              ↓                   ↓         ↓
Metrics:  Bounce   Time to   Session    Score     Viral
          Rate     1st game  Duration   Submitted Coefficient
```

### Returning User (Day 2+)

```
Timeline: 0 ────────────────────────────────────────────────── 5 min

Actions:  [Push] → [Open] → [Play] → [Beat Score] → [Close]
              ↓       ↓         ↓          ↓
Screens:  Notif   Game    Game Page   Victory
              ↓       ↓         ↓          ↓
Emotions: Competitive  Determined  Triumphant
              ↓       ↓         ↓          ↓
Metrics:  Click    DAU     Retention  Engagement
          Rate
```

---

## 9. Success Metrics by Flow

| Flow | Primary Metric | Target |
|------|----------------|--------|
| Onboarding | Time to first game | < 30s |
| Play & Score | Games per session | > 3 |
| Nemesis Loop | Push notification CTR | > 15% |
| Authentication | Guest → Auth conversion | > 20% |
| Leaderboard | Views per user/day | > 2 |
| Push Opt-in | Opt-in rate | > 40% |

---

*End of User Flows Document*
