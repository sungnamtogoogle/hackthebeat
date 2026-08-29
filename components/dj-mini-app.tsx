"use client";

import { useEffect, useState } from "react";
import type { Block, SongRequest } from "@/lib/types";
import {
  SONG_PENDING_LIMIT,
  addSong,
  getSessionId,
  loadNowPlaying,
  loadSongs,
  songCooldownLeft,
  subscribe,
} from "@/lib/store";

/**
 * DJ 미니앱. 팀 결정: 사람 DJ + 신청 보드 모델.
 * 참가자는 자유 텍스트로 신청하고, 재생과 now playing 갱신은 DJ가
 * 운영 대시보드에서 한다. 도배 방어: 세션당 대기 2곡, 신청 사이 60초.
 */
export function DjMiniApp({ eventId, zone }: { eventId: string; zone: Block }) {
  const [songs, setSongs] = useState<SongRequest[]>([]);
  const [now, setNow] = useState("");
  const [me, setMe] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const load = () => {
      setMe(getSessionId());
      setSongs(loadSongs(eventId));
      setNow(loadNowPlaying(eventId));
    };
    load();
    return subscribe(load);
  }, [eventId]);

  useEffect(() => {
    const tick = () => setCooldown(songCooldownLeft(eventId));
    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [eventId]);

  const queue = songs.filter((s) => s.zoneId === zone.id);
  const myPending = me ? queue.filter((s) => s.sessionId === me).length : 0;
  const blockReason =
    myPending >= SONG_PENDING_LIMIT
      ? `대기 중 신청은 ${SONG_PENDING_LIMIT}곡까지예요`
      : cooldown > 0
        ? `다음 신청까지 ${Math.ceil(cooldown / 1000)}초`
        : null;

  function submit() {
    const t = title.trim();
    if (!t || blockReason) return;
    addSong(eventId, zone.id, t);
    setTitle("");
  }

  return (
    <>
      <div className="card flex items-center gap-3 px-4 py-3">
        <span aria-hidden className="text-lg">🎶</span>
        <div>
          <p className="text-xs text-muted">지금 나오는 곡</p>
          <p className="text-[15px] font-semibold">
            {now || "아직 재생 정보가 없어요"}
          </p>
        </div>
      </div>

      <p className="mt-5 mb-1 text-xs font-semibold tracking-wide text-muted">
        다음 신청곡 {queue.length > 0 && `· ${queue.length}곡 대기`}
      </p>
      {queue.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">
          아직 신청곡이 없다. 첫 곡을 넣어보라.
        </p>
      )}
      {queue.map((s, i) => (
        <div
          key={s.id}
          className="flex items-center gap-3 border-b border-line py-2.5 text-sm"
        >
          <span className="w-4 text-xs text-muted">{i + 1}</span>
          <span>{s.title}</span>
          {me === s.sessionId && (
            <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">
              내 신청
            </span>
          )}
        </div>
      ))}

      <div className="mt-auto pt-4">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="신청곡 제목"
            aria-label="신청곡 제목"
            className="min-w-0 flex-1 rounded-md border border-line bg-off-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            type="button"
            className="btn btn-dark disabled:opacity-40"
            disabled={!title.trim() || blockReason !== null}
            onClick={submit}
          >
            신청
          </button>
        </div>
        <p className="mt-2 h-4 text-center text-xs text-muted">{blockReason}</p>
      </div>
    </>
  );
}
