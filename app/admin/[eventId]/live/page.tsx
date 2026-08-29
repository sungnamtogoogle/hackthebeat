import Link from "next/link";
import { LiveBoard } from "@/components/live-board";

/**
 * 운영 대시보드 (PC·태블릿). 주문은 완성·전달 버튼 두 번으로 처리하고,
 * DJ 보드에서 신청곡을 틀거나 거른다. 데이터는 데모 스토어와 실시간 동기화.
 * TODO: Supabase Realtime 전환, 신규 주문 소리 알림.
 */
export default async function LiveDashboardPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display text-3xl">운영 대시보드</h1>
        <nav className="flex gap-4 text-sm">
          <Link href={`/e/${eventId}`} className="underline">
            참가자 화면 보기
          </Link>
          <Link href={`/admin/${eventId}/map`} className="underline">
            도면 에디터로
          </Link>
        </nav>
      </header>
      <LiveBoard eventId={eventId} />
      <p className="mt-4 text-sm text-muted">
        같은 브라우저에서 참가자 탭을 열면 주문·신청이 실시간으로 넘어온다.
        서버 연동(Supabase) 전의 데모 동선이다.
      </p>
    </main>
  );
}
