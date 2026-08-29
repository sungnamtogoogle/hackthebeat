"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MapCanvas } from "@/components/map-canvas";
import { SAMPLE_EVENT } from "@/lib/sample-map";
import { Block } from "@/lib/types";
import { GAMES } from "@/lib/game";
import { GameId } from "@/types/game";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EventMapPage({ params }: EventPageProps) {
  const { eventId } = use(params);
  const event = SAMPLE_EVENT;

  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const handleZoneTap = (block: Block) => {
    setSelectedBlock(block);
  };

  const selectedGameId = (selectedBlock?.gameId || "kahoot") as GameId;
  const game = GAMES[selectedGameId] || GAMES.kahoot;

  return (
    <main className="mx-auto w-full max-w-[760px] flex-1 px-4 py-6 text-slate-900">
      {/* Header */}
      <header className="mb-4 flex items-baseline justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="text-xs text-purple-600 font-bold uppercase tracking-wide">
            🎪 MC 없는 자율형 팝업 부스 파티 OS
          </div>
          <h1 className="display text-2xl sm:text-3xl font-extrabold text-slate-900">{event.name}</h1>
        </div>
        <Link href={`/e/${eventId}/me`} className="text-xs font-bold text-purple-600 underline">
          내 주문/내역
        </Link>
      </header>

      {/* Real Map Canvas Card */}
      <div className="card overflow-hidden p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <MapCanvas blocks={event.blocks} onZoneTap={handleZoneTap} />
      </div>

      {/* Guide text */}
        <p className="mt-3 text-xs text-slate-500 text-center">
          💡 지도 상의 <span className="text-purple-600 font-bold">보라색 활성 존(부스)</span>을 누르면 진행자 없이 작동하는 <strong>MC-Less 파티 게임</strong>이 열립니다!
        </p>

      {/* Bottom Sheet Modal for Selected Zone */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{game.emoji}</span>
                <div>
                  <div className="text-xs text-purple-600 font-bold">{selectedBlock.name}</div>
                  <h2 className="text-lg font-extrabold text-slate-900">{game.name}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Value Proposition Badge */}
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-700 font-semibold space-y-1">
              <div>🤖 <strong>MC 인력 비용 0원 자율 진행 부스</strong></div>
              <div className="text-slate-600 font-normal">{game.description}</div>
            </div>

            {/* Game Launcher Options */}
            <div className="space-y-3 pt-1">
              <Link
                href={`/zone/${selectedGameId}`}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm flex items-center justify-between transition-colors shadow-lg shadow-purple-950/10"
              >
                <span>👑 새 게임 방 열기 (호스트 진행 화면)</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href={`/zone/${selectedGameId}?tab=join`}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm flex items-center justify-between transition-colors"
              >
                <span>📱 게임 즉시 참여 (플레이어 모바일)</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Auxiliary Menu / Items */}
            {selectedBlock.menu && selectedBlock.menu.length > 0 && (
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="text-xs font-bold text-slate-500">🍹 보조 부스 메뉴 / 신청곡</div>
                <div className="flex flex-wrap gap-2">
                  {selectedBlock.menu.map((item, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
