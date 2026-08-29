import Link from "next/link";
import { MyOrders } from "@/components/my-orders";

/**
 * 내 주문 (모바일). 익명 세션으로 내 주문을 찾고, 접수 상태만 취소할 수 있다.
 * 상태는 스토어 구독으로 실시간 갱신된다(MyOrders).
 */
export default async function MyOrdersPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-6">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="display text-2xl">내 주문</h1>
        <Link href={`/e/${eventId}`} className="text-sm text-muted underline">
          지도로
        </Link>
      </header>
      <MyOrders eventId={eventId} />
    </main>
  );
}
