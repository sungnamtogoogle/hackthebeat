import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

/**
 * 운영 대시보드 (PC·태블릿). 명세: 실시간 주문 수신+소리, 상태 전이 보드,
 * 신청곡 관리, 품절 토글.
 * TODO: Realtime 구독, "다음 상태" 버튼(NEXT_ORDER_STATUS 전이), 신청곡 목록.
 */
const BOARD_COLUMNS: OrderStatus[] = ["placed", "ready", "done"];

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
        <span className="text-sm text-muted">행사 {eventId}</span>
      </header>

      <section aria-label="주문 상태 보드" className="grid gap-4 md:grid-cols-3">
        {BOARD_COLUMNS.map((status) => (
          <div key={status} className="card p-4">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <h2 className="text-lg font-semibold">
                {ORDER_STATUS_LABEL[status]}
              </h2>
              <span className="text-sm text-muted">0건</span>
            </div>
            <p className="py-10 text-center text-sm text-muted">
              이 상태의 주문이 없다.
            </p>
          </div>
        ))}
      </section>

      <section aria-label="신청곡" className="card mt-6 p-4">
        <h2 className="text-lg font-semibold">신청곡</h2>
        <p className="py-8 text-center text-sm text-muted">
          아직 신청곡이 없다. DJ 존이 열리면 여기로 쌓인다.
        </p>
      </section>
    </main>
  );
}
