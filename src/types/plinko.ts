export type RiskLevel = "low" | "medium" | "high";
export type LinesCount = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type BallsCount = 1 | 2 | 5 | 10;

export interface BallPath {
  path: number[];
  slotIndex: number;
  visualPath: VisualPathPoint[];
}

export interface VisualPathPoint {
  x: number;
  y: number;
  rotation: number;
}

export interface BallState {
  id: string;
  path: number[];
  slotIndex: number;
  multiplier: number;
  visualPath: VisualPathPoint[];
  status: "dropping" | "landed";
  startTime: number;
}

export interface BallResult {
  id: string;
  betAmount: number;
  multiplier: number;
  profit: number;
  slotIndex: number;
}

export interface PlinkoGameState {
  gameId: string | null;
  status: "idle" | "dropping" | "completed";

  riskLevel: RiskLevel;
  linesCount: LinesCount;
  ballsCount: BallsCount;

  activeBalls: BallState[];
  completedBalls: BallResult[];
  totalBet: number;
  totalProfit: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  riskLevel: RiskLevel;
  linesCount: number;
  ballsCount: number;
  totalBet: number;
  results: {
    slotIndex: number;
    multiplier: number;
    profit: number;
  }[];
  totalProfit: number;
  netProfit: number;
}

export interface SavedSettings {
  riskLevel: RiskLevel;
  linesCount: LinesCount;
  ballsCount: BallsCount;
}

export interface StartGameRequest {
  risk_level: RiskLevel;
  lines_count: LinesCount;
  balls_count: BallsCount;
  bet_per_ball: number;
}

export interface StartGameResponse {
  game_id: string;
  ball_paths: {
    ball_id: string;
    path: number[];
    slot_index: number;
    multiplier: number;
    visual_path: VisualPathPoint[];
  }[];
  total_bet: number;
  total_expected_profit: number;
}
