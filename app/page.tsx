import { PartyJoinForm } from "@/components/party-join-form";
import { getRegistrationCount, isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const databaseReady = isDatabaseConfigured();
  const registrationCount = databaseReady ? await loadRegistrationCount() : null;

  return (
    <main>
      <section className="hero">
        <div className="heroInner">
          <div className="heroCopy">
            <p className="eyebrow">Sungnam Alumni Party OS</p>
            <h1>Hack the beat</h1>
            <p className="lede">
              동문 파티 전에 참석자 취향을 모으고, 현장 분위기에 맞는 연결 포인트를 만드는
              최소 배포 버전입니다.
            </p>
          </div>
          <div className="statusPanel" aria-label="deployment status">
            <span className={databaseReady ? "statusDot ready" : "statusDot"} />
            <div>
              <strong>{databaseReady ? "Postgres 연결 준비됨" : "환경변수 대기 중"}</strong>
              <p>
                {databaseReady
                  ? `현재 ${registrationCount ?? 0}명이 파티 리스트에 등록되었습니다.`
                  : "Vercel에 DATABASE_URL을 설정하면 Supabase Postgres에 저장됩니다."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="flow">
          <article>
            <span>1</span>
            <h2>초대</h2>
            <p>동문별 초대 링크로 참가 의향과 원하는 분위기를 빠르게 수집합니다.</p>
          </article>
          <article>
            <span>2</span>
            <h2>매칭</h2>
            <p>졸업연도와 관심 분위기를 기준으로 파티 시작 전 대화 소재를 준비합니다.</p>
          </article>
          <article>
            <span>3</span>
            <h2>리텐션</h2>
            <p>파티 이후 다음 모임 후보를 남겨 재방문 트리거로 확장합니다.</p>
          </article>
        </div>

        <PartyJoinForm disabled={!databaseReady} />
      </section>
    </main>
  );
}

async function loadRegistrationCount() {
  try {
    return await getRegistrationCount();
  } catch {
    return null;
  }
}
