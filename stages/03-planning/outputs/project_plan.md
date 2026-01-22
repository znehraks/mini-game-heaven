# Project Plan: Mini-Game Heaven

> Generated: 2026-01-22
> Stage: 03-planning
> AI Model: Claude (Strategic Architect Persona)

---

## Executive Summary

This document outlines the development plan for Mini-Game Heaven MVP. The project follows a 6-week timeline with 3 major milestones, targeting a public beta launch at the end of Week 6.

---

## 1. Project Overview

| Attribute | Value |
|-----------|-------|
| **Project Name** | Mini-Game Heaven |
| **Target** | Korean teenagers (10대) |
| **MVP Scope** | 3 games, leaderboard, PWA |
| **Total Duration** | 6 weeks |
| **Development Mode** | Solo developer |
| **Work Hours** | 3-4 hours/day |

---

## 2. Milestones

### Milestone 1: Foundation Complete (Week 2)
**Deliverables**:
- Project setup with full tech stack
- First game (Neon Tower Stack) playable
- Basic UI shell with navigation
- Supabase database configured

**Success Criteria**:
- [ ] Next.js app runs locally
- [ ] Phaser game renders and plays
- [ ] Database tables created
- [ ] Basic score saving works

### Milestone 2: Core Features Complete (Week 4)
**Deliverables**:
- All 3 MVP games playable
- Leaderboard system working
- Discord authentication integrated
- PWA installable

**Success Criteria**:
- [ ] All games have score submission
- [ ] Realtime leaderboard updates
- [ ] Users can sign in with Discord
- [ ] App installs on mobile

### Milestone 3: MVP Launch (Week 6)
**Deliverables**:
- Push notification system
- Nemesis feature working
- UI polish and animations
- Performance optimized
- Public beta launched

**Success Criteria**:
- [ ] Push notifications received
- [ ] Lighthouse score > 90
- [ ] Load time < 3 seconds
- [ ] 10+ beta testers recruited

---

## 3. Sprint Plan

### Sprint 1: Setup & Game 1 (Week 1-2)

#### Week 1: Project Foundation
| Day | Tasks | Hours |
|-----|-------|-------|
| 1 | Initialize Next.js 14 project with TypeScript | 3 |
| 2 | Configure Tailwind CSS, set up design tokens | 3 |
| 3 | Set up Supabase project, create database schema | 4 |
| 4 | Configure ESLint, Prettier, Husky | 2 |
| 5 | Create basic layout components (Header, Footer, Nav) | 3 |
| 6 | Set up Zustand stores, TanStack Query provider | 3 |
| 7 | Buffer / Review | 2 |

**Week 1 Total**: ~20 hours

#### Week 2: First Game
| Day | Tasks | Hours |
|-----|-------|-------|
| 1 | Integrate Phaser with Next.js (dynamic import) | 4 |
| 2 | Create GameLoader component, loading states | 3 |
| 3 | Develop Neon Tower Stack - core mechanics | 4 |
| 4 | Develop Neon Tower Stack - scoring, game over | 4 |
| 5 | Add score submission to Supabase | 3 |
| 6 | Create game selection page (home) | 3 |
| 7 | **Milestone 1 Review** | 2 |

**Week 2 Total**: ~23 hours

---

### Sprint 2: Games & Leaderboard (Week 3-4)

#### Week 3: Games 2-3
| Day | Tasks | Hours |
|-----|-------|-------|
| 1 | Develop Gravity Switcher - core mechanics | 4 |
| 2 | Develop Gravity Switcher - scoring, polish | 3 |
| 3 | Develop Color Rush - core mechanics | 3 |
| 4 | Develop Color Rush - scoring, polish | 3 |
| 5 | Create game thumbnail assets | 2 |
| 6 | Implement game preview cards | 3 |
| 7 | Buffer / Bug fixes | 2 |

**Week 3 Total**: ~20 hours

#### Week 4: Auth & Leaderboard
| Day | Tasks | Hours |
|-----|-------|-------|
| 1 | Configure Discord OAuth in Supabase | 2 |
| 2 | Implement auth flow (login/logout) | 4 |
| 3 | Create user profile component | 3 |
| 4 | Build leaderboard UI (per-game, global) | 4 |
| 5 | Implement Supabase Realtime subscriptions | 3 |
| 6 | Configure PWA (manifest, service worker) | 3 |
| 7 | **Milestone 2 Review** | 2 |

**Week 4 Total**: ~21 hours

---

### Sprint 3: Polish & Launch (Week 5-6)

#### Week 5: Push & Nemesis
| Day | Tasks | Hours |
|-----|-------|-------|
| 1 | Set up VAPID keys, web-push server | 3 |
| 2 | Implement push subscription flow | 4 |
| 3 | Create notification permission UI | 2 |
| 4 | Implement Nemesis detection (Edge Function) | 4 |
| 5 | Send Nemesis push notifications | 3 |
| 6 | Test push on multiple devices | 2 |
| 7 | Buffer / Debug | 2 |

