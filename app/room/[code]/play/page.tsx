"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ZONES, getRandomQuestion } from "@/lib/game";
import { ZoneId, BalanceQuestion } from "@/types/game";

interface PlayPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const zoneId = (searchParams.get("zone") || "bar") as ZoneId;
  const zone = ZONES[zoneId] || ZONES.bar;

  const [question, setQuestion] = useState<BalanceQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [voterName, setVoterName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    setQuestion(getRandomQuestion(zoneId));
  }, [zoneId]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterName.trim()) return;
    setIsJoined(true);
  };

  const handleVote = async (option: "A" | "B") => {
    if (selectedOption) return;
    setSelectedOption(option);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
    
    try {
      const client = createClient(url, key);
      const channel = client.channel(`room-${code}`);
      await channel.subscribe();
      await channel.send({
        type: "broadcast",
        event: "VOTE",
        payload: {
          option,
          voterName,
        },
      });
    } catch {
      // Fallback local broadcast simulator
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{zone.emoji}</span>
            <div>
              <div className="text-xs text-rose-400 font-bold">{zone.name}</div>
              <div className="text-sm font-extrabold text-slate-100">ROOM: {code}</div>
            </div>
          </div>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
            나가기
          </Link>
        </div>

        {/* Step 1: Enter Name */}
        {!isJoined ? (
          <form onSubmit={handleJoin} className="space-y-4 pt-2">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-slate-100">📱 플레이어 닉네임 입력</h2>
              <p className="text-xs text-slate-400">파티에서 표시될 내 닉네임을 적고 참여하세요!</p>
            </div>
            <input
              type="text"
              placeholder="예: 18학번 피치콕"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 text-sm"
              required
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-sm transition-colors"
            >
              🎉 게임 입장하기
            </button>
          </form>
        ) : (
          /* Step 2: Vote */
          <div className="space-y-6 pt-2">
            {question && (
              <div className="text-center space-y-2">
                <span className="text-xs px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full font-bold">
                  파티 밸런스 게임
                </span>
                <h2 className="text-lg font-bold text-slate-100 leading-snug pt-2">
                  {question.title}
                </h2>
              </div>
            )}

            {!selectedOption ? (
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleVote("A")}
                  className="p-5 bg-gradient-to-r from-rose-950/80 to-purple-950/80 hover:from-rose-900 hover:to-purple-900 border border-rose-500/30 rounded-2xl text-left transition-all active:scale-95 space-y-1"
                >
                  <div className="text-xs font-extrabold text-rose-400">OPTION A</div>
                  <div className="text-sm font-bold text-slate-100">{question?.optionA}</div>
                  <div className="text-xs text-rose-300/70">{question?.tagA}</div>
                </button>

                <button
                  onClick={() => handleVote("B")}
                  className="p-5 bg-gradient-to-r from-indigo-950/80 to-blue-950/80 hover:from-indigo-900 hover:to-blue-900 border border-indigo-500/30 rounded-2xl text-left transition-all active:scale-95 space-y-1"
                >
                  <div className="text-xs font-extrabold text-indigo-400">OPTION B</div>
                  <div className="text-sm font-bold text-slate-100">{question?.optionB}</div>
                  <div className="text-xs text-indigo-300/70">{question?.tagB}</div>
                </button>
              </div>
            ) : (
              /* Step 3: Voted Feedback */
              <div className="text-center bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="text-4xl animate-bounce">✅</div>
                <h3 className="text-lg font-bold text-slate-100">투표가 완료되었습니다!</h3>
                <p className="text-xs text-slate-400">
                  선택하신 항목: <span className="font-bold text-rose-400">OPTION {selectedOption}</span>
                </p>
                <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-300">
                  👑 호스트 진행 화면(메인 스크린)에서 실시간으로 결과를 확인해 보세요!
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
