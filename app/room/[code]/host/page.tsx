"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ZONES, getRandomQuestion } from "@/lib/game";
import { ZoneId, BalanceQuestion } from "@/types/game";

interface HostPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function HostPage({ params }: HostPageProps) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const zoneId = (searchParams.get("zone") || "bar") as ZoneId;
  const hostName = searchParams.get("host") || "호스트";
  const zone = ZONES[zoneId] || ZONES.bar;

  const [question, setQuestion] = useState<BalanceQuestion | null>(null);
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [voters, setVoters] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setQuestion(getRandomQuestion(zoneId));
  }, [zoneId]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

    try {
      const client = createClient(url, key);
      const channel = client.channel(`room-${code}`);

      channel
        .on("broadcast", { event: "VOTE" }, (payload) => {
          const { option, voterName } = payload.payload || {};
          if (option === "A") setVotesA((prev) => prev + 1);
          if (option === "B") setVotesB((prev) => prev + 1);
          if (voterName) {
            setVoters((prev) => [voterName, ...prev.slice(0, 7)]);
          }
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch {
      // Fallback simulator
    }
  }, [code]);

  const totalVotes = votesA + votesB;
  const percentA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const percentB = totalVotes > 0 ? 100 - percentA : 50;

  const playDemoVote = (option: "A" | "B") => {
    if (option === "A") setVotesA((prev) => prev + 1);
    if (option === "B") setVotesB((prev) => prev + 1);
    const demoNames = ["19학번 이주형", "21학번 최유진", "20학번 박동문", "22학번 신인싸"];
    const name = demoNames[Math.floor(Math.random() * demoNames.length)];
    setVoters((prev) => [name, ...prev.slice(0, 7)]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col justify-between">
      {/* Top Header Navigation */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{zone.emoji}</span>
          <div>
            <div className="text-xs text-rose-400 font-bold uppercase">{zone.name} • 호스트 진행 화면</div>
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
        {/* Room QR Code Link Alert */}
        <div className="inline-flex items-center gap-3 bg-slate-900 border border-rose-500/30 px-5 py-3 rounded-2xl text-xs sm:text-sm">
          <span className="text-xl">📲</span>
          <span className="text-slate-300">
            주변 사람들은 각자 폰으로 <strong className="text-rose-400">ROOM [{code}]</strong> 또는 QR을 찍고 들어오세요!
          </span>
          <Link
            href={`/room/${code}/play?zone=${zoneId}`}
            target="_blank"
            className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-lg transition-colors text-xs"
          >
            플레이어 뷰 미리보기 ↗
          </Link>
        </div>

        {/* Balance Question Title */}
        {question && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-400 tracking-wider uppercase">
              🔥 파티 밸런스 게임 🔥
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 leading-snug">
              {question.title}
            </h1>
          </div>
        )}

        {/* Live Voting Graph Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-extrabold px-2">
            <span className="text-rose-400">OPTION A: {votesA}표 ({percentA}%)</span>
            <span className="text-indigo-400">OPTION B: {votesB}표 ({percentB}%)</span>
          </div>

          <div className="h-8 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex p-1">
            <div
              style={{ width: `${percentA}%` }}
              className="bg-gradient-to-r from-rose-600 to-pink-500 h-full rounded-l-full transition-all duration-500 flex items-center justify-start px-3 text-xs font-bold text-white shadow-lg"
            >
              {percentA > 15 && `${percentA}%`}
            </div>
            <div
              style={{ width: `${percentB}%` }}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-r-full transition-all duration-500 flex items-center justify-end px-3 text-xs font-bold text-white shadow-lg"
            >
              {percentB > 15 && `${percentB}%`}
            </div>
          </div>
        </div>

        {/* Option Cards Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
          <div className={`p-6 rounded-2xl border transition-all ${
            votesA >= votesB && totalVotes > 0 ? "bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-950/50" : "bg-slate-900/60 border-slate-800"
          }`}>
            <div className="text-xs font-extrabold text-rose-400 mb-1">A 스타일 {question?.tagA}</div>
            <div className="text-lg font-bold text-slate-100">{question?.optionA}</div>
            <div className="mt-4 text-2xl font-extrabold text-rose-400">{votesA} 명 선택</div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            votesB > votesA ? "bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-950/50" : "bg-slate-900/60 border-slate-800"
          }`}>
            <div className="text-xs font-extrabold text-indigo-400 mb-1">B 스타일 {question?.tagB}</div>
            <div className="text-lg font-bold text-slate-100">{question?.optionB}</div>
            <div className="mt-4 text-2xl font-extrabold text-indigo-400">{votesB} 명 선택</div>
          </div>
        </div>

        {/* Live Voter Feed & Simulator Buttons */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-bold">⚡ 실시간 참가자 입도선매 ({totalVotes}명 참여중):</div>
            <div className="flex flex-wrap gap-1.5">
              {voters.length > 0 ? (
                voters.map((name, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded text-xs">
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">참가자 투표 대기중...</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => playDemoVote("A")}
              className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold rounded-lg"
            >
              + A 시뮬레이션
            </button>
            <button
              onClick={() => playDemoVote("B")}
              className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-xs font-bold rounded-lg"
            >
              + B 시뮬레이션
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 border-t border-slate-900 pt-4 max-w-6xl w-full mx-auto">
        Sungnam Alumni Party OS • Hack the beat QR Zone Instant Game Module
      </footer>
    </main>
  );
}
