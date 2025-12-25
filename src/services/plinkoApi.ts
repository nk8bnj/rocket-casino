import type { StartGameRequest, StartGameResponse } from "../types/plinko";
import { generateBallPath } from "../utils/plinkoPhysics";
import { getMultiplier } from "../utils/plinkoMultiplier";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateGameId(): string {
  return `plinko_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function startPlinkoGame(
  request: StartGameRequest
): Promise<StartGameResponse> {
  await delay(100 + Math.random() * 100);

  const gameId = generateGameId();
  const ballPaths: StartGameResponse["ball_paths"] = [];
  let totalExpectedProfit = 0;

  for (let i = 0; i < request.balls_count; i++) {
    const ballId = `${gameId}_ball_${i}`;

    const pathData = generateBallPath(request.lines_count);

    const multiplier = getMultiplier(
      request.risk_level,
      request.lines_count,
      pathData.slotIndex
    );

    const payout = request.bet_per_ball * multiplier;
    totalExpectedProfit += payout;

    ballPaths.push({
      ball_id: ballId,
      path: pathData.path,
      slot_index: pathData.slotIndex,
      multiplier,
      visual_path: pathData.visualPath,
    });
  }

  const totalBet = request.bet_per_ball * request.balls_count;

  return {
    game_id: gameId,
    ball_paths: ballPaths,
    total_bet: totalBet,
    total_expected_profit: totalExpectedProfit,
  };
}

export async function completePlinkoGame(gameId: string): Promise<{
  game_id: string;
  final_profit: number;
  timestamp: number;
}> {
  await delay(50);

  return {
    game_id: gameId,
    final_profit: 0,
    timestamp: Date.now(),
  };
}

export async function getPlinkoHistory(userId: string, limit: number = 20): Promise<any[]> {
  await delay(50);

  console.log(`[Mock API] History requested for user ${userId}, limit ${limit}`);
  return [];
}

export async function verifyPlinkoGame(
  gameId: string,
  _serverSeed: string,
  _clientSeed: string
): Promise<{
  verified: boolean;
  paths: number[][];
}> {
  await delay(100);

  console.log(`[Mock API] Verification requested for game ${gameId}`);

  return {
    verified: true,
    paths: [],
  };
}
