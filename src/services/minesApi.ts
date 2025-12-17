import type {
  StartMinesGameRequest,
  StartMinesGameResponse,
  RevealTileRequest,
  RevealTileResponse,
  CashOutRequest,
  CashOutResponse,
} from "../types/mines";
import { generateMultiplierTable } from "../utils/minesMultiplier";

interface ActiveGame {
  gameId: string;
  betAmount: number;
  minesCount: number;
  minePositions: number[];
  revealedTiles: number[];
  serverSeed: string;
}

const activeGames = new Map<string, ActiveGame>();

function generateMinePositions(count: number): number[] {
  const positions: number[] = [];
  const available = Array.from({ length: 25 }, (_, i) => i);

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    positions.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }

  return positions.sort((a, b) => a - b);
}

function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateServerSeedHash(): string {
  return `hash_${Math.random().toString(36).substr(2, 16)}`;
}

export async function startMinesGame(
  request: StartMinesGameRequest
): Promise<StartMinesGameResponse> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const gameId = generateGameId();
  const minePositions = generateMinePositions(request.mines_count);
  const serverSeed = `seed_${Math.random().toString(36).substr(2, 20)}`;

  activeGames.set(gameId, {
    gameId,
    betAmount: request.bet_amount,
    minesCount: request.mines_count,
    minePositions,
    revealedTiles: [],
    serverSeed,
  });

  const multiplierTable = generateMultiplierTable(request.mines_count);

  return {
    game_id: gameId,
    server_seed_hash: generateServerSeedHash(),
    multiplier_table: multiplierTable,
  };
}

export async function revealMineTile(
  request: RevealTileRequest
): Promise<RevealTileResponse> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const game = activeGames.get(request.game_id);

  if (!game) {
    throw new Error("Game not found");
  }

  if (game.revealedTiles.includes(request.tile_index)) {
    throw new Error("Tile already revealed");
  }

  const isMine = game.minePositions.includes(request.tile_index);

  if (isMine) {
    return {
      result: "mine",
      current_multiplier: 0,
      revealed_tiles: [...game.revealedTiles, request.tile_index],
      mine_positions: game.minePositions,
    };
  }

  game.revealedTiles.push(request.tile_index);

  const multiplierTable = generateMultiplierTable(game.minesCount);
  const currentMultiplier = multiplierTable[game.revealedTiles.length];

  return {
    result: "safe",
    current_multiplier: currentMultiplier,
    revealed_tiles: [...game.revealedTiles],
  };
}

export async function cashOutMines(
  request: CashOutRequest
): Promise<CashOutResponse> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const game = activeGames.get(request.game_id);

  if (!game) {
    throw new Error("Game not found");
  }

  const multiplierTable = generateMultiplierTable(game.minesCount);
  const finalMultiplier = multiplierTable[game.revealedTiles.length];
  const payout = game.betAmount * finalMultiplier;

  activeGames.delete(request.game_id);

  return {
    payout,
    final_multiplier: finalMultiplier,
    mine_positions: game.minePositions,
    server_seed: game.serverSeed,
  };
}

