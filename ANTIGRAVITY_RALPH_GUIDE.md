# Antigravity + Ralph Loop 해커톤 가이드

> 출처: GDG Campus KR "IOEX hack the beat" 밋업, 김대현(Solutions Architect, MegazoneSoft) 발표
> "Antigravity 101" + Claude 채팅 정리
> 대상: Antigravity, Ralph Loop 둘 다 안 써본 사람

---

## 0. 30초 요약

- **Antigravity(agy)** = Google이 만든 코딩 에이전트 CLI/IDE. Claude Code, Codex랑 같은 급의 경쟁 제품.
- **Ralph Loop** = 코딩 에이전트한테 "구현 → 테스트 → 실패 분석 → 수정"을 사람 개입 없이 될 때까지 반복시키는 자동화 패턴.
- 근데 Antigravity는 원래 "세션을 계속 이어가는" 방식으로 설계돼서 Ralph Loop(매번 세션 죽여야 함)랑 **정면 충돌**함.
- 그래서 발표자가 이 둘을 화해시키는 스크립트(`ralph.sh`)를 만들어서 공유함 → 이 가이드가 그 내용 정리.
- 핵심 철학 하나: **"에이전트는 매번 기억을 잃는다"고 가정하고, 그 기억이 필요한 모든 것(위치·진행상황·규칙·완료기준)을 파일로 외부화해서 매번 다시 주입하라.**

---

## 1. 기본 개념부터

### 1-1. 에이전트 vs 스킬 vs AGENTS.md, 뭐가 다른가

| 구분 | 뭐하는 놈인가 | 비유 |
|---|---|---|
| **에이전트** | 스스로 판단·계획·실행하는 주체 (Claude Code, Antigravity 등) | 요리사 |
| **스킬** | 특정 작업 시 참고하는 지침서 한 장 (`SKILL.md`) | 레시피 카드 |
| **AGENTS.md / CLAUDE.md** | 프로젝트 전체에 항상 적용되는 컨텍스트 (스택, 컨벤션, 금지사항) | 신입 온보딩 문서 |

- 스킬은 **여러 개**, 필요할 때만 불려옴
- AGENTS.md는 **한 개**, 프로젝트 루트에, 항상 적용됨
- 해커톤처럼 시간 없을 땐 스킬 잔뜩 까는 것보다 **CLAUDE.md/AGENTS.md 한 장 잘 쓰는 게 투자 대비 효율 훨씬 좋음**

### 1-2. Antigravity란?

- Google이 만든 코딩 에이전트 도구. IDE + CLI(`agy`) + SDK로 구성.
- **강점 (Antigravity)**
  - 토큰 사용량 적음 (Gemini 3.7 Flash 기준 Sonnet 5의 1/4)
  - 속도 빠름 (Gemini 3.7 Flash 기준 GPT-5.6 대비 3배)
  - **학생은 무료** + Google AI Plus 요금제 혜택으로 Claude Sonnet/Opus, GPT-OSS 모델도 쓸 수 있음
  - 프로토타입 → CLI 반복 → SDK 배포까지 한 플랫폼에서 끝남
- **약점 (Claude Code, Codex 대비)**
  - 커스터마이징(CLAUDE.md, skill, hook)은 Claude Code가 더 강함 — Antigravity는 아직 커스텀 생태계 약함
  - 서드파티 연동/클라우드 작업 위임은 Codex가 앞섬 (Antigravity는 아직 Local 중심)

→ **해커톤 판단**: 가성비·속도·무료 모델 다양성이 필요하면 Antigravity, 세밀한 커스터마이징이나 클라우드 협업 연동이 중요하면 Claude Code/Codex.

---

## 2. Antigravity CLI 설치하고 써보기

