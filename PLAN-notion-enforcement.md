# Notion 태스크 관리 강제화 계획

> **목표**: 태스크 완료 시 Notion 상태 업데이트를 필수로 강제하는 워크플로 수정

---

## 현재 문제점

| 문제 | 설명 |
|------|------|
| ISSUE-005 | 태스크 완료 시 Notion 상태 업데이트 누락 |
| 증상 | Sprint 2 태스크 6개 완료했지만 Notion에서 여전히 "To Do" |
| 원인 | Notion 업데이트가 권장사항이지 강제사항이 아님 |

---

## 해결 방안: 3단계 강제화

### 1. Config 레벨 강제화
**파일**: `config/output_validation.yaml`

```yaml
# Stage 06 validation에 추가
06-implementation:
  notion_validation:
    enabled: true
    on_task_complete:
      required_status: "Done"
      block_on_failure: true
    on_stage_transition:
      all_sprint_tasks_done: true
      validation_command: "notion-check-sprint-status"
```

### 2. Hook 레벨 강제화
**파일**: `.claude/hooks/post-task.sh` (신규)

```bash
#!/bin/bash
# 태스크 완료 후 Notion 상태 검증

TASK_ID="$1"
EXPECTED_STATUS="Done"

# MCP Notion 도구로 상태 확인
STATUS=$(notion_get_task_status "$TASK_ID")

if [ "$STATUS" != "$EXPECTED_STATUS" ]; then
    echo "❌ ERROR: Task $TASK_ID Notion status is '$STATUS', expected '$EXPECTED_STATUS'"
    echo "→ Run: mcp__notion__notion-update-page to update status"
    exit 1
fi

echo "✅ Task $TASK_ID Notion status verified: $STATUS"
```

### 3. CLAUDE.md 레벨 강제화
**파일**: `stages/06-implementation/CLAUDE.md`

```markdown
## ⚠️ MANDATORY: Task Completion Protocol

> **BLOCKING REQUIREMENT - 위반 시 다음 태스크 진행 불가**

### 태스크 완료 시 필수 액션 (순서대로)

1. ✅ 코드 구현 완료
2. ✅ `npm run typecheck && npm run lint` 통과
3. ✅ E2E 테스트 통과 (해당 시)
4. ⭐ **Notion 상태 업데이트** → "Done"
   ```
   mcp__notion__notion-update-page
   - page_id: [태스크 페이지 ID]
   - command: update_properties
   - properties: { "Status": "Done" }
   ```
5. ✅ Git 커밋

### 위반 시 제재
- Notion 업데이트 없이 다음 태스크 진행 → **워크플로 위반**
- Sprint 완료 전 미완료 태스크 → **Stage 전환 차단**
```

---

## 수정 대상 파일

| 파일 | 작업 | 우선순위 |
|------|------|----------|
| `stages/06-implementation/CLAUDE.md` | Task Completion Protocol 추가 | P0 |
| `config/output_validation.yaml` | notion_validation 섹션 추가 | P0 |
| `.claude/hooks/post-task.sh` | 신규 생성 - Notion 상태 검증 | P1 |
| `scripts/next-stage.sh` | Sprint 태스크 상태 검증 추가 | P1 |
| `CLAUDE.md` (루트) | Notion 필수 규칙 섹션 추가 | P2 |

---

## 구현 순서

### Phase 1: 문서 강제화 (즉시 적용)
1. `stages/06-implementation/CLAUDE.md` 수정
   - MANDATORY 섹션 최상단에 추가
   - Task Completion Protocol 명시
   - 위반 시 제재 명시

2. `CLAUDE.md` (루트) 수정
   - "Notion 태스크 관리" 섹션 추가
   - 필수 규칙으로 명시

### Phase 2: 설정 강제화
3. `config/output_validation.yaml` 수정
   - Stage 06에 notion_validation 추가
   - block_on_failure: true

### Phase 3: 자동화 강제화
4. `.claude/hooks/post-task.sh` 생성
   - Notion 상태 자동 검증
   - 미완료 시 에러 출력 및 차단

5. `scripts/next-stage.sh` 수정
   - Sprint 완료 검증에 Notion 상태 포함
   - 미완료 태스크 있으면 Stage 전환 차단

---

## 검증 방법

1. Phase 1 완료 후:
   - 다음 태스크 완료 시 Notion 업데이트 필수 안내 표시 확인

2. Phase 2 완료 후:
   - `npm run validate` 실행 시 Notion 상태 검증 포함 확인

3. Phase 3 완료 후:
   - `/next` 실행 시 미완료 태스크가 있으면 차단 확인

---

## 즉시 실행 (Plan 승인 후)

1. **Sprint 2 완료 태스크 Notion 업데이트**
   - Score submission API → Done
   - Profile page → Done
   - Settings modal → Done
   - PWA manifest → Done
   - Service Worker → Done
   - Offline storage → Done

2. **Phase 1 문서 수정 적용**
