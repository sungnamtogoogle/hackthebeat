import Link from "next/link";

/**
 * 내 주문 (모바일). 명세: 상태 실시간 갱신, 내 앞 N팀, 접수 상태 취소.
 * TODO: 익명 세션으로 내 주문 조회, Realtime 구독, 픽업대기 강조 화면.
 */
export default async function MyOrdersPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-6">
      <h1 className="display text-2xl">내 주문</h1>
      <div className="card mt-4 px-6 py-12 text-center">
        <p className="text-lg">아직 주문이 없다.</p>
        <p className="mt-1 text-sm text-muted">
          지도에서 존을 눌러 첫 주문을 넣어보라.
        </p>
        <Link href={`/e/${eventId}`} className="btn btn-ghost mt-6">
          지도로 가기
        </Link>
      </div>
    </main>
  );
}
