# claude-symphony 템플릿: Iteration/Spiral 개발 지원

> **대상**: claude-symphony 템플릿 자체
> **범위**: 템플릿 기능 확장 (프로젝트 무관)
> **생성일**: 2026-01-22

---

## 배경

### 현재 템플릿 한계
- 파이프라인이 단일 패스 (01→10 한 번)로 설계됨
- Stage 06에서 다중 Sprint 실행을 가정하지만 명시적 지원 없음
- `/next` 명령이 Sprint 완료 여부를 확인하지 않음
- Spiral 개발 패턴 (plan→implement→test→refine 반복) 미지원

### 목표
- Spiral/Iterative 개발 패턴 정식 지원
- Sprint 기반 반복 개발 워크플로우 구현
- `/next` 명령의 Sprint-aware 전환 로직 추가
- 하위 호환성 유지 (기존 단일 패스 모드 지원)

---

## 수정 대상 파일 (템플릿 레벨)

| 파일 | 작업 | 우선순위 |
|------|------|----------|
| `config/pipeline.yaml` | iteration + loop_back 섹션 추가 | P0 |
| `state/templates/progress.json.template` | sprints + loop_back_history 스키마 | P0 |
| `stages/06-implementation/config.yaml` | iteration 설정 추가 | P1 |
| `stages/06-implementation/CLAUDE.md` | Sprint 워크플로우 문서화 | P1 |
| `CLAUDE.md` (루트) | /sprint, /goto 명령어 문서화 | P1 |
| `scripts/next-stage.sh` | Sprint 검증 + 자동 전환 로직 | P2 |
| `scripts/goto-stage.sh` | Loop-back 실행 스크립트 (신규) | P2 |

---

## Phase 1: 설정 파일 수정 (P0)

### 1.1 config/pipeline.yaml 수정

파일 끝에 추가:

```yaml
# ============================================
# Iteration Mode Configuration
# ============================================
iteration:
  enabled: true
  mode: "sprint_based"  # single_pass | sprint_based | spiral

  sprint_config:
    enabled: true
    source: "stages/05-task-management/outputs/sprint_plan.md"
    default_sprints: 3
    auto_detect: true

    completion_criteria:
      require_all_must_tasks: true
      require_tests_pass: true
      allow_force_complete: true

  stage_iterations:
    "06-implementation":
      iterative: true
      iteration_unit: "sprint"
      completion_check: "all_sprints_complete"

# Backward compatibility
legacy:
  single_pass_mode: false  # true면 기존 단일 패스 동작
```

### 1.2 state/templates/progress.json.template 스키마 추가

기존 스키마에 추가할 필드:

```json
{
  "current_iteration": {
    "type": "sprint",
    "current_sprint": 1,
    "total_sprints": 3
  },
  "sprints": {
    "Sprint 1": {
      "status": "pending",
      "tasks_total": 0,
      "tasks_completed": 0,
      "checkpoint_id": null
    }
  }
}
```

**필드 설명:**
- `current_iteration`: 현재 반복 상태
- `sprints`: Sprint별 진행 상태 (동적 생성)
- `status`: pending | in_progress | completed

---

## Phase 2: Stage 설정 수정 (P1)

### 2.1 stages/06-implementation/config.yaml 수정

```yaml
# iteration 섹션 추가
iteration:
  enabled: true
  unit: "sprint"

  completion:
    require_all_sprints: true
    per_sprint_criteria:
      - "must_tasks_complete"
      - "lint_pass"
      - "typecheck_pass"

  checkpoints:
    per_sprint: true
    naming: "sprint_{{n}}_{{timestamp}}"

transition:
  next_stage: "07-refactoring"
  sprint_completion_required: true  # 신규 필드
```

### 2.2 stages/06-implementation/CLAUDE.md 수정

"Iterative Development Mode" 섹션 추가:

```markdown
## Iterative Development Mode

> Stage 06은 **sprint 기반 반복 모드**로 운영됩니다.

### Sprint 워크플로우

1. Sprint 시작 → 태스크 진행 → Sprint 완료
2. `/next --sprint` → 다음 Sprint로 이동
3. 모든 Sprint 완료 후 `/next` → Stage 07로 전환

### Sprint 명령어

| 명령어 | 설명 |
|--------|------|
| `/sprint` | 현재 Sprint 상태 |
| `/sprint tasks` | 현재 Sprint 태스크 목록 |
| `/next` | Sprint 남음 → 다음 Sprint / 완료 → Stage 07 전환 |
| `/next --stage` | Sprint 무시하고 Stage 전환 (권장 안함) |

### Sprint 완료 기준

각 Sprint 완료 시:
- [ ] 모든 Must 태스크 완료
- [ ] `npm run lint` 통과
- [ ] `npm run typecheck` 통과
- [ ] Sprint checkpoint 생성
```

