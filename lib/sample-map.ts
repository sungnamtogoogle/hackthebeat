import type { Block, EventDoc } from "./types";

/**
 * 팀원들의 도면 구조에 4대 유명 파티 게임(Kahoot, Quiplash, Liar, Hunmin) 모드를 각 존별로 배치
 */
export const SAMPLE_BLOCKS: Block[] = [
  {
    id: "lounge",
    name: "🎯 라운지 카후트 퀴즈 부스",
    x: 1, y: 7, w: 12, h: 10,
    role: "order",
    gameId: "kahoot",
    menu: [
      { name: "카후트 4색 퀴즈", price: null, soldOut: false },
      { name: "신청곡 넣기 🎵", price: null, soldOut: false },
    ],
  },
  {
    id: "cafe",
    name: "🤣 카페 퀴플래시 드립 부스",
    x: 1, y: 1, w: 5, h: 6,
    role: "order",
    gameId: "quiplash",
    menu: [
      { name: "퀴플래시 1:1 드립 배틀", price: null, soldOut: false },
      { name: "블루하와이 칵테일", price: null, soldOut: false },
      { name: "얼박사", price: null, soldOut: false },
    ],
  },
  {
    id: "library",
    name: "🎭 도서관 라이어 게임 부스",
    x: 13, y: 10, w: 7, h: 7,
    role: "order",
    gameId: "liar",
    menu: [
      { name: "라이어 게임 (심리 추리전)", price: null, soldOut: false },
      { name: "팝콘 & 핑거푸드", price: null, soldOut: false },
    ],
  },
  {
    id: "t-lounge",
    name: "🔤 T라운지 훈민정음 부스",
    x: 25, y: 7, w: 4, h: 6,
    role: "order",
    gameId: "hunmin",
    menu: [
      { name: "훈민정음 0.1초 타임어택", price: null, soldOut: false },
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
];

export const SAMPLE_EVENT: EventDoc = {
  id: "demo",
  name: "성남 동문 Hack the Beat 파티",
  open: true,
  blocks: SAMPLE_BLOCKS,
};
