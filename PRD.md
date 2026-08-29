# PRD: Sungnam Alumni Party OS - QR Zone Instant Balance Game

> Project Directory: `/Users/andy6609/projects/hackthebeat`

## Core Rules for Agent

1. All code edits, file reads, and git commits MUST be inside `/Users/andy6609/projects/hackthebeat`.
2. Read `progress.txt` before starting work.
3. Complete EXACTLY ONE task per iteration.
4. Append completed task log to `progress.txt` (NEVER overwrite or clear previous logs).
5. Create a git commit after each task completion.
6. When all tasks are completed, output sentinel string: `ALL_TASKS_COMPLETED`

---

## Tasks

### Task 1: TypeScript Types & Zone Game Data Helper
- Create `types/game.ts` for Zone, Room, Question, Vote, and Supabase Realtime types.
- Create `lib/game.ts` with 3 predefined party zones (`bar`, `balcony`, `living`) and balance questions for each zone.
- **Done when:** `types/game.ts` and `lib/game.ts` exist and compile cleanly with `npm run typecheck`.

### Task 2: Landing Page & Zone Selection Map
- Update `app/page.tsx` to display Party Zone Map (Bar, Balcony, Living Room) with QR scan simulator links.
- Update `app/styles.css` with responsive dark party theme styling.
- **Done when:** `app/page.tsx` renders 3 zone cards cleanly and `npm run build` succeeds.

### Task 3: Zone Entry & Room Creation Page
- Create `app/zone/[zoneId]/page.tsx` allowing user to select a Zone and either "Create New Room (Host)" or "Join Room Code (Player)".
- **Done when:** Navigating to `/zone/bar` shows Room creation form with code generation and redirect.

### Task 4: Real-time Player Voting Page
- Create `app/room/[code]/play/page.tsx` for mobile player view.
- Connect to Supabase Realtime channel (`room-[code]`) to broadcast votes (Option A vs Option B).
- **Done when:** Player can select A or B and broadcast event via Supabase Realtime.

### Task 5: Real-time Host Display Page
- Create `app/room/[code]/host/page.tsx` for Host / Big Screen view.
- Subscribe to Supabase Realtime channel (`room-[code]`) to render live vote counters, percentage bars, and winner reveal card.
- **Done when:** Host view listens to votes and updates real-time counts on screen.

### Task 6: Final Verification & Build
- Run `npm run typecheck` and `npm run build`.
- Commit all remaining changes to git.
- **Done when:** `npm run build` exits with code 0 and `ALL_TASKS_COMPLETED` sentinel is emitted.
