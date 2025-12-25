export type MinesGameStatus = "idle" | "playing" | "won" | "lost";

export type TileState = "hidden" | "safe" | "mine" | "blocked";

export interface MinesGameState {
  gameId: string | null;
  status: MinesGameStatus;
  betAmount: number;
  minesCount: number;
  revealedTiles: number[];
  currentMultiplier: number;
  potentialProfit: number;
  tileStates: TileState[];
  minePositions: number[];
}

export interface StartMinesGameRequest {
  bet_amount: number;
  mines_count: number;
  client_seed?: string;
}

export interface RevealTileRequest {
  game_id: string;
  tile_index: number;
}

export interface CashOutRequest {
  game_id: string;
}

export interface StartMinesGameResponse {
  game_id: string;
  server_seed_hash: string;
  multiplier_table: number[];
}

export interface RevealTileResponse {
  result: "safe" | "mine";
  current_multiplier: number;
  revealed_tiles: number[];
  mine_positions?: number[];
}

export interface CashOutResponse {
  payout: number;
  final_multiplier: number;
  mine_positions: number[];
  server_seed: string;
}

