# Sprint Plan: Mini-Game Heaven

> Generated: 2026-01-22
> Stage: 05-task-management
> Task Management: Notion Database

---

## Overview

| Sprint | Duration | Focus | Tasks |
|--------|----------|-------|-------|
| Sprint 1 | Week 1-2 | Foundation + Game 1 | 22 |
| Sprint 2 | Week 3-4 | Games 2-3 + Backend | 14 |
| Sprint 3 | Week 5-6 | PWA + Polish + Launch | 16 |
| **Total** | **6 weeks** | - | **42** |

---

## Sprint 1: Foundation + Game 1 (Week 1-2)

**Goal**: 프로젝트 기반 구축 및 첫 번째 게임 완성

### Epic: Setup (7 tasks)
| Task | Priority | Estimate |
|------|----------|----------|
| Next.js 14 프로젝트 초기화 | Must | 2h |
| TypeScript 설정 (strict mode) | Must | 1h |
| Tailwind CSS + 디자인 토큰 설정 | Must | 3h |
| ESLint + Prettier + Husky 설정 | Must | 2h |
| Supabase 프로젝트 생성 및 연결 | Must | 2h |
| 데이터베이스 스키마 생성 (SQL) | Must | 3h |
| 폴더 구조 설정 (architecture.md 기반) | Must | 1h |

### Epic: Components (10 tasks)
| Task | Priority | Estimate |
|------|----------|----------|
| Button 컴포넌트 (Primary, Secondary, Ghost) | Must | 2h |
| Header 컴포넌트 | Must | 2h |
| BottomNav 컴포넌트 | Must | 2h |
| GameCard 컴포넌트 | Must | 3h |
| Modal 컴포넌트 (Base) | Must | 3h |
| Toast 컴포넌트 | Must | 2h |
| Layout 컴포넌트 (RootLayout) | Must | 2h |
| Zustand 스토어 설정 (gameStore, uiStore) | Must | 3h |
| Home 페이지 (게임 그리드, Featured) | Must | 4h |
| Game 페이지 (/games/[id]) | Must | 4h |

### Epic: Game Dev (5 tasks)
| Task | Priority | Estimate |
|------|----------|----------|
| Phaser 3 통합 설정 (dynamic import) | Must | 4h |
| GameLoader 컴포넌트 (로딩 상태, 에러 처리) | Must | 3h |
| Neon Tower Stack 게임 개발 | Must | 1d |
| Game HUD 컴포넌트 (점수, 생명) | Must | 2h |
| GameOverModal 컴포넌트 | Must | 3h |

### Sprint 1 Summary
- **Total Tasks**: 22
- **Total Estimate**: ~56h (7 working days)
- **Key Deliverable**: 플레이 가능한 Neon Tower Stack 게임

---

## Sprint 2: Games 2-3 + Backend (Week 3-4)

**Goal**: 나머지 게임 완성 및 백엔드 통합

### Epic: Game Dev (2 tasks)
| Task | Priority | Estimate |
|------|----------|----------|
| Gravity Switcher 게임 개발 | Must | 1d |
| Color Rush 게임 개발 | Must | 1d |

### Epic: Backend (5 tasks)
| Task | Priority | Estimate |
|------|----------|----------|
| Discord OAuth 설정 (Supabase Auth) | Must | 4h |
| Auth Callback 처리 (/auth/callback) | Must | 2h |
| Guest 모드 구현 (localStorage UUID) | Should | 2h |
| 점수 제출 API (Supabase Edge Function) | Must | 4h |

### Epic: Components (4 tasks)
| Task | Priority | Estimate |
|------|----------|----------|
| Login 페이지 UI | Must | 3h |
| LeaderboardTable 컴포넌트 | Must | 4h |
| Leaderboard 페이지 (Realtime 구독) | Must | 4h |
| Profile 페이지 (통계, 배지) | Should | 4h |
| Settings 모달 컴포넌트 | Should | 2h |

### Epic: PWA (3 tasks)
| Task | Priority | Estimate |
|------|----------|----------|
| PWA manifest.json 설정 | Must | 2h |
| Service Worker 기본 설정 | Must | 3h |
| 오프라인 점수 저장 (IndexedDB) | Should | 4h |