**Week 5 Total**: ~20 hours

#### Week 6: Launch Prep
| Day | Tasks | Hours |
|-----|-------|-------|
| 1 | UI polish - animations, transitions | 4 |
| 2 | Mobile responsiveness fixes | 3 |
| 3 | Performance optimization (lazy load, cache) | 3 |
| 4 | Lighthouse audit and fixes | 3 |
| 5 | Soft launch to friends (10 users) | 2 |
| 6 | Bug fixes from feedback | 3 |
| 7 | **Public Beta Launch** | 2 |

**Week 6 Total**: ~20 hours

---

## 4. Total Effort Summary

| Sprint | Duration | Hours | Focus |
|--------|----------|-------|-------|
| Sprint 1 | Week 1-2 | 43 | Setup + Game 1 |
| Sprint 2 | Week 3-4 | 41 | Games + Auth + Leaderboard |
| Sprint 3 | Week 5-6 | 40 | Push + Polish + Launch |
| **Total** | **6 weeks** | **~124 hours** | |

At 3-4 hours/day: **Achievable within timeline**

---

## 5. Risk Mitigation Plan

### High-Risk Items

| Risk | Probability | Mitigation |
|------|-------------|------------|
| Phaser SSR conflicts | HIGH | Use dynamic imports, test early |
| Game development delays | MEDIUM | Start with simplest game, scope down if needed |
| Push notification issues | MEDIUM | Test on multiple browsers early |

### Contingency Plans

**If behind schedule by Week 3**:
- Reduce Game 3 (Color Rush) to barebones
- Defer Nemesis feature to post-MVP
- Simplify UI animations

**If blocking technical issue**:
- Allocate 1 full day for deep debugging
- Consider alternative approach (documented in tech_stack.md)
- Seek community help (Discord, Stack Overflow)

---

## 6. Definition of Done

### Per Task
- [ ] Code written and tested locally
- [ ] No TypeScript errors
- [ ] Responsive on mobile
- [ ] Committed with meaningful message

### Per Sprint
- [ ] All sprint tasks completed
- [ ] No critical bugs
- [ ] Milestone criteria met
- [ ] HANDOFF updated (if stage change)

### Per Milestone
- [ ] All features functional
- [ ] Code reviewed (self-review checklist)
- [ ] Performance acceptable
- [ ] Documented in outputs/

---

## 7. Dependencies & Blockers

### External Dependencies
| Dependency | Impact | Status |
|------------|--------|--------|
| Supabase account | HIGH | To create |
| Vercel account | HIGH | To create |
| Discord Developer App | MEDIUM | To create |
| VAPID keys | MEDIUM | To generate |

### Potential Blockers
| Blocker | Resolution |
|---------|------------|
| Supabase free tier limits | Monitor usage, upgrade if needed |
| Vercel build limits | Use incremental builds |
| Discord OAuth approval | Apply early, have email auth backup |

---

## 8. Success Metrics

### MVP Launch Targets (Week 6)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Games playable | 3 | Manual test |
| Load time | < 3s | Lighthouse |
| Lighthouse Performance | > 90 | Lighthouse |
| PWA installable | Yes | Chrome DevTools |
| Push works | Yes | Manual test |
| Beta testers | 10+ | Analytics |

### Week 8 Targets (Post-Launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| DAU | 100+ | Supabase |
| Session duration | > 3 min | Analytics |
| Return rate | > 30% | Analytics |
| Crash rate | < 1% | Error tracking |

---

## 9. Communication Plan

### Progress Tracking
- Daily: Update personal task list
- Weekly: Sprint review (self)
- Milestone: Comprehensive review document

### Documentation
- Code: JSDoc for complex functions
- Architecture: Keep architecture.md updated
- Decisions: Log in HANDOFF.md

---

## 10. Post-MVP Roadmap

### Phase 2 (Week 7-10): Growth
- Add 2 more games
- Implement ad integration (AdSense)
- Add social sharing features
- Korean localization polish

### Phase 3 (Week 11-14): Engagement
- Daily/weekly challenges
- Achievement system
- User-generated content (custom games?)
- Community features

### Phase 4 (Month 4+): Scale
- Performance optimization for scale
- Additional auth providers (Kakao)
- Premium features consideration
- Analytics deep dive

---

## 11. Stage Completion Checklist

For Stage 03-Planning to be complete:

- [x] System architecture designed (architecture.md)
- [x] Technology stack finalized (tech_stack.md)
- [x] Project plan established (this document)
- [x] 3+ milestones defined
- [ ] Implementation rules defined (implementation.yaml)
- [ ] HANDOFF.md generated

---

*End of Project Plan Document*
