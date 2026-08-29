"use client";

import { useEffect, useState } from "react";
import { MapCanvas } from "@/components/map-canvas";
import { SAMPLE_BLOCKS } from "@/lib/sample-map";
import { blocksStorageKey } from "@/lib/map";
import type { Block } from "@/lib/types";

/**
 * 참가자 지도. 에디터가 임시 저장한 도면을 읽고, 없으면 샘플 도면을 그린다.
 * storage 이벤트를 들어 같은 브라우저의 다른 탭에서 편집해도 따라 바뀐다.
 * TODO: events 테이블 조회로 바꾼다(스키마 확정 후). 존 탭 → 바텀시트 연결.
 */
export function MapView({ eventId }: { eventId: string }) {
  const [blocks, setBlocks] = useState<Block[]>(SAMPLE_BLOCKS);

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

  return <MapCanvas blocks={blocks} />;
}
