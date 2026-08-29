import Link from "next/link";
import { GAMES } from "@/lib/game";
import { GameId } from "@/types/game";

export const dynamic = "force-dynamic";

export default function Home() {
  const gameKeys = Object.keys(GAMES) as GameId[];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full text-center space-y-6">
        {/* Header Badge & Title */}
        <div className="inline-block px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-xs sm:text-sm font-semibold tracking-wide uppercase">
          🎉 Sungnam Alumni Party OS
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
          Hack the Beat: Famous Party Games
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          파티장에 붙은 <span className="text-rose-400 font-semibold">QR 코드</span>를 스캔하면 누구나 그 자리에서 바로 여는
          <span className="text-indigo-400 font-semibold"> 유명 파티 게임 4종</span>! 초면 남남끼리도 3초 만에 승부욕을 태우며 대화의 물꼬를 터줍니다.
        </p>

        {/* 4 Famous Games Grid */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {gameKeys.map((key) => {
            const game = GAMES[key];
            return (
              <div
                key={game.id}
                className="group relative bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/40 flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-3">{game.emoji}</div>
                  <h2 className="text-lg font-bold text-slate-100 group-hover:text-rose-400 transition-colors">
                    {game.name}
                  </h2>
                  <div className="inline-block my-2 px-2.5 py-0.5 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-full border border-rose-500/20">
                    {game.tagline}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    {game.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">QR 스캔</span>
                  <Link
                    href={`/zone/${game.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 bg-rose-400 hover:bg-rose-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    게임 오픈 &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border-t border-slate-800/80 mt-10 text-slate-400 text-xs sm:text-sm">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
            <div className="font-bold text-slate-200 mb-1">👑 순간 호스트</div>
            <div>스캔한 사람이 진행자 화면 열어 무대 주도</div>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
            <div className="font-bold text-slate-200 mb-1">⚔️ 초면 남남 경쟁</div>
            <div>0.1초 순발력 & 드립 대결로 어색함 파괴</div>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
            <div className="font-bold text-slate-200 mb-1">⚡ Supabase Realtime</div>
            <div>별도 앱 설치 없이 웹 폰 동기화</div>
          </div>
        </div>
      </div>
    </main>
  );
}
