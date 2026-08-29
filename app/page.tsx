import Link from "next/link";
import { GAMES } from "@/lib/game";
import { GameId } from "@/types/game";

export const dynamic = "force-dynamic";

export default function Home() {
  const gameKeys = Object.keys(GAMES) as GameId[];

  return (
    <main className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col justify-center px-6 py-12">
      {/* Header Badge & Title */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-600 text-xs sm:text-sm font-semibold tracking-wide uppercase">
          🎪 MC 없는 자율형 파티 부스 OS
        </div>
        <h1 className="display text-4xl sm:text-6xl tracking-[-1.5px] font-extrabold text-slate-900">
          네모네모 맵: 유명 파티 게임 부스
        </h1>
        <p className="mt-4 max-w-[42em] mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          행사장 도면 상의 소규모 부스 구석구석에서 MC(진행자) 없이 3초 만에 자율적으로 작동하는 <strong className="text-purple-600">유명 파티 게임 4종</strong>!
          초면 참가자들도 QR 하나로 승부욕을 불태우며 바로 어색함을 파괴합니다.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link href="/e/demo" className="btn btn-dark px-6 py-3 text-sm font-bold">
            🗺️ 실시간 행사장 지도 열기 (/e/demo)
          </Link>
          <Link href="/admin" className="btn btn-ghost px-6 py-3 text-sm font-bold">
            ⚙️ 주최자 도면 에디터 (/admin)
          </Link>
        </div>
      </div>

      {/* 4 Famous Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
        {gameKeys.map((key) => {
          const game = GAMES[key];
          return (
            <div
              key={game.id}
              className="group relative bg-white border border-slate-200 hover:border-purple-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-3">{game.emoji}</div>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {game.name}
                </h2>
                <div className="inline-block my-2 px-2.5 py-0.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-full border border-purple-100">
                  {game.tagline}
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">
                  {game.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">MC 필요 없음</span>
                <Link
                  href={`/zone/${game.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  부스 오픈 &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Value Proposition Highlights */}
      <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border-t border-slate-200 mt-12 text-slate-600 text-xs sm:text-sm">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-900 mb-1">🤖 MC 인력 비용 0원</div>
          <div>코너마다 MC를 띄우는 대신 QR 자율 진행</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-900 mb-1">🎪 무제한 팝업 부스</div>
          <div>도면 상 어디든 소규모 자율 부스 즉시 설치</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-900 mb-1">⚔️ 초면 남남 경쟁</div>
          <div>0.1초 스피드 & 드립 대결로 자연스러운 매칭</div>
        </div>
      </div>
    </main>
  );
}
