import Link from "next/link";
import { MapEditor } from "@/components/map-editor";

/**
 * 도면 에디터 (PC 우선). 모바일에서는 안내만 보여준다.
 * 편집 인터랙션은 프로토타입에서 이식했고, 저장은 브라우저 임시 저장이다.
 * TODO: events.blocks(jsonb) 서버 저장, 존 인스펙터의 메뉴 편집(이름·가격·품절).
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
        <nav className="flex gap-4 text-sm">
          <Link href={`/e/${eventId}`} className="underline">
            참가자 화면 보기
          </Link>
          <Link href={`/admin/${eventId}/live`} className="underline">
            운영 대시보드로
          </Link>
        </nav>
      </header>

      <div className="card p-6 md:hidden">
        <p className="text-lg">도면 편집은 PC 화면에서 한다.</p>
        <p className="mt-1 text-sm text-muted">
          이 페이지 링크를 PC 브라우저로 열어보라.
        </p>
      </div>

      <div className="hidden md:block">
        <MapEditor eventId={eventId} />
        <p className="mt-3 text-sm text-muted">
          도면은 이 브라우저에 임시 저장된다. 참가자 화면이 같은 도면을 읽는다.
        </p>
      </div>
    </main>
  );
}
