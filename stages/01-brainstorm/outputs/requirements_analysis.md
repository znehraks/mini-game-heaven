# Requirements Analysis: Mini-Game Heaven

> Generated: 2026-01-22
> AI Model: ClaudeCode (Systems Analyst)
> Stage: 01-brainstorm
> Based on: ideas.md, project_brief.md

---

## 1. Functional Requirements

### 1.1 User Management

| ID | Requirement | Priority | Complexity | Dependencies |
|----|-------------|----------|------------|--------------|
| UM-01 | Guest play without login | Must Have | Low | None |
| UM-02 | Discord OAuth authentication | Should Have | Medium | Discord API |
| UM-03 | User profile with play history | Should Have | Medium | UM-02 |
| UM-04 | Nickname system for leaderboards | Must Have | Low | None |
| UM-05 | Avatar/profile customization | Nice to Have | Low | UM-03 |

### 1.2 Core Gaming Features

| ID | Requirement | Priority | Complexity | Dependencies |
|----|-------------|----------|------------|--------------|
| GF-01 | Implement 3-5 mini games for MVP | Must Have | High | None |
| GF-02 | Single-tap/hold control scheme | Must Have | Medium | GF-01 |
| GF-03 | Progressive difficulty system | Must Have | Medium | GF-01 |
| GF-04 | Score tracking per game session | Must Have | Low | GF-01 |
| GF-05 | Game pause/resume functionality | Should Have | Low | GF-01 |
| GF-06 | Sound effects and background music | Should Have | Medium | GF-01 |
| GF-07 | Mute toggle (default: sound off) | Must Have | Low | GF-06 |

### 1.3 Leaderboard & Competition

| ID | Requirement | Priority | Complexity | Dependencies |
|----|-------------|----------|------------|--------------|
| LB-01 | Global leaderboard per game | Must Have | Medium | Supabase |
| LB-02 | Daily/Weekly/All-time views | Should Have | Low | LB-01 |
| LB-03 | Personal best tracking | Must Have | Low | LB-01 |
| LB-04 | "Nemesis" notification system | Should Have | Medium | LB-01, PWA |
| LB-05 | Share score to social media | Should Have | Low | LB-01 |
| LB-06 | Friend leaderboard (if authenticated) | Nice to Have | Medium | UM-02, LB-01 |

### 1.4 Monetization

| ID | Requirement | Priority | Complexity | Dependencies |
|----|-------------|----------|------------|--------------|
| MN-01 | Interstitial ad display between games | Must Have | Low | Ad SDK |
| MN-02 | "Second Chance" rewarded video ad | Should Have | Medium | Ad SDK, GF-01 |
| MN-03 | Ad frequency capping (max 1 per 2 min) | Must Have | Low | MN-01 |
| MN-04 | Premium ad-free mode (future) | Nice to Have | Medium | Payment |

### 1.5 Engagement & Retention

| ID | Requirement | Priority | Complexity | Dependencies |
|----|-------------|----------|------------|--------------|
| EN-01 | PWA installability | Must Have | Medium | Next.js PWA |
| EN-02 | Push notifications for rank changes | Should Have | High | PWA, Supabase |
| EN-03 | Daily login rewards | Should Have | Low | UM-02 |
| EN-04 | Cross-game point system | Nice to Have | Medium | GF-01 |
| EN-05 | Global skin shop | Nice to Have | High | EN-04 |

### 1.6 Data Management

| ID | Requirement | Priority | Complexity | Dependencies |
|----|-------------|----------|------------|--------------|
| DM-01 | Real-time leaderboard updates | Must Have | Medium | Supabase Realtime |
| DM-02 | Score anti-cheat validation | Must Have | High | Server-side |
| DM-03 | Game analytics tracking | Should Have | Medium | Analytics SDK |
| DM-04 | User session logging | Should Have | Low | Supabase |

---

## 2. Non-Functional Requirements

### 2.1 Performance
| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Initial page load | < 2 seconds | Teens have low patience |
| Game start time | < 500ms | "Instant play" feel |
| Input latency | < 16ms (60fps) | Precision gaming requires responsiveness |
| API response time | < 200ms | Leaderboard updates feel instant |

### 2.2 Scalability
| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Concurrent users | 1,000+ at launch | Viral potential |
| Database connections | Supabase free tier initially | Budget constraint |
| CDN for assets | Required | Global audience |

