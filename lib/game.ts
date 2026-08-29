import { GameId, GameInfo, KahootQuestion, QuiplashPrompt, LiarGameWord, HunminPrompt } from "@/types/game";

export const GAMES: Record<GameId, GameInfo> = {
  kahoot: {
    id: "kahoot",
    name: "카후트 (Kahoot 4색 퀴즈)",
    emoji: "🎯",
    tagline: "원조 4색 버튼 스피드 타임어택",
    description: "호스트 대형 화면의 퀴즈에 맞춰 4가지 색상(🔴🔵🟡🟢) 버튼을 폰으로 가장 빠르게 눌러 실시간 1위에 도전하는 스피드전!",
    bgGradient: "from-purple-900 via-rose-900 to-black",
  },
  quiplash: {
    id: "quiplash",
    name: "퀴플래시 (Quiplash 드립 배틀)",
    emoji: "🤣",
    tagline: "1:1 실시간 드립 관중 투표",
    description: "초면 참가자 2명의 신박한 드립 답변이 1:1로 대형 화면에 띄워지고, 현장 관중들이 실시간으로 투표하는 드립 대결!",
    bgGradient: "from-amber-900 via-rose-900 to-black",
  },
  liar: {
    id: "liar",
    name: "라이어 게임 (Liar Game)",
    emoji: "🎭",
    tagline: "비밀 역할 부여 & 심리 추리",
    description: "단 1명에게만 제시어가 숨겨진 '라이어' 역할이 부여됩니다! 힌트를 주고받으며 심리전으로 라이어를 적발하세요!",
    bgGradient: "from-blue-900 via-slate-900 to-black",
  },
  hunmin: {
    id: "hunmin",
    name: "훈민정음 (초성 스피드전)",
    emoji: "🔤",
    tagline: "0.1초 순발력 타임어택",
    description: "화면에 초성(예: ㄷ ㄱ)이 등장하면 자기 폰으로 0.1초 만에 가장 빠르게 단어를 입력해 승리하는 타임어택 게임!",
    bgGradient: "from-rose-900 via-pink-900 to-black",
  },
};

export const KAHOOT_QUESTIONS: KahootQuestion[] = [
  {
    id: "k-1",
    title: "처음 만난 사람과 3초 만에 친해질 때 가장 효과적인 방법은?",
    options: ["멀뚱멀뚱 폰만 보기", "파티 QR 찍고 라이어 게임하기", "자기자랑 30분하기", "조용히 집 가기"],
    correctIndex: 1,
  },
  {
    id: "k-2",
    title: "오늘 파티 'Hack the Beat'에서 가장 재미있는 게임 1위는?",
    options: ["카후트 🎯", "퀴플래시 🤣", "라이어 게임 🎭", "훈민정음 🔤"],
    correctIndex: 0,
  },
];

export const QUIPLASH_PROMPTS: QuiplashPrompt[] = [
  {
    id: "q-1",
    question: "처음 본 사람에게 건넬 때 가장 반응이 폭발적인 첫 마디는?",
  },
  {
    id: "q-2",
    question: "파티장에서 절대 하면 안 되는 최악의 꼴불견 1위는?",
  },
];

export const LIAR_WORDS: LiarGameWord[] = [
  { id: "l-1", category: "음식", word: "삼겹살" },
  { id: "l-2", category: "장소", word: "파티룸" },
  { id: "l-3", category: "음료", word: "하이볼" },
];

export const HUNMIN_PROMPTS: HunminPrompt[] = [
  { id: "h-1", choseong: "ㄷ ㄱ", examples: ["당근", "대구", "동개", "달걀"] },
  { id: "h-2", choseong: "ㅍ ㅌ", examples: ["파티", "포토", "패딩", "포틴"] },
  { id: "h-3", choseong: "ㅎ ㄱ", examples: ["한글", "한강", "호구", "해커"] },
];

export function generateRoomCode(gameId: GameId): string {
  const prefix = gameId.toUpperCase().slice(0, 3);
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}
