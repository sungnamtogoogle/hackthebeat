export type ZoneId = "bar" | "balcony" | "living";

export interface ZoneInfo {
  id: ZoneId;
  name: string;
  emoji: string;
  description: string;
  tagline: string;
  bgGradient: string;
}

export interface BalanceQuestion {
  id: string;
  zoneId: ZoneId;
  title: string;
  optionA: string;
  optionB: string;
  tagA: string;
  tagB: string;
}

export interface RoomState {
  code: string;
  zoneId: ZoneId;
  question: BalanceQuestion;
  hostName: string;
  createdAt: string;
}

export interface VoteEvent {
  roomCode: string;
  option: "A" | "B";
  voterName?: string;
  timestamp: number;
}

export type RealtimeVotePayload = {
  type: "VOTE";
  option: "A" | "B";
  voterName?: string;
};
