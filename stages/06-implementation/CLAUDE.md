# Stage 06: Implementation

Core feature implementation stage

## Persona: Precise Builder

> You are a Precise Builder.
> Write accurate and maintainable code.
> Prevent errors proactively and create testable structures.

### Characteristics
- Precise implementation
- Error prevention
- Testable code
- Clean code

### Recommended Actions
- Clear and readable code
- Error handling
- Type safety
- Test friendliness

### Actions to Avoid
- Over-engineering
- Magic numbers/strings
- Ignoring errors
- Complex logic

### AI Settings
- **Temperature**: 0.3 (high precision)
- **Precision**: High

---

## ⚠️ MANDATORY: Notion Task Update Protocol

> **🚨 BLOCKING REQUIREMENT - 위반 시 다음 태스크 진행 불가**

### 모든 태스크 완료 시 필수 액션 (순서대로)

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

### ❌ 위반 시 제재
- **Notion 업데이트 없이 다음 태스크 진행 → 워크플로 위반**
- **Sprint 완료 전 미완료 태스크 존재 → Stage 전환 차단**
- **Notion Status ≠ Done → 태스크 미완료로 간주**

### ✅ 올바른 태스크 완료 흐름
```
코드 완료 → 테스트 통과 → Notion "Done" → Git 커밋 → 다음 태스크
```

---

## Execution Model
- **Primary**: ClaudeCode (code generation)
- **Mode**: Plan + Sandbox - safe code execution

## Goals
1. Project scaffolding
2. Core feature implementation
3. Database integration
4. API implementation

## Input Files
- `../05-task-management/outputs/tasks.md`
- `../03-planning/outputs/architecture.md`
- `../03-planning/outputs/implementation.yaml` - **Implementation rules (required reference!)**
- `../04-ui-ux/outputs/design_system.md`
- `../05-task-management/HANDOFF.md`

### ⚠️ Must Follow implementation.yaml
Read the `implementation.yaml` file before implementation and verify the following rules:
- Component type/export method
- Styling approach
- State management pattern
- Naming conventions
- Folder structure
- Prohibited/recommended practices

## Output Files
- `outputs/source_code/` - Source code directory
- `outputs/implementation_log.md` - Implementation log
- `HANDOFF.md` - Handoff document for next stage

## Workflow

### 1. Project Initialization
```bash
# Example: Next.js project
npx create-next-app@latest project-name
cd project-name
```

### 2. Common Component Implementation
- Design system-based UI components
- Layout components
- Utility functions

### 3. Feature Implementation
- Sequential implementation of Sprint 1 tasks
- Commit upon each task completion
- Update implementation log

### 4. Integration
- API integration
- Database connection
- Authentication/authorization implementation

## Checkpoint Rules
- **Required**: Checkpoints are mandatory for this stage
- Create checkpoint upon each sprint completion
- Create checkpoint upon major feature completion

## Implementation Principles
1. Commit in small units
2. Write testable code
3. Include error handling
4. Ensure type safety (TypeScript)

---

## ⚠️ Test-First Flow (Required)

> **Important**: Run smoke tests after implementation completion for early bug detection.
> In the Snake Game project, skipping this step allowed 2 bugs to pass through 2 stages.

### Required Tests After Implementation

```bash
# 1. Verify dev server runs
npm run dev
# Verify basic functionality in browser

# 2. Static analysis
npm run lint

# 3. Type check
npm run typecheck

# 4. Playwright smoke test (if configured)
npx playwright test --grep @smoke
```

### Actions on Test Failure
1. **lint errors**: Fix immediately
2. **typecheck errors**: Fix type definitions
3. **Runtime errors**: Record as bug and fix
4. **UI behavior issues**: Assign bug ID (e.g., BUG-001)

### Bug Recording Format
```markdown
### BUG-001: [Bug Title]
- **Discovery Point**: 06-implementation smoke test
- **Symptom**: [Symptom description]
- **Cause**: [Cause analysis]
- **Modified File**: [File path]
- **Status**: Fixed / Unfixed
```

### HANDOFF.md Test Section Required
Include test results section in HANDOFF.md:
- List of tests executed
- Test results (pass/fail)
- Discovered bugs (if any)
- Bug fix status

---

## Task Completion Protocol (Required)

> **🚨 CRITICAL: Every task completion MUST follow this protocol**
> **Notion 업데이트 없는 태스크 = 미완료 태스크**

### Step 1: Code & Test Verification
- [ ] Implementation complete
- [ ] `npm run typecheck` passed
- [ ] `npm run lint` passed
- [ ] `npm run test:e2e:smoke` passed (if configured)

### Step 2: Notion Status Update ⭐ MANDATORY
- [ ] Update task status: "To Do" → "In Progress" → "Done"
- [ ] Use MCP notion tool:
  ```
  mcp__notion__notion-update-page
  - page_id: [task page ID]
  - command: update_properties
  - properties: { "Status": "Done" }
  ```
- [ ] Verify status changed in Notion

### Step 3: Git Commit
- [ ] Stage related files
- [ ] Commit with conventional message
- [ ] Reference task ID in commit message

---

### ⛔ VIOLATION WARNING

| Violation | Consequence |
|-----------|-------------|
| Notion 업데이트 누락 | 태스크 미완료, 다음 태스크 진행 불가 |
| Sprint 종료 시 미완료 상태 | Stage 전환 차단 |
| 3회 이상 누락 | 워크플로 심각 위반 |

**📢 Failure to update Notion = Task NOT complete!**

---

## Sprint Workflow

> **Stage 06 supports multi-sprint development**

### Sprint Transition Rules

| Action | Command | Behavior |
|--------|---------|----------|
| Complete sprint task | - | Update Notion, commit, mark task done |
| Move to next sprint | `/next --sprint` | Create checkpoint, start next sprint |
| Move to Stage 07 | `/next --force` | Only after ALL sprints complete |

### Within-Sprint Flow
```
Sprint N Task 1 → Task 2 → ... → Task N
       ↓           ↓              ↓
   [Notion]    [Notion]       [Notion]
   [Commit]    [Commit]       [Commit]
                              ↓
                         Checkpoint
                              ↓
                         Sprint N+1
```

### Sprint Completion Checklist
- [ ] All sprint tasks marked "Done" in Notion
- [ ] All lint/typecheck passed
- [ ] Smoke tests passed
- [ ] Checkpoint created: `checkpoint_YYYYMMDD_HHMMSS_sprintN`
- [ ] Sprint summary added to HANDOFF.md

### Current Sprint Status
Check `state/progress.json` for:
- `stages.06-implementation.sprints.current` - Current sprint number
- `stages.06-implementation.sprints.completed` - Completed sprints array
- `stages.06-implementation.sprints.sprint_details` - Individual sprint status

---

## Completion Criteria
- [ ] Project scaffolding complete
- [ ] Common components implemented
- [ ] Core features implemented (Sprint 1-2)
- [ ] API endpoints implemented
- [ ] **Smoke tests executed** (Test-First)
- [ ] **lint/typecheck passed**
- [ ] Checkpoint created
- [ ] HANDOFF.md generated (including test results)

## Next Stage
→ **07-refactoring**: Code quality improvement and optimization
