# Feedback Report - Context Management Analysis

**Date**: 2026-01-22
**Subject**: claude-symphony Template Feedback

---

## 1. Context Auto-Handoff Mechanism Analysis

### 1.1 Configuration Status

| Component | File | Status |
|-----------|------|--------|
| Context Thresholds | `config/context.yaml` | Defined (60%, 50%, 40%) |
| Handoff Intelligence | `config/handoff_intelligence.yaml` | Detailed settings exist |
| Memory Integration | `config/memory_integration.yaml` | claude-mem MCP settings |
| Context Manager Script | `scripts/context-manager.sh` | Implemented |
| Skills | `.claude/skills/context-compression/` | Documented |

### 1.2 Issues Identified

#### ISSUE-001: Token Estimation is Placeholder
- **Location**: `scripts/context-manager.sh:71`
- **Problem**: Function returns hardcoded value
```bash
estimate_tokens() {
    echo "45000"  # placeholder
}
```
- **Impact**: Context monitoring cannot accurately track actual token usage
- **Severity**: Critical

#### ISSUE-002: No Automatic Trigger Integration
- **Problem**: The `auto_compact` function exists but requires manual invocation
- **Expected**: Should auto-trigger when thresholds are crossed
- **Actual**: Only triggered manually via `--auto-compact` flag
- **Severity**: High

#### ISSUE-003: Skills Not Auto-Invoked
- **Location**: `.claude/skills/context-compression/`
- **Problem**: Skills are documented but Claude must be explicitly told to use them
- **Expected**: Auto-activation per config
- **Actual**: Passive documentation only
- **Severity**: Medium

#### ISSUE-004: Claude Code Built-in vs Custom System
- **Finding**: Claude Code has its own conversation summarization (creates `.jsonl` files)
- **This worked**: When context ran out, the system created a summary and continued
- **Conclusion**: Claude Code's built-in mechanism works, but custom pipeline tools are not integrated

### 1.3 What Currently Works

| Feature | Status | Notes |
|---------|--------|-------|
| Claude Code auto-summarization | Working | Built-in feature, creates `.jsonl` transcript |
| Manual context save | Working | `/context --save` works |
| Manual snapshot list | Working | `/context --list` works |
| HANDOFF.md generation | Working | Manual via `/handoff` |

---

## 2. Recommendations

### 2.1 Context Management Fixes

1. **Short-term Fix**: Add periodic context check reminder to CLAUDE.md
   ```markdown
   ## Context Check Protocol
   Every 5 tasks, run: /context to check token usage
   ```

2. **Medium-term Fix**: Create a pre-task hook that checks context
   ```bash
   # In .claude/hooks/pre-task.sh
   scripts/context-manager.sh --json | jq '.percent > 60'
   ```

3. **Long-term Fix**: Integrate with Claude Code's actual token API (if available)

### 2.2 Process Improvements

- [ ] Add context check reminder to workflow documentation
- [ ] Consider integrating context check into task completion checklist
- [ ] Document the gap between Claude Code's built-in summarization and custom pipeline tools

---

## 3. Feature Request - Moodboard Image Support

### 3.1 Overview

프로젝트 초기 단계에서 시각적 레퍼런스와 무드보드 이미지를 첨부할 수 있는 기능 제안

### 3.2 Applicable Stages

| Stage | Use Case |
|-------|----------|
| 01-brainstorm | 아이디어 영감을 위한 레퍼런스 이미지 |
| 03-planning | 기술/아키텍처 다이어그램 참조 |
| 04-ui-ux | UI/UX 디자인 무드보드, 스타일 가이드 |
| /init-project | 초기 프로젝트 비전 전달 |

### 3.3 Use Cases

1. **UI/UX 디자인 방향 설정**
   - 원하는 디자인 스타일의 스크린샷 공유
   - 경쟁사/유사 앱 UI 레퍼런스

