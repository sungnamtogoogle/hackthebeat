"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ORDER_STATUS_LABEL, type Order } from "@/lib/types";
import {
  aheadCount,
  getSessionId,
  loadOrders,
  setOrderStatus,
  subscribe,
} from "@/lib/store";

/** 내 주문 목록. 익명 세션으로 조회하고 스토어 구독으로 실시간 갱신한다. */
export function MyOrders({ eventId }: { eventId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      setMe(getSessionId());
      setOrders(loadOrders(eventId));
    };
    load();
    return subscribe(load);
  }, [eventId]);

  const mine = orders
    .filter((o) => o.sessionId === me)
    .sort((a, b) => b.no - a.no);

  if (mine.length === 0) {
    return (
      <div className="card mt-4 px-6 py-12 text-center">
        <p className="text-lg">아직 주문이 없다.</p>
        <p className="mt-1 text-sm text-muted">
          지도에서 존을 눌러 첫 주문을 넣어보라.
        </p>
        <Link href={`/e/${eventId}`} className="btn btn-ghost mt-6">
          지도로 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {mine.map((o) => {
        const ready = o.status === "ready";
        const closed = o.status === "done" || o.status === "canceled";
        return (
          <div
            key={o.id}
            className={`card p-4 ${closed ? "opacity-50" : ""}`}
            style={ready ? { borderColor: "var(--zone-stroke)" } : undefined}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight">
                No.{o.no}
              </span>
              <span className="text-xs text-muted">{o.zoneName}</span>
              <span className="ml-auto rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                {ORDER_STATUS_LABEL[o.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {o.items.map((it) => `${it.name} ${it.qty}`).join(" · ")}
            </p>
            {ready && (
              <p className="mt-2 text-sm font-semibold">
                🔔 받으러 오세요! {o.zoneName}에서 기다려요.
              </p>
            )}
            {o.status === "placed" && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted">
                  내 앞 {aheadCount(orders, o)}팀
                </span>
                <button
                  type="button"
                  className="text-xs text-muted underline"
                  onClick={() => setOrderStatus(eventId, o.id, "canceled")}
                >
                  주문 취소
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
