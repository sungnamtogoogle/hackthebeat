import Link from "next/link";
import { MapCanvas } from "@/components/map-canvas";
import { SAMPLE_EVENT } from "@/lib/sample-map";

/**
 * 도면 에디터 (PC 우선). 모바일에서는 안내만 보여준다.
 * TODO: 프로토타입의 편집 인터랙션 이식(드래그 생성·이동·삭제, 격자 스냅, 인스펙터).
 * TODO: 존 인스펙터에서 메뉴 편집(이름·가격·품절).
 * TODO: events.blocks(jsonb) 저장, 참가자 화면 미리보기 프레임.
 */
export default async function MapEditorPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display text-3xl">도면 에디터</h1>
        <Link href={`/admin/${eventId}/live`} className="text-sm underline">
          운영 대시보드로
        </Link>
      </header>

      <div className="card p-6 md:hidden">
        <p className="text-lg">도면 편집은 PC 화면에서 한다.</p>
        <p className="mt-1 text-sm text-muted">
          이 페이지 링크를 PC 브라우저로 열어보라.
        </p>
      </div>

      <div className="hidden md:block">
        <div className="card overflow-hidden p-3">
          <MapCanvas blocks={SAMPLE_EVENT.blocks} />
        </div>
        <p className="mt-3 text-sm text-muted">
          지금은 읽기 전용 미리보기다. 드래그 편집과 저장은 프로토타입에서
          옮겨온다.
        </p>
      </div>
    </main>
  );
}
