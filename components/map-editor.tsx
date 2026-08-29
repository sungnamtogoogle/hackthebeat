"use client";

import { useEffect, useRef, useState } from "react";
import type { Block, ZoneRole } from "@/lib/types";
import { SAMPLE_BLOCKS } from "@/lib/sample-map";
import { CELL, GRID, VIEW_H, VIEW_W, blocksStorageKey } from "@/lib/map";

/**
 * 도면 에디터. 프로토타입의 인터랙션을 이식했다:
 * 빈 곳을 끌면 블록 생성, 블록은 끌어서 이동, 선택하면 이름·역할 편집.
 * 저장은 브라우저 임시 저장이고 서버 저장은 TODO(스키마 미정).
 * TODO: 존 인스펙터에서 메뉴 편집(이름·가격·품절), 블록 크기조절 핸들, 실행취소.
 */

type DragState =
  | { mode: "move"; id: string; ox: number; oy: number }
  | { mode: "draw"; ax: number; ay: number; bx: number; by: number };

const ROLE_OPTIONS: { value: ZoneRole | null; label: string }[] = [
  { value: null, label: "일반 공간" },
  { value: "order", label: "주문 존" },
  { value: "dj", label: "DJ 존" },
];

const FRAME_W = (GRID.maxX - GRID.minX + 1) * CELL;
const FRAME_H = (GRID.maxY - GRID.minY + 1) * CELL;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function MapEditor({ eventId }: { eventId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [blocks, setBlocks] = useState<Block[]>(() =>
    SAMPLE_BLOCKS.map((b) => ({ ...b })),
  );
  const [selId, setSelId] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const skipSave = useRef(true);
  const nameNo = useRef(1);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(blocksStorageKey(eventId));
        if (raw) setBlocks(JSON.parse(raw));
      } catch {
        // 저장본이 깨졌으면 샘플 도면으로 시작한다.
      }
    };
    load();
  }, [eventId]);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    try {
      localStorage.setItem(blocksStorageKey(eventId), JSON.stringify(blocks));
    } catch {
      // 저장 실패(시크릿 모드 등)해도 편집은 계속한다.
    }
  }, [blocks, eventId]);

  function toCell(e: React.PointerEvent) {
    const r = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) * VIEW_W) / r.width;
    const y = ((e.clientY - r.top) * VIEW_H) / r.height;
    return {
      x,
      y,
      cx: clamp(Math.floor(x / CELL), GRID.minX, GRID.maxX),
      cy: clamp(Math.floor(y / CELL), GRID.minY, GRID.maxY),
    };
  }

  function hit(x: number, y: number): Block | null {
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];
      if (
        x >= b.x * CELL && x <= (b.x + b.w) * CELL &&
        y >= b.y * CELL && y <= (b.y + b.h) * CELL
      ) {
        return b;
      }
    }
    return null;
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    const p = toCell(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    const b = hit(p.x, p.y);
    if (b) {
      setSelId(b.id);
      setDrag({ mode: "move", id: b.id, ox: p.cx - b.x, oy: p.cy - b.y });
    } else {
      setSelId(null);
      setDrag({ mode: "draw", ax: p.cx, ay: p.cy, bx: p.cx, by: p.cy });
    }
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!drag) return;
    const p = toCell(e);
    if (drag.mode === "move") {
      setBlocks((bs) =>
        bs.map((b) =>
          b.id === drag.id
            ? {
                ...b,
                x: clamp(p.cx - drag.ox, GRID.minX, GRID.maxX + 1 - b.w),
                y: clamp(p.cy - drag.oy, GRID.minY, GRID.maxY + 1 - b.h),
              }
            : b,
        ),
      );
    } else {
      setDrag({ ...drag, bx: p.cx, by: p.cy });
    }
  }

  function onPointerEnd() {
    if (drag?.mode === "draw") {
      const w = Math.abs(drag.ax - drag.bx) + 1;
      const h = Math.abs(drag.ay - drag.by) + 1;
      // 클릭 한 번(1칸)은 선택 해제로만 쓰고, 끌었을 때만 블록을 만든다.
      if (w * h >= 2) {
        const nb: Block = {
          id: crypto.randomUUID(),
          name: `공간 ${nameNo.current++}`,
          x: Math.min(drag.ax, drag.bx),
          y: Math.min(drag.ay, drag.by),
          w,
          h,
          role: null,
        };
        setBlocks((bs) => [...bs, nb]);
        setSelId(nb.id);
      }
    }
    setDrag(null);
  }

  const selected = blocks.find((b) => b.id === selId) ?? null;

  function updateSelected(patch: Partial<Block>) {
    if (!selId) return;
    setBlocks((bs) => bs.map((b) => (b.id === selId ? { ...b, ...patch } : b)));
  }

  return (
    <div>
      <div className="card overflow-hidden p-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block h-auto w-full cursor-crosshair touch-none select-none"
          aria-label="도면 에디터 캔버스"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          <defs>
            <pattern
              id="editor-grid"
              width={CELL}
              height={CELL}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${CELL} 0 H 0 V ${CELL}`}
                fill="none"
                stroke="#eceae4"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect x={CELL} y={CELL} width={FRAME_W} height={FRAME_H} fill="url(#editor-grid)" />
          <rect
            x={CELL} y={CELL} width={FRAME_W} height={FRAME_H} rx={4}
            fill="none" stroke="rgba(28,28,28,0.4)" strokeWidth="2"
          />
          {blocks.map((b) => {
            const active = b.role !== null;
            const sel = b.id === selId;
            const X = b.x * CELL;
            const Y = b.y * CELL;
            const W = b.w * CELL;
            const H = b.h * CELL;
            const area = b.w * b.h;
            const fontSize = area >= 15 ? 20 : area >= 6 ? 14 : 11;
            return (
              <g key={b.id} style={{ cursor: "move" }}>
                <rect
                  x={X} y={Y} width={W} height={H} rx={4}
                  fill={active ? "#efe4ff" : "#fcfbf8"}
                  stroke={sel ? "#1c1c1c" : active ? "#6b3fd6" : "#eceae4"}
                  strokeWidth={sel ? 2.5 : active ? 2.5 : 1.5}
                  strokeDasharray={sel ? "6 4" : undefined}
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
          {drag?.mode === "draw" && (
            <rect
              x={Math.min(drag.ax, drag.bx) * CELL}
              y={Math.min(drag.ay, drag.by) * CELL}
              width={(Math.abs(drag.ax - drag.bx) + 1) * CELL}
              height={(Math.abs(drag.ay - drag.by) + 1) * CELL}
              rx={4}
              fill="rgba(28,28,28,0.04)"
              stroke="rgba(28,28,28,0.4)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}
        </svg>
      </div>

      {selected ? (
        <div className="card mt-3 flex flex-wrap items-center gap-3 p-4">
          <input
            aria-label="블록 이름"
            className="min-w-[160px] flex-1 rounded-md border border-line bg-cream px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={selected.name}
            onChange={(e) => updateSelected({ name: e.target.value })}
          />
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((opt) => {
              const on = selected.role === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  className={
                    on
                      ? "rounded-full bg-charcoal px-3 py-1.5 text-sm text-off-white"
                      : "rounded-full border border-line px-3 py-1.5 text-sm text-muted"
                  }
                  onClick={() => updateSelected({ role: opt.value })}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setBlocks((bs) => bs.filter((b) => b.id !== selId));
              setSelId(null);
            }}
          >
            삭제
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">
          빈 곳을 끌면 블록이 생긴다. 블록을 누르면 이름과 역할을 고치고,
          끌어서 옮긴다.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setBlocks(SAMPLE_BLOCKS.map((b) => ({ ...b })));
            setSelId(null);
          }}
        >
          예시 도면으로 되돌리기
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setBlocks([]);
            setSelId(null);
          }}
        >
          전부 지우기
        </button>
        <span className="ml-auto text-sm text-muted">블록 {blocks.length}개</span>
      </div>
    </div>
  );
}