### 2-1. 설치

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash
# → ~/.local/bin/agy 에 설치됨
```

다운로드 페이지: https://antigravity.google/download → "Antigravity CLI" 클릭해서 OS 맞는 버전 설치

### 2-2. 헬스체크 & 로그인

```bash
agy models         # 사용 가능한 모델 확인
agy -p "reply OK"   # health check (한 번 물어봐서 응답 오는지 테스트)
agy                 # Antigravity 실행 (여기서 로그인 진행)
```

- 로그인은 **Google 계정** or **GCP 프로젝트**로 연결
- 설정 저장 위치
  - **레포 단위**: `.agents/` (레포에 커밋하면 팀 전체가 공유 가능 → 해커톤 팀플레이에 유용)
  - **글로벌**: `~/.gemini/config/` (내 모든 프로젝트에 적용)

### 2-3. 기존 스킬/에이전트 가져다 쓰기

```bash
# 방법 1: 레포 URL로 바로 설치
agy plugin install https://github.com/addyosmani/agent-skills.git

# 방법 2: 로컬 클론 후 설치
git clone https://github.com/addyosmani/agent-skills.git
agy plugin install ./agent-skills

# 설치 확인
ls -l ~/.gemini/antigravity-cli/plugins/agent-skills/skills/
```

- CLI 안에서 `/agents` 입력하면 설치된 에이전트/스킬 목록이 뜨고 골라서 바로 호출 가능
- 예: `/agent-skills:code-review-and-quality` 처럼 슬래시 명령어로 스킬 호출

> ⚠️ 참고: 채팅에서 살펴봤던 `agentic-awesome-skills`(andy6609/sickn33 레포)처럼 스킬 2,000개 넘게 모아둔 대형 카탈로그도 있음. 근데 품질 편차가 크고 통짜로 깔면 컨텍스트 초과 위험 있으니 **해커톤에서는 필요한 스킬 1~2개만 골라서 설치하는 걸 추천**.

### 2-4. 내 스킬/에이전트 직접 만들기

1. 만들고 싶은 내용을 `SKILL.md` 파일로 작성 → `./gemini/skills/` 안에 폴더 만들어서 넣기
2. 또는 그냥 AGY한테 md 파일 내용을 복붙하면서 "이 내용 그대로 agy에서 쓸 수 있는 agent-skill 만들어줘"라고 지시 → 다 만든 후 agy 재시작

---

## 3. Ralph Loop란?

### 3-1. 개념

> 코딩 에이전트(Claude Code, Cursor 등)에게 작업을 맡긴 뒤, **"구현 → 테스트 → 실패 원인 분석 → 코드 수정"** 과정을 사람이 개입하지 않고 테스트를 통과할 때까지 `while`문으로 무한 자율 반복시키는 자동화 패턴.

**핵심 동작 원리**

1. AI Agent에게 구체적인 기능 요구사항 + 평가 기준(테스트 코드) 전달
2. AI가 코드 작성/수정
3. 정해진 검증 방식(pytest, npm test 등) 실행
4. 자율 피드백 루프
   - 성공(Pass) → 루프 종료
   - 실패(Fail) → 에러 로그를 다시 AI 컨텍스트에 주입하고 1번으로 복귀

원조 Ralph Loop의 정신은 이 한 줄:
```bash
while :; do cat PROMPT.md | amp --dangerously-allow-all; done
```
(참고: 원저자 abhishekbhakat의 ralph-loop-for-antigravity 레포)

### 3-2. 왜 Antigravity에서는 그대로 못 쓰나 — 3가지 충돌 지점

#### 충돌 ① 작업 경로(cwd) 문제

- Antigravity는 쉘의 cwd를 워크스페이스로 **상속하지 않음**
- Claude Code는 `cd repo && ralph.sh`만 하면 그 경로가 곧 워크스페이스가 되는데, `agy`는 그게 안 통함
- 프롬프트에 절대경로를 안 박으면 에이전트가 엉뚱한 곳에 산출물을 만들어버림

**해결**:
```bash
REPO="$(cd "$(dirname "$0")" && pwd)"
...
--add-dir "$REPO"
```
그리고 프롬프트 안에도 명시적으로 못박음:
```
The project directory is: $REPO
All file reads, file writes, and git commits MUST happen inside that exact directory.
```

#### 충돌 ② 세션 유지 vs 세션 죽이기

- Antigravity는 "에이전트 매니저"가 전면에 있는 제품이라 **세션을 이어가는 게(`--continue`) 기본 설계 원칙**
- 근데 Ralph Loop는 컨텍스트를 깨끗하게 유지하려고 **매 반복마다 세션을 완전히 죽여야** 함 → 정면 충돌

**해결**: `agy -p` 단발 호출만 사용 (세션 안 살림)
```bash
# ❌ Anti-Ralph — 세션이 살아있음
agy --continue

