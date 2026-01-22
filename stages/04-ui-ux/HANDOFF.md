# HANDOFF: 04-UI-UX → 05-Task-Management

> **Generated**: 2026-01-22
> **Stage**: 04-ui-ux (User Interface & Experience Design)
> **Next Stage**: 05-task-management (Task Breakdown & Sprint Planning)
> **Status**: COMPLETED

---

## Completed Tasks

- [x] Create comprehensive design system
- [x] Define color palette (neon vaporwave theme)
- [x] Define typography scale (Press Start 2P + System)
- [x] Define spacing system (4px base unit)
- [x] Define animation & motion guidelines
- [x] Create Tailwind configuration
- [x] Design wireframes for 8 screens
- [x] Create mobile-first layouts
- [x] Design desktop adaptations
- [x] Define user flows (6 core journeys)
- [x] Create Mermaid flow diagrams
- [x] Define component tokens
- [x] Document error states
- [x] Generate HANDOFF.md

---

## Key Decisions

### 1. Design System Theme
**Decision**: Vaporwave/Y2K/Retro Arcade
**Rationale**:
- Appeals to target audience (Korean teenagers)
- Distinctive visual identity vs competitors
- Neon colors work well for gaming atmosphere

### 2. Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| neon-pink | #ff00ff | Primary CTA, highlights |
| neon-cyan | #00ffff | Secondary actions, scores |
| neon-purple | #8b5cf6 | Accent, gradients |
| arcade-dark | #0a0a0f | Backgrounds |

### 3. Typography
- **Headings**: 'Press Start 2P' (pixel font)
- **Body**: System UI sans-serif
- **Scores**: Press Start 2P, large size with glow

### 4. Mobile-First Approach
**Decision**: Mobile portrait (375px) as primary viewport
**Rationale**:
- Target users primarily on mobile
- Games optimized for touch
- Desktop uses "arcade cabinet" centered layout

### 5. Navigation Pattern
**Decision**: Fixed bottom navigation (mobile) + top navigation (desktop)
**Rationale**:
- Thumb-friendly for mobile
- Consistent with mobile app patterns
- 3 main sections: Home, Leaderboard, Profile

### 6. Game Canvas Strategy
**Decision**: Responsive canvas with fixed aspect ratios (9:16, 3:4, 1:1)
**Rationale**:
- Consistent game experience across devices
- Phaser handles internal scaling
- HUD overlay in React, separate from canvas

---

## Output Files

| File | Size | Description |
|------|------|-------------|
| `outputs/design_system.md` | ~18KB | Complete design system |
| `outputs/wireframes.md` | ~15KB | ASCII wireframes for 8 screens |
| `outputs/user_flows.md` | ~12KB | 6 user flows with Mermaid diagrams |

---

## Component Summary

### UI Components to Build

| Component | Priority | Complexity |
|-----------|----------|------------|
| Button (Primary, Secondary, Ghost) | HIGH | Low |
| GameCard | HIGH | Medium |
| BottomNav | HIGH | Low |
| Header | HIGH | Low |
| Modal | HIGH | Medium |
| Toast | HIGH | Low |
| LeaderboardTable | HIGH | Medium |
| LeaderboardRow | HIGH | Low |
| GameLoader | HIGH | Medium |
| ScoreDisplay | HIGH | Low |
| UserAvatar | MEDIUM | Low |
| ProgressBar | MEDIUM | Low |
| Toggle | MEDIUM | Low |
| Input | MEDIUM | Low |
| CategoryFilter | MEDIUM | Low |

### Screen Components

| Screen | Route | Key Components |
|--------|-------|----------------|
| Login | `/login` | Logo, Discord Button |
| Home | `/` | FeaturedGame, GameGrid, BottomNav |
| Game | `/games/[id]` | GameLoader, HUD, GameOverModal |
| Leaderboard | `/leaderboard` | LeaderboardTable, GameFilter |
| Profile | `/profile` | UserStats, RecentPlays, Badges |
| Settings | Modal | SettingsForm, Toggle |

---

## Design Tokens (Tailwind)