2. **브랜드 톤앤매너 전달**
   - 컬러 팔레트 이미지
   - 타이포그래피 예시
   - 로고/브랜딩 가이드라인

3. **시각적 레퍼런스 공유**
   - 와이어프레임 스케치
   - 손그림 목업
   - 기존 디자인 시스템 캡처

### 3.4 Implementation Proposal

#### Directory Structure
```
stages/04-ui-ux/
├── inputs/
│   └── moodboard/           # NEW
│       ├── ui-references/   # UI 스크린샷
│       ├── brand-assets/    # 브랜드 에셋
│       └── sketches/        # 스케치/와이어프레임
└── outputs/
```

#### Config Addition (`config/ui-ux.yaml`)
```yaml
moodboard:
  enabled: true
  supported_formats:
    - png
    - jpg
    - webp
    - svg
  max_images: 10
  vision_analysis: true  # Claude vision 기능 활용
```

#### Vision Integration
- Claude의 멀티모달 기능을 활용하여 이미지 분석
- 무드보드에서 자동으로 컬러 팔레트 추출
- 레이아웃 패턴 인식 및 제안

### 3.5 Expected Benefits

- **커뮤니케이션 향상**: 텍스트보다 직관적인 시각적 방향 전달
- **일관성 확보**: 디자인 방향에 대한 명확한 기준점 제공
- **효율성 증가**: "이런 느낌으로" 설명 시간 단축
- **AI 활용 극대화**: Claude vision 기능을 통한 자동 분석

### 3.6 Priority & Status

| Item | Value |
|------|-------|
| Priority | Medium |
| Complexity | Low |
| Status | Proposed |
| Related Issue | - |

---

## 4. Feature Request - AI Model Fallback Strategy

### 4.1 AI Model Strengths

각 AI 모델별 강점을 정의하여 스테이지별 최적 활용을 권장

| AI Model | 강점 | 최적 활용 |
|----------|------|----------|
| Claude | 정확한 코드 생성, 논리 분석, 안정성 | 구현, QA, 배포 |
| Gemini | 창의적 아이디어, 빠른 탐색, 멀티모달 | 브레인스토밍, 기획 |
| Codex | 심층 분석, 리팩토링, 테스트 | 리팩토링, 테스팅 |

### 4.2 Stage-Model Mapping

스테이지별 Primary 모델과 Fallback 모델 정의

| Stage | Primary Model | Fallback |
|-------|---------------|----------|
| 01-brainstorm | Gemini | Claude |
| 02-research | Claude | Gemini |
| 03-planning | Gemini | Claude |
| 04-ui-ux | Gemini | Claude |
| 05-task-management | Claude | - |
| 06-implementation | Claude | - |
| 07-refactoring | Codex | Claude |
| 08-qa | Claude | - |
| 09-testing | Codex | Claude |
| 10-deployment | Claude | - |

### 4.3 Fallback Rules

#### 자동 전환 조건
- Primary 모델 API 응답 실패 시
- Primary 모델 Rate Limit 도달 시
- Primary 모델 응답 품질이 threshold 미달 시

#### Fallback 원칙
- **Claude는 Universal Fallback**: 모든 스테이지에서 기본 대체 모델로 사용
- **단일 Fallback 체인**: Primary → Claude (2단계만 유지, 복잡성 최소화)
- **Fallback 로깅**: 모든 Fallback 전환은 HANDOFF.md에 기록

#### Configuration Example (`config/mcp_fallbacks.yaml`)
```yaml
fallback_strategy:
  default_fallback: claude
  auto_switch: true
  retry_count: 2

  stage_overrides:
    01-brainstorm:
      primary: gemini
      fallback: claude
    07-refactoring:
      primary: codex
      fallback: claude
```

### 4.4 Priority & Status

| Item | Value |
|------|-------|
| Priority | High |
| Complexity | Medium |
| Status | Proposed |
| Related Config | `config/mcp_fallbacks.yaml` |