# ✅ Ralph — 매 반복 새 세션
agy -p "$PROMPT" --add-dir "$REPO"
```

세션을 안 살리는 대신, 컨텍스트(=기억)를 **3개 파일**로 외부화해서 대체함:
- `PRD.md` → 뭘 해야 하는지 (요구사항)
- `progress.txt` → 지금까지 뭘 했는지 (누적 로그)
- `git log` → 실제로 뭐가 반영됐는지 (객관적 증거)

#### 충돌 ③ 정지 포인트 문제

- Ralph는 사람 개입 없이 N회 반복되는 게 전제 → 한 반복이라도 사람 승인 기다리며 멈추면 루프 전체가 죽음
- 원조 Ralph Loop의 `--dangerously-allow-all` 하나가 하던 역할을, `agy`는 **실행 모드**와 **권한 승인**으로 나눠놔서 둘 다 줘야 함

**해결**:
```bash
--mode accept-edits --dangerously-skip-permissions --print-timeout 15m
```
- `--mode accept-edits` → 파일 수정 자동 승인
- `--dangerously-skip-permissions` → 권한 확인 스킵
- `--print-timeout 15m` → 한 호출이 무한정 안 매달리게 타임아웃

**보너스**: 모델명을 UI 표시 문자열 그대로 따옴표로 감싸서 넘기면, 같은 루프·같은 PRD로 **여러 벤더 모델을 바꿔가며 비교 실험** 가능:
```bash
RALPH_MODEL="Gemini 3.1 Pro (High)" bash ralph.sh
bash ralph.sh
```

---

## 4. Ralph Loop 6단계 (Agy 버전)

완전한 원조 Ralph는 아니고, 안정적으로 돌리기 위해 6단계로 구성:

1. **`PRD.md`에서 태스크를 읽는다**
2. **`progress.txt`로 진행 상황을 확인한다**
3. **딱 1개 태스크만 완료한다** ("딱 1개"가 핵심 — 욕심내면 망가짐)
4. **progress를 append한다** (← 절대 삭제 금지, 기존 내용 덮어쓰기 금지)
5. **Commit한다**
6. **전부 끝나거나 최대 반복 횟수 도달할 때까지 반복**

---

## 5. 필요한 파일 구성 (그대로 복사해서 쓸 것)

```
PRD.md         # Task + Agent 동작 규칙
progress.txt   # append-only 로그
ralph.sh       # 루프 러너 (실제 반복문 스크립트)
.git/          # 필수 — commit log
```

### PRD 작성 원칙 (태스크 규모 무관 공통, 매우 중요)

1. **태스크마다 "Done when:" 검증 기준을 반드시 붙인다**
   → 없으면 에이전트가 자기 마음대로 완료 처리해버림

2. **운영 규칙은 프롬프트가 아니라 PRD 안에 둔다**
   → 프롬프트에만 있으면 새 세션이 요약본만 받지만, PRD 안에 있으면 매 반복마다 원문 그대로 다시 읽음

3. **태스크는 한 세션에 끝날 크기로 쪼갠다**
   → 세션 경계를 넘는 큰 태스크는 Ralph Loop에서 여러 번 반복해서 계속 돌 수도 있음

4. **암묵적 맥락을 전부 문서화한다**
   → 사람은 당연히 아는 배경지식이라도 에이전트는 매번 새로 태어나니까 아무것도 모름. 다 적어야 함

---

## 6. Ralph Loop 기본 스크립트 골격 (다른 프로젝트로 이식할 때 이 형태 유지)

```bash
REPO="$(cd "$(dirname "$0")" && pwd)"          # 절대경로 확보

for i in $(seq 1 "$MAX_ITERS"); do
  before=$(진전지표 측정)                        # 체크 수 + git HEAD

  agy -p "$PROMPT" --model "$MODEL" --add-dir "$REPO" \
      --mode accept-edits --dangerously-skip-permissions \
      --print-timeout 15m

  rc=$?
  after=$(진전지표 측정)

  센티널 있으면 → 정상 종료
  rc / (after-before) 로 판정 → stall 카운트
  연속 N회 stall → abort
  백오프
