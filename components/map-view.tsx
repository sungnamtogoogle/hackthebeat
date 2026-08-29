"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapCanvas } from "@/components/map-canvas";
import { ZoneMiniApp } from "@/components/zone-mini-app";
import { SAMPLE_BLOCKS } from "@/lib/sample-map";
import { blocksStorageKey } from "@/lib/map";
import {
  activeOrder,
  aheadCount,
  getSessionId,
  loadOrders,
  subscribe,
} from "@/lib/store";
import type { Block, Order } from "@/lib/types";

/**
 * 참가자 지도. 에디터가 임시 저장한 도면을 읽고, 없으면 샘플 도면을 그린다.
 * 존을 누르면 역할별 미니앱이 풀스크린으로 뜨고(앱인앱), 진행 중 주문이
 * 있으면 하단 뱃지가 대기 현황을 실시간으로 보여준다.
 * TODO: events 테이블 조회로 바꾼다(스키마 확정 후).
 */
export function MapView({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>(SAMPLE_BLOCKS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [openZone, setOpenZone] = useState<Block | null>(null);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(blocksStorageKey(eventId));
        if (raw) setBlocks(JSON.parse(raw));
      } catch {
        // 저장본이 없거나 깨졌으면 샘플 도면을 유지한다.
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, [eventId]);

  useEffect(() => {
    const load = () => {
      setMe(getSessionId());
      setOrders(loadOrders(eventId));
    };
    load();
    return subscribe(load);
  }, [eventId]);

  const mine = me ? activeOrder(orders, me) : null;

  function openMyOrderZone() {
    if (!mine) return;
    const zone = blocks.find((b) => b.id === mine.zoneId);
    if (zone) setOpenZone(zone);
    else router.push(`/e/${eventId}/me`);
  }

  return (
    <>
      <MapCanvas blocks={blocks} onZoneTap={setOpenZone} />
      {mine && !openZone && (
        <button
          type="button"
          onClick={openMyOrderZone}
          className="btn btn-dark fixed bottom-5 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap text-sm"
        >
          {mine.status === "ready"
            ? `🔔 No.${mine.no} 받으러 오세요!`
            : `No.${mine.no} 접수됨 · 내 앞 ${aheadCount(orders, mine)}팀`}
        </button>
      )}
      {openZone && (
        <ZoneMiniApp
          eventId={eventId}
          block={openZone}
          onClose={() => setOpenZone(null)}
        />
      )}
    </>
  );
}
