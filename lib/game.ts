import { ZoneId, ZoneInfo, BalanceQuestion } from "@/types/game";

export const ZONES: Record<ZoneId, ZoneInfo> = {
  bar: {
    id: "bar",
    name: "Bar Zone",
    emoji: "🍸",
    description: "칵테일과 핑거푸드가 가득한 핫스팟! 분위기를 띄울 알코올 & 연애 취향 밸런스",
    tagline: "알코올 & 연애 취향 존",
    bgGradient: "from-purple-900 via-indigo-900 to-black",
  },
  balcony: {
    id: "balcony",
    name: "Balcony Zone",
    emoji: "🌙",
    description: "시원한 밤바람을 맞으며 진솔한 대화를 나누는 스포트라이트 존!",
    tagline: "심야 속마음 & 가치관 존",
    bgGradient: "from-blue-900 via-slate-900 to-black",
  },
  living: {
    id: "living",
    name: "Living Room Zone",
    emoji: "🔥",
    description: "파티의 메인 스테이지! 모두 함께 웃고 즐기는 인싸 게임 존",
    tagline: "메인 인싸 & 유머 밸런스 존",
    bgGradient: "from-rose-900 via-pink-900 to-black",
  },
};

export const BALANCE_QUESTIONS: Record<ZoneId, BalanceQuestion[]> = {
  bar: [
    {
      id: "bar-1",
      zoneId: "bar",
      title: "오늘 파티에서 마음에 드는 이성에게 다가가는 내 스타일은?",
      optionA: "자연스럽게 눈맞추고 칵테일 권하며 대화 물꼬 트기",
      optionB: "주변 친구들이랑 크게 웃으며 먼저 신나게 존재감 어필하기",
      tagA: "#감성직진파",
      tagB: "#분위기주도파",
    },
    {
      id: "bar-2",
      zoneId: "bar",
      title: "파티가 끝난 후 새벽 2시, 더 끌리는 애프터 코스는?",
      optionA: "조용한 LP바나 수제맥주집에서 1:1 깊은 대화",
      optionB: "24시 국밥집에서 해장하며 배꼽 잡는 뒷풀이",
      tagA: "#로맨틱LP",
      tagB: "#해장국밥",
    },
  ],
  balcony: [
    {
      id: "balcony-1",
      zoneId: "balcony",
      title: "살면서 더 용납하기 힘든 파티 꼴불견은?",
      optionA: "대화할 때 휴대폰만 들여다보며 건성 응대하기",
      optionB: "술 취해서 안 멈추고 자랑만 30분째 이어가기",
      tagA: "#스마트폰유령",
      tagB: "#자기자랑투머치",
    },
    {
      id: "balcony-2",
      zoneId: "balcony",
      title: "나와 더 잘 통하는 동문/친구의 특징은?",
      optionA: "새로운 도전 이야기할 때 눈빛이 살아나는 야망가",
      optionB: "고민 들을 때 말없이 따뜻하게 공감해주는 힐러",
      tagA: "#야망열정",
      tagB: "#따스한공감",
    },
  ],
  living: [
    {
      id: "living-1",
      zoneId: "living",
      title: "파티장에서 호스트가 내게 부탁할 때 더 기분 좋은 역할은?",
      optionA: "BGM 디제잉 맡아서 현장 사운드 싹 잡기",
      optionB: "즉석 이벤트 진행자 맡아서 마이크 잡고 진행하기",
      tagA: "#파티DJ",
      tagB: "#마이크MC",
    },
    {
      id: "living-2",
      zoneId: "living",
      title: "성남 동문 파티 'Hack the Beat' 최고의 순간은?",
      optionA: "뜻밖의 동문/친구를 새로 알고 인스타그램 팔로우할 때",
      optionB: "다 같이 밸런스 게임하며 배 잡고 터지는 순간",
      tagA: "#인연매칭",
      tagB: "#폭소게임",
    },
  ],
};

export function getRandomQuestion(zoneId: ZoneId): BalanceQuestion {
  const list = BALANCE_QUESTIONS[zoneId] || BALANCE_QUESTIONS.bar;
  return list[Math.floor(Math.random() * list.length)];
}

export function generateRoomCode(zoneId: ZoneId): string {
  const prefix = zoneId.toUpperCase().slice(0, 3);
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}