done
```

**핵심 아이디어**
- `before`/`after`로 "진전이 있었는지"를 측정 (커밋 수, git HEAD 변화 등)
- 진전이 없이 계속 stall(제자리걸음) 나면 → 연속 N회 후 강제 abort
- 무한정 폭주하는 걸 막는 안전장치가 이미 스크립트 레벨에 내장됨

---

## 7. 해커톤을 위한 실전 꿀팁 (발표자 결론)

### 꿀팁 ① Status는 파일과 git에 저장, Context(LLM 기억)에 두지 마라

- 진행 상황은 LLM의 Context Window가 아니라 **File & git 히스토리**로 관리하는 게 Ralph의 핵심
- `PROMPT.md` + `fix_plan.md`(또는 `progress.md`)를 루프가 무조건 그대로 진행하게 둔다
- **매 이터레이션마다 커밋을 강제**한다 → Loop가 폭주해도 git으로 되돌리면(revert) 되니까 안전장치가 됨
- **최대 이터레이션 수로 상한선을 걸어둔다** ("내 토큰은 소중하니까" — 무한 반복되면 비용도 무한대로 나감)

### 꿀팁 ② Prompt를 잘 쓰고, 종료 조건을 명확히 판단하라

- Ralph Loop를 돌리면 LLM은 md 파일의 요구사항을 보고 작업하는데, **요구사항의 품질이 산출물의 퀄리티를 만든다**
- `PROMPT.md`(또는 `PRD.md`)에 **완료 조건(Definition of Done)을 테스트 가능한 문장**으로 명시
- 테스트 스위트 통과, 빌드 성공 같은 **판정 가능한(모호하지 않은) 조건**을 탈출 조건으로 걸기

**예시**
- ❌ "로그인 되게 해줘" (모호함 → 에이전트가 자기 기준으로 끝냈다고 판단해버림)
- ✅ "npm test 통과 + /login POST 200 반환" (참/거짓으로 명확히 판별 가능)

---

## 8. 실제 테스트 레포 (참고용)

발표자가 공유한 실제 동작하는 테스트 레포:
👉 https://github.com/GDGCampusKorea/antigravity-ralph-loop-test

여기 들어가면 `ralph.sh`, `PRD.md` 등 실제 파일 구조를 그대로 확인 가능. 해커톤에서 그대로 복사해서 프로젝트에 맞게 커스터마이징하면 됨.

---

## 9. 한 장 요약 체크리스트 (해커톤 당일 이대로 따라하기)

- [ ] `agy` 설치 & health check 완료
- [ ] 프로젝트 루트에 `PRD.md` 작성 — 태스크별 "Done when:" 조건 필수 명시
- [ ] `progress.txt` 빈 파일로 생성 (append-only 로그용)
- [ ] `.git/` init 되어있는지 확인
- [ ] `ralph.sh` 스크립트 복사 (섹션 6 골격 참고, 위 테스트 레포에서 가져와도 됨)
- [ ] 스크립트 안에 `--add-dir "$REPO"` 절대경로 처리 들어가 있는지 확인
- [ ] `--mode accept-edits --dangerously-skip-permissions --print-timeout 15m` 다 들어가 있는지 확인
- [ ] `MAX_ITERS` 최대 반복 횟수 상한 설정 (토큰 아끼기)
- [ ] 프롬프트/PRD에 "완료 조건"을 테스트 가능한 문장으로 작성했는지 재확인
- [ ] (선택) 여러 모델 비교하고 싶으면 `RALPH_MODEL="..."` 환경변수로 스왑

---

## 10. 전체를 관통하는 한 줄 원칙

> **에이전트의 내부 상태(메모리·세션·경로 추론)를 믿지 말고, 매번 외부 파일과 명시적 인자로 상태를 강제 주입하라.**

이 원칙이 경로 처리, 진행상황 관리, 세션 정책, 정지 포인트 제거까지 이 가이드의 모든 결정을 관통하는 핵심 아이디어임.
