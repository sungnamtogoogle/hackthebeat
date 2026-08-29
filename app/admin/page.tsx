import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 주최자 홈: 로그인과 행사 목록 (PC 우선).
 * TODO: 매직링크 로그인(Supabase Auth), 행사 생성·목록, 열림/종료 토글,
 *       참가자 링크 복사와 QR 보기·인쇄.
 */
export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-6 py-16">
      <h1 className="display text-4xl tracking-[-1.2px]">내 행사</h1>
      <p className="mt-2 text-muted">
        행사를 만들면 도면 에디터와 운영 대시보드가 열린다.
      </p>
      <div className="card mt-8 px-6 py-14 text-center">
        <p className="text-lg">아직 행사가 없다.</p>
        <p className="mt-1 text-sm text-muted">
          첫 행사를 만들어 도면부터 그려보라.
        </p>
        <Button className="mt-6" type="button">
          새 행사 만들기
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted">
        지금은 프레임 단계라 버튼이 동작하지 않는다. 데모 도면은{" "}
        <Link href="/admin/demo/map" className="underline">
          에디터 미리보기
        </Link>
        에서 볼 수 있다.
      </p>
    </main>
  );
}
