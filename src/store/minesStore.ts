import { create } from "zustand";
import type { MinesGameState } from "../types/mines";
import { MinesGameStatus } from "../types/mines";
import { calculateMinesMultiplier } from "../utils/minesMultiplier";
import { minesApi } from "../services/minesApi";

interface MinesStore extends MinesGameState {
  startGame: (betAmount: number, minesCount: number, userId: string, updateBalance: (userId: string, amount: number) => Promise<void>) => Promise<void>;
  revealTile: (index: number) => Promise<void>;
  cashOut: (userId: string, updateBalance: (userId: string, amount: number) => Promise<void>) => Promise<void>;
  reset: () => void;
  isRevealing: boolean;
}

const INITIAL_STATE: MinesGameState = {
  gameId: null,
  status: MinesGameStatus.Idle,
  betAmount: 0,
  minesCount: 3,
  revealedTiles: [],
  currentMultiplier: 1.0,
  potentialProfit: 0,
  tileStates: Array(25).fill("hidden"),
  minePositions: [],
};

export const useMinesStore = create<MinesStore>((set, get) => ({
  ...INITIAL_STATE,
  isRevealing: false,

  startGame: async (betAmount, minesCount, userId, updateBalance) => {
    try {
      await updateBalance(userId, -betAmount);

      const response = await minesApi.startGame({
        bet_amount: betAmount,
        mines_count: minesCount,
      });

      set({
        gameId: response.game_id,
        status: MinesGameStatus.Playing,
        betAmount,
        minesCount,
        revealedTiles: [],
        currentMultiplier: 1.0,
        potentialProfit: betAmount,
        tileStates: Array(25).fill("hidden"),
        minePositions: [],
      });
    } catch (error) {
      console.error("Failed to start game:", error);
      await updateBalance(userId, betAmount);
      throw error;
    }
  },

  revealTile: async (index: number) => {
    const state = get();

    if (state.status !== MinesGameStatus.Playing || state.isRevealing || !state.gameId) {
      return;
    }

    if (state.revealedTiles.includes(index)) {
      return;
    }

    set({ isRevealing: true });

    try {
      const response = await minesApi.revealTile({
        game_id: state.gameId,
        tile_index: index,
      });

      if (response.result === "mine") {
        const newTileStates = [...state.tileStates];
        newTileStates[index] = "mine";

        if (response.mine_positions) {
          response.mine_positions.forEach((pos) => {
            newTileStates[pos] = "mine";
          });
        }

        set({
          status: MinesGameStatus.Lost,
          tileStates: newTileStates,
          minePositions: response.mine_positions || [],
          isRevealing: false,
        });

        setTimeout(() => {
          get().reset();
        }, 3000);
      } else {
        const newTileStates = [...state.tileStates];
        newTileStates[index] = "safe";

        const newRevealedTiles = [...state.revealedTiles, index];
        const newMultiplier = calculateMinesMultiplier(state.minesCount, newRevealedTiles.length);
        const newPotentialProfit = state.betAmount * newMultiplier;

        set({
          tileStates: newTileStates,
          revealedTiles: newRevealedTiles,
          currentMultiplier: newMultiplier,
          potentialProfit: newPotentialProfit,
          isRevealing: false,
        });
      }
    } catch (error) {
      console.error("Failed to reveal tile:", error);
      set({ isRevealing: false });
    }
  },

  cashOut: async (userId, updateBalance) => {
    const state = get();

    if (state.status !== MinesGameStatus.Playing || !state.gameId) {
      return;
    }

    try {
      const response = await minesApi.cashOut({
        game_id: state.gameId,
      });

      const newTileStates = [...state.tileStates];
      response.mine_positions.forEach((pos) => {
        if (newTileStates[pos] === "hidden") {
          newTileStates[pos] = "mine";
        }
      });

      await updateBalance(userId, response.payout);

      set({
        status: MinesGameStatus.Won,
        tileStates: newTileStates,
        minePositions: response.mine_positions,
        currentMultiplier: response.final_multiplier,
        potentialProfit: response.payout,
      });

      setTimeout(() => {
        get().reset();
      }, 3000);
    } catch (error) {
      console.error("Failed to cash out:", error);
    }
  },

  reset: () => {
    set(INITIAL_STATE);
  },
}));