---

## Phase 3: 루트 CLAUDE.md 수정 (P1)

### Slash Commands 섹션에 추가

```markdown
### Sprint Commands
| Command | Description |
|---------|-------------|
| `/sprint` | Show current sprint status |
| `/sprint tasks` | List tasks for current sprint |
| `/sprint complete` | Mark current sprint as complete |
| `/next --sprint` | Advance to next sprint (stay in stage) |
```

---

## Phase 4: /next 명령어 로직 수정 (P2)

### 동작 변경 (Stage 06 자동 Sprint 전환)

**Stage 06에서 `/next` 실행 시:**
- Sprint 남아있음 → **자동으로 다음 Sprint 시작** (Stage 유지)
- 모든 Sprint 완료 → Stage 07로 전환

**명시적 Stage 전환이 필요하면:**
- `/next --stage` 또는 `/next --force` 사용

### scripts/next-stage.sh 수정

```bash
# Sprint-aware transition logic (자동 Sprint 전환)
handle_next_in_iterative_stage() {
  local ITERATION_ENABLED=$(yq '.iteration.enabled' config/pipeline.yaml)
  local CURRENT_STAGE=$(jq -r '.current_stage' state/progress.json)
  local STAGE_ITERATIVE=$(yq ".iteration.stage_iterations[\"$CURRENT_STAGE\"].iterative" config/pipeline.yaml)

  if [ "$ITERATION_ENABLED" == "true" ] && [ "$STAGE_ITERATIVE" == "true" ]; then
    local CURRENT_SPRINT=$(jq -r '.current_iteration.current_sprint' state/progress.json)
    local TOTAL_SPRINTS=$(jq -r '.current_iteration.total_sprints' state/progress.json)

    if [ "$CURRENT_SPRINT" -lt "$TOTAL_SPRINTS" ]; then
      # 자동으로 다음 Sprint 시작
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "🔄 Sprint Transition"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "Sprint $CURRENT_SPRINT → Sprint $((CURRENT_SPRINT + 1))"

      # Sprint checkpoint 생성
      create_sprint_checkpoint $CURRENT_SPRINT

      # progress.json 업데이트
      jq ".current_iteration.current_sprint = $((CURRENT_SPRINT + 1))" \
        state/progress.json > tmp.json && mv tmp.json state/progress.json

      echo "✅ Sprint $((CURRENT_SPRINT + 1)) 시작!"
      echo "남은 Sprint: $((TOTAL_SPRINTS - CURRENT_SPRINT - 1))"
      return 0  # Sprint 전환 완료, Stage 전환 안함
    else
      # 모든 Sprint 완료 → Stage 전환
      echo "✅ 모든 Sprint 완료. Stage 전환 진행..."
      return 1  # Stage 전환 진행
    fi
  fi
  return 1  # 비반복 Stage는 그냥 Stage 전환
}
```

### /next 옵션

| 옵션 | 설명 |
|------|------|
| (없음) | Stage 06: 다음 Sprint / 다른 Stage: 다음 Stage |
| `--stage` | Sprint 무시하고 Stage 전환 (권장 안함) |
| `--force` | 모든 검증 스킵 |

---

## 검증 방법

### 1. 설정 파일 검증
```bash
# iteration 설정 확인
grep -A10 "iteration:" config/pipeline.yaml

# Stage 06 iteration 설정 확인
grep -A10 "iteration:" stages/06-implementation/config.yaml
```

### 2. 동작 검증
```bash
# Sprint 상태 확인
/sprint

# /next 블로킹 테스트 (Sprint 남아있을 때)
/next
# → "Sprint N/M 완료. 남은 Sprint: X" 메시지 확인

# Sprint 전환 테스트
/next --sprint
# → 다음 Sprint로 이동 확인
```

---

## 예상 동작

### /next 실행 시 (Stage 06, Sprint 남음) - 자동 Sprint 전환
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Sprint Transition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint 1 → Sprint 2

[Sprint 1 완료]
✓ Checkpoint: sprint_1_20260122
✓ 태스크: 22/22

✅ Sprint 2 시작!
남은 Sprint: 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### /next 실행 시 (모든 Sprint 완료) - Stage 전환
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Stage Transition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
06-implementation → 07-refactoring

✓ Sprint 1: 완료
✓ Sprint 2: 완료
✓ Sprint 3: 완료

✅ 07-refactoring 시작!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### /status 실행 시 (Sprint 모드)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Pipeline Status (Sprint Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stage: 06-implementation
Sprint: 2/3

 Sprint 1 ✅ | Sprint 2 🔄 | Sprint 3 ⏳
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

---

## Phase 5: Loop-back 메커니즘 (이전 Phase로 되돌아가기)

