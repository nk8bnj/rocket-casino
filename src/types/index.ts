export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface Bet {
  id: string;
  user_id: string;
  round_id: string;
  amount: number;
  multiplier: number;
  profit: number;
  created_at: string;
}

export const GameStatus = {
  Waiting: "waiting",
  Running: "running",
  Crashed: "crashed",
  Won: "won",
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export const RoundStatus = {
  Waiting: "waiting",
  Running: "running",
  Crashed: "crashed",
} as const;

export type RoundStatus = (typeof RoundStatus)[keyof typeof RoundStatus];

export interface Round {
  id: string;
  crash_point: number;
  started_at: string;
  ended_at?: string;
  status: RoundStatus;
}

export interface Bonus {
  id: string;
  user_id: string;
  amount: number;
  claimed_at: string;
  streak: number;
}

export interface GameState {
  status: GameStatus;
  multiplier: number;
  crashPoint: number;
  currentBet: number | null;
  autoCashOut: number | null;
  hasCashedOut: boolean;
}

export interface UserStats {
  totalProfit: number;
  totalBets: number;
  highestMultiplier: number;
  streak: number;
}

export const GameTab = {
  Rocket: "rocket",
  Cases: "cases",
  Mines: "mines",
} as const;

export type GameTab = (typeof GameTab)[keyof typeof GameTab];
