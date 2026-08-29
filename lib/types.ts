export type ZoneRole = "order" | "dj";

export interface MenuItem {
  name: string;
  price: number | null;
  soldOut: boolean;
}

export interface Block {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  role: ZoneRole | null;
  gameId?: string;
  menu?: MenuItem[];
}

export interface EventDoc {
  id: string;
  name: string;
  open: boolean;
  blocks: Block[];
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
}

export interface SongRequest {
  id: string;
  eventId: string;
  zoneId: string;
  title: string;
  createdAt: string;
}
