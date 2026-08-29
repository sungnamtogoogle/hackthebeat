/**
 * 도메인 타입의 정본. 지도 홈·에디터·운영 대시보드가 공유한다.
 * "TODO(미정)"은 팀이 아직 결정하지 않아 비워둔 자리다.
 */

/** 존 역할. order는 카페·스낵처럼 메뉴를 파는 존을 포괄한다. */
export type ZoneRole = "order" | "dj";

export interface MenuItem {
  name: string;
  price: number | null; // TODO(미정): 가격 표기 여부. 무료 행사면 null
  soldOut: boolean;
}

/** 도면 블록 하나. 좌표는 40px 격자 단위. */
export interface Block {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  role: ZoneRole | null; // null이면 일반 공간(탭 불가)
  menu?: MenuItem[]; // role이 order일 때만 쓴다
}

/** events 테이블 한 행. 도면(blocks)은 jsonb 한 컬럼에 통으로 들어간다. */
export interface EventDoc {
  id: string;
  name: string;
  open: boolean;
  blocks: Block[];
  // TODO(미정): 날짜·장소 필드, 공동 주최자
}

export const ORDER_STATUSES = [
  "placed",
  "preparing",
  "ready",
  "done",
  "canceled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "접수",
  preparing: "준비중",
  ready: "픽업대기",
  done: "완료",
  canceled: "취소",
};

/** 운영 대시보드의 "다음 상태" 버튼이 따르는 전이. */
export const NEXT_ORDER_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "preparing",
  preparing: "ready",
  ready: "done",
};

export interface Order {
  id: string;
  eventId: string;
  zoneId: string;
  items: { name: string; qty: number }[];
  status: OrderStatus;
  createdAt: string;
  // TODO(미정): 주문번호 채번 방식, 익명 세션 식별 필드
}

export interface SongRequest {
  id: string;
  eventId: string;
  zoneId: string;
  title: string;
  createdAt: string;
  // TODO(미정): 좋아요 투표, 재생 완료 플래그
}