### 2.3 Security
| Requirement | Implementation |
|-------------|----------------|
| Score validation | Server-side verification, pattern detection |
| Rate limiting | API rate limits to prevent abuse |
| Data privacy | GDPR-compliant, minimal data collection |
| Auth security | OAuth 2.0 via Discord/Supabase Auth |

### 2.4 Availability
| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% |
| Graceful degradation | Games playable offline (PWA cache) |
| Error handling | User-friendly error messages |

### 2.5 Usability
| Requirement | Implementation |
|-------------|----------------|
| Mobile-first design | Touch-optimized, one-handed play |
| No tutorial needed | "Understand in 3 seconds" |
| Accessibility | High contrast mode, colorblind support |
| Internationalization | Korean primary, English secondary |

---

## 3. Constraints

### 3.1 Technical Constraints
- **Framework**: Next.js 14+ (App Router)
- **Backend**: Supabase (PostgreSQL, Realtime, Auth)
- **Hosting**: Vercel (optimal for Next.js)
- **PWA**: next-pwa or similar

### 3.2 Business Constraints
- **Budget**: Minimal (free tier services initially)
- **Timeline**: Not specified (assume MVP in 4-6 weeks)
- **Team**: Solo developer assumed

### 3.3 Regulatory Constraints
- **Age**: Target is teenagers - avoid collecting personal data
- **Ads**: COPPA compliance if targeting under 13
- **Korea-specific**: Game rating may be required for certain scales

---

## 4. Assumptions

| # | Assumption | Risk if Invalid |
|---|------------|-----------------|
| 1 | Users have stable internet | Need robust offline mode |
| 2 | Discord is popular among target users | May need alternative auth |
| 3 | Supabase free tier sufficient for launch | May need early monetization |
| 4 | One-tap games are sufficiently engaging | May need more complex games |
| 5 | Ad revenue model is viable | May need alternative monetization |

---

## 5. MVP Scope Proposal

### Must Have (Phase 1 - Week 1-4)
- [ ] 3 playable mini games (Neon Tower Stack, Gravity Switcher, Color Rush)
- [ ] Global leaderboard per game
- [ ] Guest play with nickname
- [ ] PWA support with offline capability
- [ ] Basic interstitial ads
- [ ] Mobile-responsive design
- [ ] Score anti-cheat (basic)

### Should Have (Phase 2 - Week 5-8)
- [ ] 2 additional games (Orbit Defender, Perfect Pour)
- [ ] Discord authentication
- [ ] Push notifications for rank changes
- [ ] "Second Chance" ad-revive
- [ ] Daily/Weekly leaderboard views
- [ ] Social share buttons

### Nice to Have (Phase 3 - Future)
- [ ] 5 more games (complete 10-game catalog)
- [ ] Ghost replay feature
- [ ] Cross-game point system
- [ ] Global skin shop
- [ ] Daily quests
- [ ] Battle Royale mode
- [ ] School vs School competition

---

## 6. Risk Identification

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Low user retention | High | Medium | Focus on nemesis notifications, social features |
| Ad blockers | High | High | Rewarded ads are optional; core game is ad-supported |
| Score cheating | Medium | High | Server-side validation, pattern detection |
| Performance issues on low-end devices | High | Medium | Canvas optimization, progressive enhancement |
| Supabase rate limits | Medium | Low | Implement caching, batch updates |
| Competition from established players | Medium | Medium | Focus on aesthetic differentiation, Korean market |

---

## 7. Technical Architecture (Preliminary)

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Next.js   │  │   Canvas    │  │    PWA      │         │
│  │   App       │  │   Games     │  │   Service   │         │
│  │   Router    │  │   Engine    │  │   Worker    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Supabase                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Auth     │  │  Database   │  │  Realtime   │         │
│  │   (Discord) │  │ (PostgreSQL)│  │  (Scores)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Google    │  │   Discord   │  │   Vercel    │         │
│  │   AdMob     │  │    API      │  │   Analytics │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Users (DAU) | 500+ at week 4 | Supabase/Analytics |
| Average Session Duration | > 5 minutes | Analytics |
| Return Rate (D1) | > 30% | Analytics |
| Ad Impressions per User | > 3 per session | Ad SDK |
| PWA Installs | > 10% of users | PWA analytics |

---

*End of Requirements Analysis*
