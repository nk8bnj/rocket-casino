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

export interface Round {
  id: string;
  crash_point: number;
  started_at: string;
  ended_at?: string;
  status: "waiting" | "running" | "crashed";
}

export interface Bonus {
  id: string;
  user_id: string;
  amount: number;
  claimed_at: string;
  streak: number;
}

export interface GameState {
  status: "waiting" | "running" | "crashed" | "won";
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