### Sprint 2 Summary
- **Total Tasks**: 14
- **Total Estimate**: ~45h (6 working days)
- **Key Deliverable**: 3개 게임 완성, 인증 및 리더보드 작동

---

## Sprint 3: PWA + Polish + Launch (Week 5-6)

**Goal**: Push 알림 구현, 품질 향상, 배포

### Epic: PWA (1 task)
| Task | Priority | Estimate |
|------|----------|----------|
| Web Push 구독 설정 (VAPID) | Must | 4h |

### Epic: Components (1 task)
| Task | Priority | Estimate |
|------|----------|----------|
| Push 권한 요청 UI | Must | 2h |

### Epic: Backend (3 tasks)
| Task | Priority | Estimate |
|------|----------|----------|
| Nemesis 감지 Edge Function | Must | 4h |
| Push 알림 발송 Edge Function | Must | 4h |
| 알림 클릭 딜링크 처리 | Must | 2h |

### Epic: Polish (9 tasks)
| Task | Priority | Estimate | Stage |
|------|----------|----------|-------|
| UI 폴리시 및 애니메이션 추가 | Should | 4h | 07-refactoring |
| 성능 최적화 (Lighthouse 90+) | Should | 4h | 07-refactoring |
| 번들 크기 최적화 | Should | 3h | 07-refactoring |
| 에러 바운더리 추가 | Must | 2h | 08-qa |
| 로딩 스켈레톤 추가 | Should | 2h | 06-implementation |
| E2E 테스트 작성 (Playwright) | Must | 1d | 09-testing |
| 컴포넌트 단위 테스트 (Vitest) | Should | 4h | 09-testing |
| Vercel 배포 설정 | Must | 2h | 10-deployment |
| 환경변수 설정 (Production) | Must | 1h | 10-deployment |
| SEO 및 메타태그 설정 | Should | 2h | 06-implementation |

### Sprint 3 Summary
- **Total Tasks**: 16
- **Total Estimate**: ~42h (5 working days)
- **Key Deliverable**: Production-ready 배포

---

## Task Distribution by Epic

| Epic | Sprint 1 | Sprint 2 | Sprint 3 | Total |
|------|----------|----------|----------|-------|
| Setup | 7 | 0 | 0 | 7 |
| Components | 10 | 4 | 1 | 15 |
| Game Dev | 5 | 2 | 0 | 7 |
| Backend | 0 | 4 | 3 | 7 |
| PWA | 0 | 3 | 1 | 4 |
| Polish | 0 | 0 | 9 | 9 |
| **Total** | **22** | **14** | **16** | **52** |

---

## Task Distribution by Priority

| Priority | Count | Percentage |
|----------|-------|------------|
| Must | 32 | 76% |
| Should | 10 | 24% |
| Could | 0 | 0% |

---

## Notion Task Board

**URL**: https://www.notion.so/582253a2a88043f3addc781510bcc9b2

### Database Schema
```sql
CREATE TABLE tasks (
  "Task" TEXT,       -- title
  "Status" TEXT,     -- [To Do, In Progress, Done, Blocked]
  "Priority" TEXT,   -- [Must, Should, Could]
  "Sprint" TEXT,     -- [Sprint 1, Sprint 2, Sprint 3]
  "Epic" TEXT,       -- [Setup, Components, Game Dev, Backend, PWA, Polish]
  "Estimate" TEXT,   -- [1h, 2h, 3h, 4h, 8h, 1d]
  "Stage" TEXT       -- [06-implementation, 07-refactoring, 08-qa, 09-testing, 10-deployment]
)
```

### Views Recommended
1. **Board View**: Status별 칸반 보드
2. **Sprint View**: Sprint별 그룹화
3. **Timeline View**: 일정 시각화

---

## Risk Factors

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phaser 3 SSR 이슈 | High | Dynamic import 필수 |
| Push 알림 권한 거부율 | Medium | 적절한 타이밍에 요청 |
| Supabase Realtime 비용 | Low | 필요한 테이블만 구독 |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Sprint 1 완료율 | 100% Must tasks |
| Sprint 2 완료율 | 100% Must tasks |
| Sprint 3 완료율 | 100% Must tasks |
| 전체 완료율 | 90%+ |

---

*End of Sprint Plan*
