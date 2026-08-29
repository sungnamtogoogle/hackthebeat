import Link from "next/link";
import { ZONES } from "@/lib/game";
import { ZoneId } from "@/types/game";

export const dynamic = "force-dynamic";

export default function Home() {
  const zoneKeys = Object.keys(ZONES) as ZoneId[];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full text-center space-y-6">
        {/* Header Badge & Title */}
        <div className="inline-block px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-xs sm:text-sm font-semibold tracking-wide uppercase">
          🎉 Sungnam Alumni Party OS
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
          Hack the Beat: QR Zone Game
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          파티장 곳곳의 <span className="text-rose-400 font-semibold">QR 존</span>을 스캔하세요!
          인싸력 없어도 누구나 그 순간 그 자리에서 즉석 밸런스 게임을 열어 분위기를 주도할 수 있습니다.
        </p>

        {/* Zone Map Grid */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {zoneKeys.map((key) => {
            const zone = ZONES[key];
            return (
              <div
                key={zone.id}
                className="group relative bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/40 flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-3">{zone.emoji}</div>
                  <h2 className="text-xl font-bold text-slate-100 group-hover:text-rose-400 transition-colors">
                    {zone.name}
                  </h2>
                  <p className="text-xs font-semibold text-rose-400/90 mt-1 mb-3">
                    {zone.tagline}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {zone.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">QR 스캔 / 게임 오픈</span>
                  <Link
                    href={`/zone/${zone.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 bg-rose-400 hover:bg-rose-300 px-3 py-2 rounded-lg transition-colors"
                  >
                    입장하기 &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border-t border-slate-800/80 mt-12 text-slate-400 text-xs sm:text-sm">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
            <div className="font-bold text-slate-200 mb-1">📍 존(Zone) 메커니즘</div>
            <div>거실, 발코니, 바 존 별 특화 콘텐츠</div>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
            <div className="font-bold text-slate-200 mb-1">👑 순간 호스트</div>
            <div>스캔한 사람이 Kahoot 방식 호스트 화면 주도</div>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
            <div className="font-bold text-slate-200 mb-1">⚡ Supabase Realtime</div>
            <div>설정 필요 없이 폰들 간 실시간 실시간 동기화</div>
          </div>
        </div>
      </div>
    </main>
  );
}
