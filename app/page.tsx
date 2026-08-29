import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center px-6 py-24">
      <h1 className="display text-5xl tracking-[-1.5px]">네모네모 맵</h1>
      <p className="mt-4 max-w-[38em] text-lg text-muted">
        행사장 도면을 블록으로 그리면, 참가자는 QR 하나로 들어와 지도에서 바로
        주문하고 신청곡을 넣는다.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin" className="btn btn-dark">
          행사 만들기
        </Link>
        <Link href="/e/demo" className="btn btn-ghost">
          데모 지도 열기
        </Link>
      </div>
    </main>
  );
}
