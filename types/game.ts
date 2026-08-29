export type GameId = "kahoot" | "quiplash" | "liar" | "hunmin";

export interface GameInfo {
  id: GameId;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  bgGradient: string;
}

export interface KahootQuestion {
  id: string;
  title: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export interface QuiplashPrompt {
  id: string;
  question: string;
}

export interface LiarGameWord {
  id: string;
  category: string;
  word: string;
}

export interface HunminPrompt {
  id: string;
  choseong: string;
  examples: string[];
}
