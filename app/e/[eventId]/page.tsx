import Link from "next/link";
import { MapView } from "@/components/map-view";
import { SAMPLE_EVENT } from "@/lib/sample-map";

/**
 * 참가자 지도 홈 (모바일 우선). 명세: 도면 렌더, 존 탭 → 바텀시트, 주문 뱃지.
 * 도면은 에디터의 임시 저장본을 읽는다(MapView). 서버 조회는 TODO.
 * TODO: 존 탭 → 역할별 바텀시트(주문/DJ). 프로토타입에서 이식.
 * TODO: 진행 중 주문 플로팅 뱃지, 행사 종료 안내.
 */
export default async function EventMapPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = SAMPLE_EVENT; // TODO: fetchEvent(eventId)

  return (
    <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-6">
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <h1 className="display text-2xl">{event.name}</h1>
        <Link href={`/e/${eventId}/me`} className="text-sm text-muted underline">
          내 주문
        </Link>
      </header>
      <div className="card overflow-hidden p-2">
        <MapView eventId={eventId} />
      </div>
      <p className="mt-3 text-sm text-muted">
        색이 있는 존을 누르면 주문·신청 화면이 열린다. (연결 예정)
      </p>
    </main>
  );
}
