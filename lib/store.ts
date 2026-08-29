import type { Block, Order, OrderStatus, SongRequest } from "./types";

/**
 * 데모 스토어. 주문·신청곡·재생 정보를 브라우저(localStorage)에 두고,
 * 같은 탭은 커스텀 이벤트로, 다른 탭은 storage 이벤트로 잇는다.
 * 한 브라우저에서 참가자 탭과 대시보드 탭을 열면 플로우 전체가 실시간처럼 돈다.
 * TODO(미정): 스키마 확정 후 이 모듈만 Supabase(Postgres + Realtime)로 바꾼다.
 * 화면 쪽 코드는 이 모듈의 함수만 알므로 교체 범위가 여기로 갇힌다.
 */

const CHANGE_EVENT = "nemo-store-change";
const SESSION_KEY = "nemo-session";

const ordersKey = (eventId: string) => `nemo-orders:${eventId}`;
const songsKey = (eventId: string) => `nemo-songs:${eventId}`;
const nowKey = (eventId: string) => `nemo-now:${eventId}`;
const lastSongKey = (eventId: string) => `nemo-last-song:${eventId}`;

/** 팀 결정: 익명 세션당 대기 중 신청곡 2곡, 신청 사이 60초. */
export const SONG_PENDING_LIMIT = 2;
export const SONG_COOLDOWN_MS = 60_000;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 실패(시크릿 모드 등)해도 화면은 계속 돈다.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** 브라우저 단위 익명 세션. 로그인 없이 "내 주문"을 이걸로 찾는다. */
export function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}

/** 스토어가 바뀔 때마다 cb를 부른다. 해제 함수를 돌려준다. */
export function subscribe(cb: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// ---------- 주문 ----------

export function loadOrders(eventId: string): Order[] {
  return read<Order[]>(ordersKey(eventId), []);
}

export function placeOrder(
  eventId: string,
  zone: Block,
  items: { name: string; qty: number }[],
): Order {
  const orders = loadOrders(eventId);
  const order: Order = {
    id: crypto.randomUUID(),
    no: Math.max(0, ...orders.map((o) => o.no)) + 1,
    eventId,
    zoneId: zone.id,
    zoneName: zone.name,
    items,
    status: "placed",
    sessionId: getSessionId(),
    createdAt: new Date().toISOString(),
  };
  write(ordersKey(eventId), [...orders, order]);
  return order;
}

export function setOrderStatus(
  eventId: string,
  orderId: string,
  status: OrderStatus,
) {
  write(
    ordersKey(eventId),
    loadOrders(eventId).map((o) => (o.id === orderId ? { ...o, status } : o)),
  );
}

/** 팀 결정: 내 앞 팀 수 = 같은 존에서 나보다 먼저 접수됐고 아직 접수 상태인 주문 수. */
export function aheadCount(orders: Order[], order: Order): number {
  return orders.filter(
    (o) => o.zoneId === order.zoneId && o.status === "placed" && o.no < order.no,
  ).length;
}

/** 팀 결정: 세션당 미처리(접수·완성) 주문은 1건. 그 1건을 찾는다. */
export function activeOrder(orders: Order[], sessionId: string): Order | null {
  return (
    orders.find(
      (o) =>
        o.sessionId === sessionId &&
        (o.status === "placed" || o.status === "ready"),
    ) ?? null
  );
}

// ---------- 신청곡 ----------

export function loadSongs(eventId: string): SongRequest[] {
  return read<SongRequest[]>(songsKey(eventId), []);
}

export function addSong(eventId: string, zoneId: string, title: string) {
  const song: SongRequest = {
    id: crypto.randomUUID(),
    eventId,
    zoneId,
    title,
    sessionId: getSessionId(),
    createdAt: new Date().toISOString(),
  };
  write(songsKey(eventId), [...loadSongs(eventId), song]);
  write(lastSongKey(eventId), Date.now());
}

export function removeSong(eventId: string, songId: string) {
  write(
    songsKey(eventId),
    loadSongs(eventId).filter((s) => s.id !== songId),
  );
}

/** 다음 신청까지 남은 시간(ms). 0이면 신청할 수 있다. */
export function songCooldownLeft(eventId: string): number {
  const last = read<number>(lastSongKey(eventId), 0);
  return Math.max(0, last + SONG_COOLDOWN_MS - Date.now());
}

// ---------- 지금 나오는 곡 ----------

export function loadNowPlaying(eventId: string): string {
  return read<string>(nowKey(eventId), "");
}

export function setNowPlaying(eventId: string, title: string) {
  write(nowKey(eventId), title);
}
