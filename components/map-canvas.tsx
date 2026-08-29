"use client";

import type { Block } from "@/lib/types";

const CELL = 40;

/**
 * 도면 렌더러. 팀원들의 격자 도면 위에 활성 존 파티 게임 모드를 직관적으로 시각화합니다.
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
        const active = b.role !== null || Boolean(b.gameId);
        const X = b.x * CELL;
        const Y = b.y * CELL;
        const W = b.w * CELL;
        const H = b.h * CELL;
        const area = b.w * b.h;
        const fontSize = area >= 15 ? 18 : area >= 6 ? 13 : 11;
        return (
          <g
            key={b.id}
            onClick={active && onZoneTap ? () => onZoneTap(b) : undefined}
            className={active && onZoneTap ? "cursor-pointer group" : undefined}
          >
            <rect
              x={X} y={Y} width={W} height={H} rx={6}
              fill={active ? "#f3e8ff" : "#fcfbf8"}
              stroke={active ? "#9333ea" : "#eceae4"}
              strokeWidth={active ? 2.5 : 1.5}
              className={active ? "transition-colors group-hover:fill-purple-200" : undefined}
            />
            <text
              x={X + W / 2} y={Y + H / 2} dy=".35em" textAnchor="middle"
              fontSize={fontSize}
              fontWeight={active ? "bold" : "normal"}
              fill={active ? "#581c87" : "#5f5f5d"}
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
