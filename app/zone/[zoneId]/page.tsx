"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ZONES, generateRoomCode } from "@/lib/game";
import { ZoneId } from "@/types/game";

interface ZonePageProps {
  params: Promise<{
    zoneId: string;
  }>;
}

export default function ZonePage({ params }: ZonePageProps) {
  const { zoneId } = use(params);
  const router = useRouter();
  const validZoneId = (zoneId in ZONES ? zoneId : "bar") as ZoneId;
  const zone = ZONES[validZoneId];

  const [hostName, setHostName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateRoomCode(validZoneId);
    const nameParam = encodeURIComponent(hostName.trim() || "익명 호스트");
    router.push(`/room/${code}/host?zone=${validZoneId}&host=${nameParam}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const code = joinCode.trim().toUpperCase();
    router.push(`/room/${code}/play?zone=${validZoneId}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <Link href="/" className="inline-flex items-center text-xs text-slate-400 hover:text-slate-200">
          &larr; 존 선택으로 돌아가기
        </Link>

        {/* Zone Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">{zone.emoji}</div>
          <h1 className="text-2xl font-bold text-slate-100">{zone.name}</h1>
          <p className="text-xs font-semibold text-rose-400">{zone.tagline}</p>
          <p className="text-slate-400 text-xs leading-relaxed">{zone.description}</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "create" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            👑 새 게임 열기 (호스트)
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "join" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📱 기존 게임 참여 (플레이어)
          </button>
        </div>

        {/* Tab 1: Create Room (Host) */}
        {activeTab === "create" && (
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                호스트 닉네임
              </label>
              <input
                type="text"
                placeholder="예: 21학번 김파티"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-rose-950/50"
            >
              🎉 {zone.name} 즉석 게임 방 생성하기
            </button>
          </form>
        )}

        {/* Tab 2: Join Room (Player) */}
        {activeTab === "join" && (
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                방 코드 (예: BAR-4091)
              </label>
              <input
                type="text"
                placeholder="BAR-1234"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 text-sm uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-950/50"
            >
              🚀 게임 방 참여하기
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
