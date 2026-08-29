"use client";

import type { Block } from "@/lib/types";

const CELL = 40;

/**
 * 참가자 지도 렌더러. 색 혈통은 행사장 원본 SVG를 따른다: 활성 존 #efe4ff/#6b3fd6.
 * 라벨은 폰 폭 기준으로 잡는다. 1200 좌표계가 390px 화면에서 1/3로 줄므로
 * 활성 존은 26/20px(화면 약 8~9px)로 키우고, 작은 일반 공간 라벨은 감춘다.
 * 에디터는 자기 렌더링(map-editor.tsx)을 따로 가진다. PC 전제라 규칙이 다르다.
 */
export function MapCanvas({
  blocks,
  onZoneTap,
}: {
  blocks: Block[];
  onZoneTap?: (block: Block) => void;
}) {
  return (
    <svg
      viewBox="0 0 1200 720"
      role="img"
      aria-label="행사장 도면"
      className="block h-auto w-full select-none"
    >
      <rect
        x="40" y="40" width="1120" height="640" rx="4"
        fill="none" stroke="rgba(28,28,28,0.4)" strokeWidth="2.5"
      />
      {blocks.map((b) => {
        const active = b.role !== null;
        const X = b.x * CELL;
        const Y = b.y * CELL;
        const W = b.w * CELL;
        const H = b.h * CELL;
        const area = b.w * b.h;
        const fontSize = active ? (area >= 15 ? 26 : 20) : area >= 8 ? 15 : 0;
        return (
          <g
            key={b.id}
            onClick={active && onZoneTap ? () => onZoneTap(b) : undefined}
            className={active && onZoneTap ? "cursor-pointer" : undefined}
          >
            <rect
              x={X} y={Y} width={W} height={H} rx={4}
              fill={active ? "#efe4ff" : "#fcfbf8"}
              stroke={active ? "#6b3fd6" : "#eceae4"}
              strokeWidth={active ? 2.5 : 1.5}
            />
            {fontSize > 0 && (
              <text
                x={X + W / 2} y={Y + H / 2} dy=".35em" textAnchor="middle"
                fontSize={fontSize}
                fontWeight={active ? 600 : 400}
                fill={active ? "#1c1c1c" : "#5f5f5d"}
                style={{ pointerEvents: "none" }}
              >
                {b.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