### 시나리오

| 상황 | 현재 Stage | 되돌아갈 Stage |
|------|------------|----------------|
| QA 중 버그 발견 | 08-qa | 06-implementation |
| 요구사항 변경 | 어느 Stage든 | 03-planning 또는 05-task-management |
| 리팩토링 중 기능 추가 필요 | 07-refactoring | 06-implementation |
| 테스트 실패 | 09-testing | 06-implementation |

### 현재 템플릿 지원

`config/smart_rollback.yaml`에 에러 복구용 롤백 있음:
- `max_rollback_stages: 2` (최대 2단계 롤백)
- 에러 기반 자동 제안
- checkpoint 기반 복원

### 추가할 기능: `/goto` 명령어

```markdown
# /goto

이전 Stage로 의도적으로 이동

## 사용법
/goto <stage-id>              # 특정 Stage로 이동
/goto 06-implementation       # 예: Implementation으로 이동
/goto --reason "버그 수정 필요"  # 이유 기록

## 동작
1. 현재 Stage 상태 저장 (checkpoint)
2. HANDOFF.md에 loop-back 기록
3. 대상 Stage 상태를 "in_progress"로 변경
4. progress.json에 loop_back_history 기록
```

### config/pipeline.yaml 추가 설정

```yaml
iteration:
  # ... 기존 설정 ...

  loop_back:
    enabled: true
    max_stages_back: 3  # 최대 3단계 뒤로

    triggers:
      - name: "bug_found"
        from_stages: ["08-qa", "09-testing"]
        to_stage: "06-implementation"
        auto_suggest: true

      - name: "requirements_change"
        from_stages: ["*"]
        to_stage: "03-planning"
        require_confirmation: true

      - name: "feature_addition"
        from_stages: ["07-refactoring"]
        to_stage: "06-implementation"
        auto_suggest: true

    on_loop_back:
      - create_checkpoint
      - record_reason
      - update_handoff
      - notify_user
```

### progress.json 스키마 추가

```json
{
  "loop_back_history": [
    {
      "timestamp": "2026-01-22T15:00:00Z",
      "from_stage": "08-qa",
      "to_stage": "06-implementation",
      "reason": "Critical bug BUG-002 requires implementation fix",
      "checkpoint_before": "checkpoint_qa_20260122",
      "sprint_at_return": 2
    }
  ]
}
```

### /goto 예상 동작

```
/goto 06-implementation --reason "BUG-002 수정 필요"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔙 Stage Loop-back
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
08-qa → 06-implementation

[현재 상태 저장]
✓ Checkpoint: checkpoint_qa_20260122

[Loop-back 기록]
✓ 이유: BUG-002 수정 필요
✓ HANDOFF.md 업데이트

[Stage 전환]
✓ 08-qa: paused
✓ 06-implementation: in_progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 06-implementation으로 이동 완료!

작업 완료 후 `/next`로 다시 진행하세요.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 루트 CLAUDE.md에 추가

```markdown
### Loop-back Commands
| Command | Description |
|---------|-------------|
| `/goto <stage>` | 이전 Stage로 의도적 이동 |
| `/goto --list` | 이동 가능한 Stage 목록 |
| `/goto --history` | Loop-back 이력 조회 |
```

---

## 하위 호환성

기존 단일 패스 동작으로 복원하려면:

```yaml
# config/pipeline.yaml
legacy:
  single_pass_mode: true
```

또는:

```yaml
iteration:
  enabled: false
```

---

## 실행 순서

1. **Phase 1**: config/pipeline.yaml에 iteration + loop_back 섹션 추가
2. **Phase 2**: stages/06-implementation/config.yaml, CLAUDE.md 수정
3. **Phase 3**: 루트 CLAUDE.md에 /sprint, /goto 명령어 문서화
4. **Phase 4**: scripts/next-stage.sh에 Sprint 자동 전환 로직 추가
5. **Phase 5**: scripts/goto-stage.sh 생성 (Loop-back 실행)
6. **검증**: /sprint, /next, /goto 명령어 테스트

---

## 이 계획 적용 후

### Sprint 기반 반복 개발
1. Stage 06에서 여러 Sprint 실행 가능
2. `/next` 실행 시 자동으로 다음 Sprint 시작
3. 모든 Sprint 완료 후 자동으로 Stage 전환

### Loop-back (이전 Phase로 돌아가기)
4. QA/Testing 중 버그 발견 시 `/goto 06-implementation`으로 돌아가기
5. 요구사항 변경 시 `/goto 03-planning`으로 돌아가기
6. loop_back_history로 이동 이력 추적

### 하위 호환성
7. `legacy.single_pass_mode: true`로 기존 단일 패스 모드 지원
8. `iteration.enabled: false`로 iteration 기능 비활성화 가능
