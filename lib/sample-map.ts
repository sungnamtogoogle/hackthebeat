import type { Block, EventDoc } from "./types";

/**
 * 프로토타입에서 옮겨온 샘플 도면(사무실 배치).
 * TODO: Supabase 연동 후에는 events 테이블에서 읽는다. /e/demo 전용으로만 남긴다.
 */
export const SAMPLE_BLOCKS: Block[] = [
  {
    id: "lounge", name: "라운지", x: 1, y: 7, w: 12, h: 10, role: "dj",
  },
  {
    id: "cafe", name: "카페", x: 1, y: 1, w: 5, h: 6, role: "order",
    menu: [
      { name: "블루하와이", price: null, soldOut: false },
      { name: "얼박사", price: null, soldOut: false },
    ],
  },
  {
    id: "library", name: "도서관", x: 13, y: 10, w: 7, h: 7, role: "order",
    menu: [
      { name: "팝콘", price: null, soldOut: false },
      { name: "핫도그", price: null, soldOut: false },
    ],
  },
  { id: "wc-m", name: "화장실(남)", x: 8, y: 1, w: 6, h: 2, role: null },
  { id: "wc-f", name: "화장실(여)", x: 17, y: 1, w: 6, h: 2, role: null },
  { id: "stair-l", name: "계단", x: 8, y: 3, w: 2, h: 3, role: null },
  { id: "stair-r", name: "계단", x: 21, y: 3, w: 2, h: 3, role: null },
  { id: "core-l", name: "코어", x: 10, y: 3, w: 4, h: 4, role: null },
  { id: "core-r", name: "코어", x: 17, y: 3, w: 2, h: 4, role: null },
  { id: "util", name: "설비", x: 19, y: 3, w: 2, h: 4, role: null },
  { id: "fridge", name: "냉장창고", x: 6, y: 7, w: 3, h: 2, role: null },
  { id: "reception", name: "리셉션", x: 15, y: 7, w: 5, h: 2, role: null },
  { id: "storage", name: "창고", x: 16, y: 9, w: 3, h: 1, role: null },
  { id: "dokdo", name: "독도", x: 21, y: 8, w: 2, h: 2, role: null },
  { id: "seychelles", name: "세이셀", x: 21, y: 10, w: 2, h: 2, role: null },
  { id: "holdiv", name: "홀디브", x: 23, y: 8, w: 2, h: 4, role: null },
  { id: "sustain", name: "지속가능성", x: 21, y: 12, w: 4, h: 4, role: null },
  { id: "good", name: "좋은것", x: 25, y: 1, w: 4, h: 6, role: null },
  { id: "t-lounge", name: "T라운지", x: 25, y: 7, w: 4, h: 2, role: null },
  { id: "grit", name: "집념", x: 25, y: 9, w: 4, h: 2, role: null },
  { id: "sincerity", name: "진정성", x: 25, y: 11, w: 4, h: 3, role: null },
  { id: "diversity", name: "다양성", x: 25, y: 13, w: 4, h: 4, role: null },
];

export const SAMPLE_EVENT: EventDoc = {
  id: "demo",
  name: "데모 파티",
  open: true,
  blocks: SAMPLE_BLOCKS,
};
