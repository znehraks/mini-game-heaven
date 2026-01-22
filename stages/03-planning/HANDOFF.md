# HANDOFF: 03-Planning → 04-UI-UX

> **Generated**: 2026-01-22
> **Stage**: 03-planning (System Architecture & Tech Stack Decisions)
> **Next Stage**: 04-ui-ux (User Interface & Experience Design)
> **Status**: COMPLETED

---

## Completed Tasks

- [x] Design system architecture (architecture.md)
- [x] Create system context diagram
- [x] Create container diagram
- [x] Create component diagram
- [x] Design database schema (ERD with SQL)
- [x] Define folder structure
- [x] Create sequence diagrams (game flow, nemesis notification)
- [x] Finalize technology stack (tech_stack.md)
- [x] Define all versions and dependencies
- [x] Create configuration examples
- [x] Establish project plan (project_plan.md)
- [x] Define 3 milestones
- [x] Create 6-week sprint plan
- [x] Define implementation rules (implementation.yaml)
- [x] Generate HANDOFF.md

---

## Key Decisions

### 1. Final Technology Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 14.x |
| Game Engine | Phaser | 3.80+ |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| State (Client) | Zustand | 4.x |
| State (Server) | TanStack Query | 5.x |
| Backend | Supabase | Latest |
| PWA | next-pwa | 5.x |
| Push | web-push | 3.x |
| Hosting | Vercel | Latest |

### 2. Database Schema
**Core Tables**:
- `users` - User profiles with Discord OAuth
- `games` - Game metadata and configuration
- `scores` - Player scores with validation
- `push_subscriptions` - Web push endpoints

**Key Relationships**:
- Users → Scores (one-to-many)
- Games → Scores (one-to-many)
- Users → Push Subscriptions (one-to-many)

### 3. MVP Games (Confirmed)
| Game | Description | Complexity |
|------|-------------|------------|
| Neon Tower Stack | Stack blocks, precision timing | MEDIUM |
| Gravity Switcher | Flip gravity to dodge obstacles | MEDIUM |
| Color Rush | Match colors quickly | LOW |

### 4. Project Timeline
| Milestone | Week | Deliverables |
|-----------|------|--------------|
| M1: Foundation | 2 | Setup + Game 1 |
| M2: Core Features | 4 | All games + Auth + Leaderboard |
| M3: MVP Launch | 6 | Push + Polish + Beta |

**Total Effort**: ~124 hours over 6 weeks

### 5. Folder Structure
Feature-based organization with game modules:
```
src/
├── app/           # Next.js App Router
├── components/    # UI components
├── games/         # Phaser game modules
├── hooks/         # Custom React hooks
├── lib/           # Utilities (Supabase, Phaser)
├── stores/        # Zustand stores
└── types/         # TypeScript types
```

---

## Architecture Summary

### System Context
- **Users**: Korean teenagers (10대)
- **External Systems**: Supabase, Vercel, Discord OAuth

### Container Architecture
```
[Browser] → [Next.js App] → [Supabase]
              ↓
        [Phaser Games]
```

### Component Highlights
- **GameLoader**: Dynamic import wrapper for Phaser
- **LeaderboardTable**: Realtime-connected score display
- **NemesisNotifier**: Push notification trigger

---

## Output Files

| File | Size | Description |
|------|------|-------------|
| `outputs/architecture.md` | ~20KB | Complete system architecture |
| `outputs/tech_stack.md` | ~15KB | Technology decisions & config |
| `outputs/project_plan.md` | ~10KB | Sprint plan & milestones |
| `outputs/implementation.yaml` | ~8KB | Implementation rules |

---

## Context for Next Stage (04-UI-UX)

### Design Direction Confirmed
- **Aesthetic**: Vaporwave/Y2K/Arcade
- **Colors**: Neon pink (#ff00ff), cyan (#00ffff), purple (#8b5cf6)
- **Background**: Dark arcade (#0a0a0f)
- **Font**: 'Press Start 2P' for headings

### Screens to Design
1. **Home** - Game selection grid
2. **Game Page** - Game canvas + controls
3. **Leaderboard** - Per-game and global
4. **Profile** - User stats and achievements
5. **Login** - Discord OAuth flow

### UI Components Needed
- GameCard (thumbnail, title, play button)
- LeaderboardTable (rank, avatar, name, score)
- ScoreDisplay (current score, high score)
- GameOverModal (score, share, retry)
- Toast (notifications)
- Header/Footer/Navigation

### Mobile-First Requirements
- Touch-friendly controls
- Responsive game canvas
- Bottom navigation for mobile
- PWA install prompt

### Constraints
- Phaser canvas is NOT styleable with CSS
- Game UI must be built in Phaser
- React UI wraps around game canvas
- Focus on 3:4 or 9:16 aspect ratios for mobile

---

## Open Questions for UI-UX Stage

1. **Game canvas size**: Fixed or responsive?
2. **Orientation**: Portrait-only or support landscape?
3. **Onboarding**: First-time user flow needed?
4. **Sound toggle**: Location and style?
5. **Loading states**: Skeleton or spinner?

---

## AI Call Log

| AI | Time | Task | Result | Status |
|----|------|------|--------|--------|
| Claude | 2026-01-22 | Architecture design | architecture.md | Success |
| Claude | 2026-01-22 | Tech stack finalization | tech_stack.md | Success |
| Claude | 2026-01-22 | Project planning | project_plan.md | Success |
| Claude | 2026-01-22 | Implementation rules | implementation.yaml | Success |

---

## Immediate Next Steps (for 04-UI-UX)

1. [ ] Define color palette and design tokens
2. [ ] Create wireframes for all screens
3. [ ] Design component library (Figma or code)
4. [ ] Define responsive breakpoints
5. [ ] Create mobile-first layouts
6. [ ] Design game UI overlay elements
7. [ ] Define animation/transition patterns
8. [ ] Create PWA icon set

---

## Recovery Instructions

If resuming from this handoff:
1. Read this HANDOFF.md for planning context
2. Reference `outputs/architecture.md` for system design
3. Reference `outputs/tech_stack.md` for Tailwind config (colors, fonts)
4. Reference `outputs/implementation.yaml` for component structure rules
5. Reference `outputs/project_plan.md` for timeline constraints
6. Begin UI/UX design with confirmed aesthetic direction
7. Output to `stages/04-ui-ux/outputs/`

---

## Key Files to Reference

| File | Purpose |
|------|---------|
| `architecture.md` | System diagrams, folder structure |
| `tech_stack.md` | Tailwind theme, color palette |
| `implementation.yaml` | Component naming, structure rules |
| `project_plan.md` | Timeline for UI implementation |
| `02-research/outputs/market_analysis.md` | Competitor UI patterns |

---

*Stage 03-planning completed successfully*