```javascript
// tailwind.config.ts additions
{
  colors: {
    neon: { pink: '#ff00ff', cyan: '#00ffff', purple: '#8b5cf6' },
    arcade: { dark: '#0a0a0f', void: '#050508' },
    retro: { green: '#00ff00', yellow: '#ffff00', red: '#ff0000' }
  },
  fontFamily: {
    arcade: ['"Press Start 2P"', 'cursive']
  },
  boxShadow: {
    'neon-pink': '0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff',
    'neon-cyan': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff'
  }
}
```

---

## User Flows Summary

| Flow | Steps | Critical Path |
|------|-------|---------------|
| Onboarding | 6 | Login → Home → Game → Play |
| Play & Score | 8 | Game → GameOver → Retry/Share |
| Nemesis Loop | 7 | Push → Open → Play → Beat |
| Auth | 5 | Discord OAuth → Callback → Home |
| Leaderboard | 4 | Nav → View → Filter → Details |
| Push Opt-in | 5 | Prompt → Permission → Subscribe |

---

## Context for Next Stage (05-Task-Management)

### Tasks to Break Down

Based on this UI/UX stage, the implementation should cover:

1. **Project Setup**
   - Initialize Next.js 14 project
   - Configure Tailwind with design tokens
   - Set up folder structure per architecture.md

2. **Core Components**
   - Build component library (Buttons, Cards, etc.)
   - Create layout components (Header, BottomNav)
   - Implement Modal system

3. **Screens**
   - Home page with game grid
   - Game page with Phaser integration
   - Leaderboard with realtime updates
   - Profile page
   - Auth pages

4. **Game Development**
   - Neon Tower Stack
   - Gravity Switcher
   - Color Rush

5. **Backend Integration**
   - Supabase auth setup
   - Score submission API
   - Leaderboard queries
   - Realtime subscriptions

6. **PWA & Push**
   - Service worker configuration
   - Push notification system
   - Nemesis detection

### Sprint Estimation Guide

| Category | Estimated Tasks | Priority |
|----------|-----------------|----------|
| Setup | 5 | Sprint 1 |
| Components | 15 | Sprint 1-2 |
| Screens | 6 | Sprint 1-2 |
| Games | 3 | Sprint 1-2 |
| Backend | 8 | Sprint 2-3 |
| PWA | 5 | Sprint 3 |

---

## Open Questions for Task Management

1. **Component library**: Build from scratch or use shadcn/ui base?
2. **Testing priority**: Unit tests for components or E2E first?
3. **Game development order**: Easiest first (Color Rush) or flagship (Neon Tower)?
4. **Auth timing**: Before games or parallel track?

---

## AI Call Log

| AI | Time | Task | Result | Status |
|----|------|------|--------|--------|
| Gemini | 2026-01-22 | Design system generation | Tailwind config | Success |
| Gemini | 2026-01-22 | Wireframe design | ASCII wireframes | Success |
| Claude | 2026-01-22 | User flows | Mermaid diagrams | Success |
| Claude | 2026-01-22 | Documentation | HANDOFF.md | Success |

---

## Immediate Next Steps (for 05-Task-Management)

1. [ ] Break down implementation into granular tasks
2. [ ] Create task dependency graph
3. [ ] Assign tasks to sprints (3 sprints)
4. [ ] Define acceptance criteria per task
5. [ ] Create tasks.json or task board
6. [ ] Generate HANDOFF.md for implementation stage

---

## Recovery Instructions

If resuming from this handoff:
1. Read this HANDOFF.md for UI/UX context
2. Reference `outputs/design_system.md` for Tailwind config
3. Reference `outputs/wireframes.md` for screen layouts
4. Reference `outputs/user_flows.md` for interaction patterns
5. Reference `03-planning/outputs/architecture.md` for folder structure
6. Reference `03-planning/outputs/project_plan.md` for timeline
7. Begin task breakdown based on components and screens listed
8. Output to `stages/05-task-management/outputs/`

---

## Key Files to Reference

| File | Purpose |
|------|---------|
| `design_system.md` | Tailwind config, colors, typography |
| `wireframes.md` | Screen layouts, component placement |
| `user_flows.md` | Interaction sequences, error handling |
| `03-planning/architecture.md` | Folder structure, API design |
| `03-planning/tech_stack.md` | Dependencies, versions |
| `03-planning/project_plan.md` | Sprint timeline |
| `03-planning/implementation.yaml` | Coding conventions |

---

*Stage 04-ui-ux completed successfully*
