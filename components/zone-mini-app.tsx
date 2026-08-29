"use client";

import { useEffect } from "react";
import type { Block } from "@/lib/types";
import { OrderMiniApp } from "@/components/order-mini-app";
import { DjMiniApp } from "@/components/dj-mini-app";

const ROLE_TAG = { order: "주문 존", dj: "DJ 존" } as const;

/**
 * 미니앱 셸. 지도가 넘기는 것은 행사와 존뿐이고, 내용은 역할별 미니앱이 채운다.
 * 지도 위에 풀스크린으로 떠서 자기 헤더와 "‹ 지도" 복귀 동선을 가진다(앱인앱).
 * 새 존 종류(포토부스·투표 등)는 아래 분기에 미니앱을 하나 더 등록하면 생긴다.
 */
export function ZoneMiniApp({
  eventId,
  block,
  onClose,
}: {
  eventId: string;
  block: Block;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-cream"
      role="dialog"
      aria-modal="true"
      aria-label={block.name}
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <button type="button" onClick={onClose} className="text-sm text-muted">
          ‹ 지도
        </button>
        <h2 className="text-lg font-semibold tracking-tight">{block.name}</h2>
        {block.role && (
          <span className="ml-auto rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
            {ROLE_TAG[block.role]}
          </span>
        )}
      </header>
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col overflow-y-auto px-4 py-4">
        {block.role === "dj" ? (
          <DjMiniApp eventId={eventId} zone={block} />
        ) : (
          <OrderMiniApp eventId={eventId} zone={block} />
        )}
      </div>
    </div>
  );
}
