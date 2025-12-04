import { create } from "zustand";
import type { GameState } from "../types";
import { GameStatus } from "../types";

interface GameStore extends GameState {
  startRound: () => void;
  updateMultiplier: (multiplier: number) => void;
  crashRound: () => void;
  placeBet: (amount: number, autoCashOut?: number) => void;
  cashOut: () => number | null;
  reset: () => void;
}

const MULTIPLIER_INCREMENT = 0.01;
const UPDATE_INTERVAL = 50;

export const useGameStore = create<GameStore>((set, get) => ({
  status: GameStatus.Waiting,
  multiplier: 1.0,
  crashPoint: 0,
  currentBet: null,
  autoCashOut: null,
  hasCashedOut: false,

  startRound: () => {
    const crashPoint = Math.random() * 9 + 1.01;

    set({
      status: GameStatus.Running,
      multiplier: 1.0,
      crashPoint: parseFloat(crashPoint.toFixed(2)),
      hasCashedOut: false,
    });

    const interval = setInterval(() => {
      const state = get();

      if (state.status !== GameStatus.Running) {
        clearInterval(interval);
        return;
      }

      const newMultiplier = parseFloat(
        (state.multiplier + MULTIPLIER_INCREMENT).toFixed(2)
      );

      if (newMultiplier >= state.crashPoint) {
        clearInterval(interval);
        get().crashRound();
        return;
      }

      if (
        state.autoCashOut &&
        !state.hasCashedOut &&
        newMultiplier >= state.autoCashOut
      ) {
        get().cashOut();
      }

      set({ multiplier: newMultiplier });
    }, UPDATE_INTERVAL);
  },

  updateMultiplier: (multiplier: number) => {
    set({ multiplier });
  },

  crashRound: () => {
    set({ status: GameStatus.Crashed });

    setTimeout(() => {
      get().reset();
    }, 3000);
  },

  placeBet: (amount: number, autoCashOut?: number) => {
    set({
      currentBet: amount,
      autoCashOut: autoCashOut || null,
    });
  },

  cashOut: () => {
    const state = get();

    if (!state.currentBet || state.hasCashedOut || state.status !== "running") {
      return null;
    }

    const profit = state.currentBet * state.multiplier;

    set({
      hasCashedOut: true,
      status: GameStatus.Won,
    });

    setTimeout(() => {
      get().reset();
    }, 3000);

    return profit;
  },

  reset: () => {
    set({
      status: GameStatus.Waiting,
      multiplier: 1.0,
      crashPoint: 0,
      currentBet: null,
      autoCashOut: null,
      hasCashedOut: false,
    });
  },
}));
