"use client";

import type { Block } from "@/lib/types";

const CELL = 40;

/**
 * 도면 렌더러. 에디터와 참가자 화면이 같은 블록 목록을 이 컴포넌트로 그린다.
 * 색 혈통은 행사장 원본 SVG를 따른다: 활성 존 #efe4ff/#6b3fd6.
 * TODO: 참가자의 존 탭 → 바텀시트 연결, 에디터의 드래그 편집(프로토타입에서 이식).
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
        const fontSize = area >= 15 ? 20 : area >= 6 ? 14 : 11;
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
            <text
              x={X + W / 2} y={Y + H / 2} dy=".35em" textAnchor="middle"
              fontSize={fontSize}
              fill={active ? "#1c1c1c" : "#5f5f5d"}
              style={{ pointerEvents: "none" }}
            >
              {b.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
