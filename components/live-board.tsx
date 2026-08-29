"use client";

import { useEffect, useState } from "react";
import {
  NEXT_ORDER_ACTION,
  NEXT_ORDER_STATUS,
  ORDER_STATUS_LABEL,
  type Order,
  type SongRequest,
} from "@/lib/types";
import {
  loadNowPlaying,
  loadOrders,
  loadSongs,
  removeSong,
  setNowPlaying,
  setOrderStatus,
  subscribe,
} from "@/lib/store";

/**
 * 운영 대시보드 보드. 주문은 접수 → 완성(호출) → 전달완료 두 번의 버튼으로
 * 처리하고, DJ 보드에서 "틀기"를 누르면 그 곡이 now playing이 되며 큐에서
 * 빠진다. 스토어 구독으로 참가자 탭과 실시간처럼 동기화된다.
 * TODO: 신규 주문 소리 알림, 존별 필터, 품절 토글 바로가기.
 */
export function LiveBoard({ eventId }: { eventId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [songs, setSongs] = useState<SongRequest[]>([]);
  const [now, setNow] = useState("");

  useEffect(() => {
    const load = () => {
      setOrders(loadOrders(eventId));
      setSongs(loadSongs(eventId));
      setNow(loadNowPlaying(eventId));
    };
    load();
    return subscribe(load);
  }, [eventId]);

  const columns = [
    {
      title: "접수",
      list: orders.filter((o) => o.status === "placed").sort((a, b) => a.no - b.no),
    },
    {
      title: "완성 · 호출",
      list: orders.filter((o) => o.status === "ready").sort((a, b) => a.no - b.no),
    },
    {
      title: "끝난 주문",
      list: orders
        .filter((o) => o.status === "done" || o.status === "canceled")
        .sort((a, b) => b.no - a.no),
    },
  ];

  return (
    <>
      <section aria-label="주문 상태 보드" className="grid gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title} className="card p-4">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <h2 className="text-lg font-semibold">{col.title}</h2>
              <span className="text-sm text-muted">{col.list.length}건</span>
            </div>
            {col.list.length === 0 && (
              <p className="py-10 text-center text-sm text-muted">
                이 상태의 주문이 없다.
              </p>
            )}
            {col.list.map((o) => {
              const closed = o.status === "done" || o.status === "canceled";
              const next = NEXT_ORDER_STATUS[o.status];
              return (
                <div
                  key={o.id}
                  className={`border-b border-line py-3 ${closed ? "opacity-45" : ""}`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold tracking-tight">No.{o.no}</span>
                    <span className="text-xs text-muted">{o.zoneName}</span>
                    {closed && (
                      <span className="ml-auto text-xs text-muted">
                        {ORDER_STATUS_LABEL[o.status]}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {o.items.map((it) => `${it.name} ${it.qty}`).join(" · ")}
                  </p>
                  {next && (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        className="btn btn-dark px-3 py-1 text-sm"
                        onClick={() => setOrderStatus(eventId, o.id, next)}
                      >
                        {NEXT_ORDER_ACTION[o.status]}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost px-3 py-1 text-sm"
                        onClick={() => setOrderStatus(eventId, o.id, "canceled")}
                      >
                        취소
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <section aria-label="DJ 신청 보드" className="card mt-6 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
          <h2 className="text-lg font-semibold">DJ 신청 보드</h2>
          <span className="text-sm text-muted">
            지금 트는 중: {now || "없음"}
          </span>
        </div>
        {songs.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            아직 신청곡이 없다. DJ 존에서 신청하면 여기로 쌓인다.
          </p>
        )}
        {songs.map((s, i) => (
          <div
            key={s.id}
            className="flex items-center gap-3 border-b border-line py-2.5 text-sm"
          >
            <span className="w-4 text-xs text-muted">{i + 1}</span>
            <span>{s.title}</span>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                className="btn btn-dark px-3 py-1 text-sm"
                onClick={() => {
                  setNowPlaying(eventId, s.title);
                  removeSong(eventId, s.id);
                }}
              >
                틀기
              </button>
              <button
                type="button"
                className="btn btn-ghost px-3 py-1 text-sm"
                onClick={() => removeSong(eventId, s.id)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
