"use client";

import { useEffect, useState } from "react";
import type { Block, Order } from "@/lib/types";
import {
  activeOrder,
  aheadCount,
  getSessionId,
  loadOrders,
  placeOrder,
  setOrderStatus,
  subscribe,
} from "@/lib/store";

/**
 * 주문 미니앱. 메뉴 담기 → 주문 → 대기표(접수 → 완성 → 전달) 흐름.
 * 세션당 미처리 주문이 1건이라, 진행 중 주문이 있으면 메뉴 대신 대기표를 보인다.
 */
export function OrderMiniApp({
  eventId,
  zone,
}: {
  eventId: string;
  zone: Block;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = () => {
      setMe(getSessionId());
      setOrders(loadOrders(eventId));
    };
    load();
    return subscribe(load);
  }, [eventId]);

  const mine = me ? activeOrder(orders, me) : null;
  if (mine) {
    return <Ticket eventId={eventId} order={mine} orders={orders} />;
  }

  const menu = zone.menu ?? [];
  const total = Object.values(qty).reduce((a, b) => a + b, 0);

  function bump(name: string, delta: number) {
    setQty((q) => ({ ...q, [name]: Math.max(0, (q[name] ?? 0) + delta) }));
  }

  function submit() {
    const items = menu
      .filter((m) => (qty[m.name] ?? 0) > 0)
      .map((m) => ({ name: m.name, qty: qty[m.name] }));
    if (items.length === 0) return;
    placeOrder(eventId, zone, items);
    setQty({});
  }

  return (
    <>
      {menu.length === 0 && (
        <p className="py-16 text-center text-sm text-muted">
          이 존에 등록된 메뉴가 아직 없다.
        </p>
      )}
      {menu.map((m) => (
        <div
          key={m.name}
          className={`flex items-center gap-3 border-b border-line py-3 ${m.soldOut ? "opacity-45" : ""}`}
        >
          <div>
            <p className="text-[15px]">{m.name}</p>
            {m.price != null && (
              <p className="text-xs text-muted">{m.price.toLocaleString()}원</p>
            )}
          </div>
          {m.soldOut ? (
            <span className="ml-auto rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
              품절
            </span>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label={`${m.name} 빼기`}
                className="h-8 w-8 rounded-md border border-line bg-off-white"
                onClick={() => bump(m.name, -1)}
              >
                −
              </button>
              <span className="min-w-5 text-center text-sm font-semibold">
                {qty[m.name] ?? 0}
              </span>
              <button
                type="button"
                aria-label={`${m.name} 담기`}
                className="h-8 w-8 rounded-md border border-line bg-off-white"
                onClick={() => bump(m.name, 1)}
              >
                +
              </button>
            </div>
          )}
        </div>
      ))}
      {menu.length > 0 && (
        <button
          type="button"
          disabled={total === 0}
          onClick={submit}
          className="btn btn-dark mt-auto w-full disabled:opacity-40"
        >
          {total > 0 ? `주문하기 (${total}개)` : "메뉴를 담아보세요"}
        </button>
      )}
    </>
  );
}

const STEPS = [
  { status: "placed", label: "접수" },
  { status: "ready", label: "완성" },
  { status: "done", label: "전달" },
] as const;

function Ticket({
  eventId,
  order,
  orders,
}: {
  eventId: string;
  order: Order;
  orders: Order[];
}) {
  const stepIndex = order.status === "placed" ? 0 : 1;
  const ahead = aheadCount(orders, order);

  return (
    <div className="flex flex-1 flex-col items-center pt-10 text-center">
      <p className="text-[15px] font-semibold">
        {order.status === "ready" ? "🔔 받으러 오세요!" : "주문이 들어갔어요"}
      </p>
      <p className="display mt-2 text-5xl">No.{order.no}</p>
      <p className="mt-2 text-sm text-muted">
        {order.status === "ready"
          ? `${order.zoneName}에서 기다려요`
          : `내 앞 ${ahead}팀`}
      </p>

      <div className="mt-8 flex items-start">
        {STEPS.map((s, i) => (
          <div key={s.status} className="flex items-start">
            {i > 0 && <div className="mt-1.5 h-px w-9 bg-(--line-strong)" />}
            <div
              className={`flex w-14 flex-col items-center gap-1.5 text-xs ${i <= stepIndex ? "font-semibold" : "text-muted"}`}
            >
              <span
                className={`h-3 w-3 rounded-full border ${i <= stepIndex ? "border-charcoal bg-charcoal" : "border-(--line-strong) bg-off-white"}`}
              />
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <p className="card mt-8 px-4 py-3 text-xs text-muted">
        완성되면 이 화면이 바뀌고, 번호로도 불러드려요.
      </p>

      {order.status === "placed" && (
        <button
          type="button"
          className="btn btn-ghost mt-auto mb-2 w-full"
          onClick={() => setOrderStatus(eventId, order.id, "canceled")}
        >
          주문 취소
        </button>
      )}
    </div>
  );
}
