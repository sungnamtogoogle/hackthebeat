/**
 * 도메인 타입의 정본. 지도 홈·에디터·운영 대시보드가 공유한다.
 * "TODO(미정)"은 팀이 아직 결정하지 않아 비워둔 자리다.
 */

/** 존 역할. order는 카페·스낵처럼 메뉴를 파는 존을 포괄한다. */
export type ZoneRole = "order" | "dj";

export interface MenuItem {
  name: string;
  price: number | null; // 가격을 비우면 참가자에게 표시하지 않는다(무료 행사)
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

/**
 * 주문 상태는 3단계로 확정: 접수 → 완성(참가자 호출) → 전달완료.
 * 접수는 자동이고 제조자는 주문당 완성·전달 버튼 두 번만 누른다.
 * 준비중 단계는 데모 동선을 늘려서 뺐다. 취소는 별도 상태다.
 */
export const ORDER_STATUSES = ["placed", "ready", "done", "canceled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "접수",
  ready: "완성",
  done: "전달완료",
  canceled: "취소",
};

/** 운영 대시보드의 전이 버튼이 따르는 순서. */
export const NEXT_ORDER_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "ready",
  ready: "done",
};

/** 전이 버튼의 라벨. "완성"이 곧 참가자를 부르는 호출이다. */
export const NEXT_ORDER_ACTION: Partial<Record<OrderStatus, string>> = {
  placed: "완성",
  ready: "전달",
};

export interface Order {
  id: string;
  no: number; // 행사 안에서 1씩 커지는 호출 번호. 참가자를 이 번호로 부른다
  eventId: string;
  zoneId: string;
  zoneName: string; // 존이 지워져도 주문 카드가 읽히게 이름을 복사해 둔다
  items: { name: string; qty: number }[];
  status: OrderStatus;
  sessionId: string; // 익명 세션(브라우저 단위). 로그인 없음
  createdAt: string;
}

export interface SongRequest {
  id: string;
  eventId: string;
  zoneId: string;
  title: string;
  sessionId: string;
  createdAt: string;
  // TODO(미정): 좋아요 투표
}
