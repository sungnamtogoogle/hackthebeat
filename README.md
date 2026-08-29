# Hack the Beat: 네모네모 맵

행사장 도면을 블록으로 그리면, 참가자는 QR 하나로 들어와 지도에서 바로 주문하고 신청곡을 넣는 서비스. 해커톤 MVP.

- 화면 명세: https://claude.ai/code/artifact/313dea34-c5fe-452a-a75f-0a4586911c12
- 에디터·참가자 프로토타입: https://claude.ai/code/artifact/e4d601da-956e-4c53-b0d4-3fb299314854
- 디자인 시스템: `design.md` (크림·차콜, 두 굵기 400/600, 테두리로 구획)
- 배포: `DEPLOYMENT.md`, `DEPLOYMENT_RESULT.md` (Vercel + Supabase Postgres, 확인은 `/api/health`)

## 실행

```bash
npm install
npm run dev
```

## 화면 라우트

| 라우트 | 화면 | 대상 |
|---|---|---|
| `/` | 랜딩 | 공용 |
| `/e/[eventId]` | 지도 홈 | 참가자, 모바일 |
| `/e/[eventId]/me` | 내 주문 | 참가자, 모바일 |
| `/admin` | 로그인·행사 목록 | 주최자, PC |
| `/admin/[eventId]/map` | 도면 에디터 | 주최자, PC |
| `/admin/[eventId]/live` | 운영 대시보드 | 주최자, PC·태블릿 |
| `/api/health` | DB 연결 확인 | 배포 검증용 |

## 지금은 프레임이다

라우트와 레이아웃, 도메인 타입(`lib/types.ts`), 도면 렌더러(`components/map-canvas.tsx`)까지만 있다. 비워둔 것은 코드의 `TODO`로 표시했다.

- 에디터 편집 인터랙션: 프로토타입(위 링크)에서 옮겨온다.
- 존 바텀시트(주문·신청곡), 실시간 갱신, 매직링크 로그인, QR 발행.
- 스키마: 지금 마이그레이션에는 데모용 `party_registrations`만 있다. events·orders·song_requests 테이블은 미정.

주문 상태 머신(접수 → 준비중 → 픽업대기 → 완료)은 `lib/types.ts`가 정본이다.

## DB 접근 방식

서버 전용 클라이언트는 `lib/db.ts`다(SUPABASE_URL + service role key, 서버에서만). 데모 랜딩이 쓰던 참가 신청 폼(`components/party-join-form.tsx`, `app/actions.ts`)과 `app/styles.css`는 배포 검증 이력용으로 남겨뒀고 현재 화면에서는 쓰지 않는다. 클라이언트 실시간(Realtime)을 붙일 때 anon key와 RLS를 추가한다.
