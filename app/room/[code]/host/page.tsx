"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { GAMES, KAHOOT_QUESTIONS, HUNMIN_PROMPTS } from "@/lib/game";
import { GameId } from "@/types/game";

interface HostPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function HostPage({ params }: HostPageProps) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const gameId = (searchParams.get("game") || "kahoot") as GameId;
  const hostName = searchParams.get("host") || "호스트";
  const game = GAMES[gameId] || GAMES.kahoot;

  const [kahootVotes, setKahootVotes] = useState<number[]>([0, 0, 0, 0]);
  const [quiplashDrips, setQuiplashDrips] = useState<{ name: string; text: string }[]>([
    { name: "21학번 김드립", text: "술자리에서 폰 보면 사주 30분 보기" },
    { name: "19학번 이인싸", text: "원샷할 때까지 귀여운 애교 댄스 추기" },
  ]);
  const [hunminList, setHunminList] = useState<{ name: string; word: string; time: string }[]>([
    { name: "18학번 박동문", word: "당근", time: "0.42s" },
    { name: "22학번 신순발", word: "대구", time: "0.68s" },
  ]);
  const [voters, setVoters] = useState<string[]>([]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

    try {
      const client = createClient(url, key);
      const channel = client.channel(`room-${code}`);

      channel
        .on("broadcast", { event: "GAME_EVENT" }, (payload) => {
          const { type, voterName, optionIndex, text, word } = payload.payload || {};
          if (voterName) setVoters((prev) => [voterName, ...prev.slice(0, 7)]);

          if (type === "KAHOOT_VOTE" && typeof optionIndex === "number") {
            setKahootVotes((prev) => {
              const updated = [...prev];
              updated[optionIndex] = (updated[optionIndex] || 0) + 1;
              return updated;
            });
          }
          if (type === "QUIPLASH_SUBMIT" && text) {
            setQuiplashDrips((prev) => [{ name: voterName || "익명", text }, ...prev.slice(0, 3)]);
          }
          if (type === "HUNMIN_SUBMIT" && word) {
            setHunminList((prev) => [{ name: voterName || "익명", word, time: "0.31s" }, ...prev.slice(0, 5)]);
          }
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch {
      // Fallback
    }
  }, [code]);

  const triggerSimulatedEvent = () => {
    const names = ["20학번 박동문", "22학번 최인싸", "21학번 이신재", "19학번 강파티"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    setVoters((prev) => [randomName, ...prev.slice(0, 7)]);

    if (gameId === "kahoot") {
      const randIdx = Math.floor(Math.random() * 4);
      setKahootVotes((prev) => {
        const updated = [...prev];
        updated[randIdx] += 1;
        return updated;
      });
    }
    if (gameId === "hunmin") {
      const words = ["동개", "달걀", "도극", "당근"];
      const randWord = words[Math.floor(Math.random() * words.length)];
      setHunminList((prev) => [{ name: randomName, word: randWord, time: `${(Math.random() * 0.8 + 0.2).toFixed(2)}s` }, ...prev]);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col justify-between">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{game.emoji}</span>
          <div>
            <div className="text-xs text-rose-400 font-bold uppercase">{game.name} • 호스트 메인 화면</div>
            <div className="text-xl font-extrabold text-slate-100">ROOM: {code}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">진행자</div>
            <div className="text-sm font-bold text-slate-200">{hostName}님</div>
          </div>
          <Link href="/" className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-800">
            종료
          </Link>
        </div>
      </header>

      {/* Main Big Screen View */}
      <div className="max-w-4xl w-full mx-auto my-auto py-8 space-y-8 text-center">
        {/* QR / Link Room Code Badge */}
        <div className="inline-flex items-center gap-3 bg-slate-900 border border-rose-500/30 px-5 py-3 rounded-2xl text-xs sm:text-sm">
          <span className="text-xl">📲</span>
          <span className="text-slate-300">
            주변 참가자들은 각자 폰으로 <strong className="text-rose-400">ROOM [{code}]</strong> 찍고 접속하세요!
          </span>
          <Link
            href={`/room/${code}/play?game=${gameId}`}
            target="_blank"
            className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-lg transition-colors text-xs"
          >
            플레이어 뷰 미리보기 ↗
          </Link>
        </div>

        {/* 1. KAHOOT MODE HOST VIEW */}
        {gameId === "kahoot" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">
                🎯 KAHOOT 4색 실시간 스피드전
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
                {KAHOOT_QUESTIONS[0].title}
              </h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[
                { label: "🔴 빨강", count: kahootVotes[0], color: "bg-red-600" },
                { label: "🔵 파랑", count: kahootVotes[1], color: "bg-blue-600" },
                { label: "🟡 노랑", count: kahootVotes[2], color: "bg-amber-500 text-slate-950" },
                { label: "🟢 초록", count: kahootVotes[3], color: "bg-emerald-600" },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className={`p-2 rounded-xl font-extrabold text-sm ${item.color}`}>{item.label}</div>
                  <div className="text-3xl font-extrabold text-slate-100">{item.count} 표</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. QUIPLASH MODE HOST VIEW */}
        {gameId === "quiplash" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                🤣 퀴플래시 1:1 드립 배틀
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                "처음 본 사람에게 건넬 가장 신박한 첫 마디는?"
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
              {quiplashDrips.slice(0, 2).map((item, idx) => (
                <div key={idx} className="p-6 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-3 shadow-xl">
                  <div className="text-xs font-extrabold text-amber-400">드립 참가자: {item.name}</div>
                  <div className="text-lg font-bold text-slate-100">"{item.text}"</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. LIAR GAME HOST VIEW */}
        {gameId === "liar" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">
                🎭 라이어 게임 진행 메인 화면
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                누가 거짓말쟁이 '라이어'인가?
              </h1>
            </div>
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-md mx-auto space-y-3">
              <div className="text-4xl animate-bounce">🕵️‍♂️</div>
              <div className="text-base font-bold text-slate-200">참가자 전원 폰으로 힌트 전달 완료</div>
              <div className="text-xs text-slate-400">순서대로 한 마디씩 설명한 뒤 지목 투표를 진행하세요!</div>
            </div>
          </div>
        )}

        {/* 4. HUNMIN MODE HOST VIEW */}
        {gameId === "hunmin" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest">
                🔤 훈민정음 0.1초 타임어택 랭킹
              </span>
              <h1 className="text-5xl font-extrabold text-rose-400 tracking-widest">
                {HUNMIN_PROMPTS[0].choseong}
              </h1>
            </div>

            <div className="max-w-md mx-auto space-y-2 text-left pt-2">
              {hunminList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-100 text-sm">{item.word}</span>
                    <span className="text-xs text-slate-400">({item.name})</span>
                  </div>
                  <span className="text-xs font-extrabold text-rose-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Feed & Test Button */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-bold">⚡ 실시간 참가자 접속 피드:</div>
            <div className="flex flex-wrap gap-1.5">
              {voters.length > 0 ? (
                voters.map((name, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded text-xs">
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">참가자 반응 대기중...</span>
              )}
            </div>
          </div>

          <button
            onClick={triggerSimulatedEvent}
            className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold rounded-lg"
          >
            + 시뮬레이션 이벤트
          </button>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 border-t border-slate-900 pt-4 max-w-6xl w-full mx-auto">
        Sungnam Alumni Party OS • Famous Party Game Suite Module
      </footer>
    </main>
  );
}
