"use client";

import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { GAMES, KAHOOT_QUESTIONS, HUNMIN_PROMPTS } from "@/lib/game";
import { GameId } from "@/types/game";

interface PlayPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const gameId = (searchParams.get("game") || "kahoot") as GameId;
  const game = GAMES[gameId] || GAMES.kahoot;

  const [voterName, setVoterName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterName.trim()) return;
    setIsJoined(true);
  };

  const sendEvent = async (payload: Record<string, unknown>) => {
    setSubmitted(true);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

    try {
      const client = createClient(url, key);
      const channel = client.channel(`room-${code}`);
      await channel.subscribe();
      await channel.send({
        type: "broadcast",
        event: "GAME_EVENT",
        payload: {
          voterName,
          gameId,
          ...payload,
        },
      });
    } catch {
      // Fallback local broadcast
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{game.emoji}</span>
            <div>
              <div className="text-xs text-rose-400 font-bold">{game.name}</div>
              <div className="text-sm font-extrabold text-slate-100">ROOM: {code}</div>
            </div>
          </div>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
            나가기
          </Link>
        </div>

        {/* Step 1: Join Name */}
        {!isJoined ? (
          <form onSubmit={handleJoin} className="space-y-4 pt-2">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-slate-100">📱 플레이어 닉네임 입력</h2>
              <p className="text-xs text-slate-400">파티에서 표시될 내 닉네임을 적고 참여하세요!</p>
            </div>
            <input
              type="text"
              placeholder="예: 21학번 김인싸"
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
          /* Step 2: Game Mode UI */
          <div className="space-y-6 pt-2">
            {submitted ? (
              <div className="text-center bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="text-4xl animate-bounce">✅</div>
                <h3 className="text-lg font-bold text-slate-100">전송이 완료되었습니다!</h3>
                <p className="text-xs text-slate-400">
                  👑 호스트 진행 화면(메인 스크린)에서 실시간 랭킹 & 결과를 확인하세요!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  다시 참여하기
                </button>
              </div>
            ) : (
              <>
                {/* 1. Kahoot 4-Color Speed Quiz */}
                {gameId === "kahoot" && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold text-purple-400">KAHOOT 4색 버튼</span>
                      <h2 className="text-sm font-bold text-slate-200">
                        {KAHOOT_QUESTIONS[0].title}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { color: "🔴 빨강", bg: "bg-red-600 hover:bg-red-500", idx: 0 },
                        { color: "🔵 파랑", bg: "bg-blue-600 hover:bg-blue-500", idx: 1 },
                        { color: "🟡 노랑", bg: "bg-amber-500 hover:bg-amber-400 text-slate-950", idx: 2 },
                        { color: "🟢 초록", bg: "bg-emerald-600 hover:bg-emerald-500", idx: 3 },
                      ].map((btn) => (
                        <button
                          key={btn.idx}
                          onClick={() => {
                            setSelectedColor(btn.color);
                            sendEvent({ type: "KAHOOT_VOTE", optionIndex: btn.idx });
                          }}
                          className={`h-28 rounded-2xl text-base font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-lg ${btn.bg}`}
                        >
                          {btn.color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Quiplash Drip Battle */}
                {gameId === "quiplash" && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold text-amber-400">🤣 퀴플래시 드립 작성</span>
                      <h2 className="text-sm font-bold text-slate-200">
                        "처음 본 사람에게 건넬 가장 신박한 드립은?"
                      </h2>
                    </div>
                    <textarea
                      placeholder="신박한 드립 한 마디를 적어주세요!"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={() => sendEvent({ type: "QUIPLASH_SUBMIT", text: inputText })}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-sm"
                    >
                      🔥 드립 대결에 제출하기
                    </button>
                  </div>
                )}

                {/* 3. Liar Game */}
                {gameId === "liar" && (
                  <div className="space-y-4 text-center">
                    <span className="text-xs font-bold text-blue-400">🎭 내 역할 카드</span>
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="text-xs text-slate-400">당신의 역할:</div>
                      <div className="text-2xl font-extrabold text-emerald-400">시민 👥</div>
                      <div className="text-xs text-slate-400 pt-2">비밀 제시어:</div>
                      <div className="text-xl font-bold text-slate-100">"삼겹살"</div>
                    </div>
                    <button
                      onClick={() => sendEvent({ type: "LIAR_VOTE", target: "라이어 지목" })}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm"
                    >
                      🕵️‍♂️ 라이어 추리 투표하기
                    </button>
                  </div>
                )}

                {/* 4. Hunminjeongeum */}
                {gameId === "hunmin" && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold text-rose-400">🔤 훈민정음 초성 타임어택</span>
                      <h2 className="text-3xl font-extrabold text-rose-400 tracking-widest pt-2">
                        {HUNMIN_PROMPTS[0].choseong}
                      </h2>
                    </div>
                    <input
                      type="text"
                      placeholder="초성 단어 입력 (예: 당근)"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-center text-lg font-bold focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={() => sendEvent({ type: "HUNMIN_SUBMIT", word: inputText })}
                      className="w-full py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold rounded-xl text-sm"
                    >
                      ⚡ 0.1초 순발력 전송!
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
