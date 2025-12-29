import { create } from "zustand";
import type {
  PlinkoGameState,
  BallState,
  SavedSettings,
  HistoryEntry,
} from "../types/plinko";

const BET_PER_BALL = 2.0;
const STORAGE_KEYS = {
  SETTINGS: "plinko_settings",
  HISTORY: "plinko_history",
} as const;

interface PlinkoStore extends PlinkoGameState {
  _userId: string | null;
  _updateBalance: ((userId: string, amount: number) => Promise<void>) | null;

  updateSettings: (settings: Partial<Pick<PlinkoGameState, "riskLevel" | "linesCount" | "ballsCount">>) => void;
  startDrop: (userId: string, updateBalance: (userId: string, amount: number) => Promise<void>) => Promise<void>;
  completeBall: (ballId: string, actualSlotIndex?: number) => Promise<void>;
  addToHistory: (entry: HistoryEntry) => void;
  getHistory: () => HistoryEntry[];
  reset: () => void;
}

const INITIAL_STATE: PlinkoGameState = {
  gameId: null,
  status: "idle",
  riskLevel: "medium",
  linesCount: 16,
  ballsCount: 1,
  activeBalls: [],
  completedBalls: [],
  totalBet: 0,
  totalProfit: 0,
};

function loadSettings(): Partial<PlinkoGameState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      const settings: SavedSettings = JSON.parse(saved);
      return {
        riskLevel: settings.riskLevel,
        linesCount: settings.linesCount,
        ballsCount: settings.ballsCount,
      };
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
  return {};
}

function saveSettings(settings: Pick<PlinkoGameState, "riskLevel" | "linesCount" | "ballsCount">) {
  try {
    const toSave: SavedSettings = {
      riskLevel: settings.riskLevel,
      linesCount: settings.linesCount,
      ballsCount: settings.ballsCount,
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(toSave));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

export const usePlinkoStore = create<PlinkoStore>((set, get) => ({
  ...INITIAL_STATE,
  ...loadSettings(),
  _userId: null,
  _updateBalance: null,

  updateSettings: (settings) => {
    const currentState = get();
    const newSettings = {
      riskLevel: settings.riskLevel ?? currentState.riskLevel,
      linesCount: settings.linesCount ?? currentState.linesCount,
      ballsCount: settings.ballsCount ?? currentState.ballsCount,
    };

    set(newSettings);
    saveSettings(newSettings);
  },

  startDrop: async (userId, updateBalance) => {
    const state = get();

    if (state.status === "dropping") {
      return;
    }

    const totalBet = state.ballsCount * BET_PER_BALL;

    try {
      await updateBalance(userId, -totalBet);

      const { startPlinkoGame } = await import("../services/plinkoApi");
      const response = await startPlinkoGame({
        risk_level: state.riskLevel,
        lines_count: state.linesCount,
        balls_count: state.ballsCount,
        bet_per_ball: BET_PER_BALL,
      });

      const STAGGER_DELAY_MS = 150;
      const activeBalls: BallState[] = response.ball_paths.map((ballPath, index) => ({
        id: ballPath.ball_id,
        path: ballPath.path,
        slotIndex: ballPath.slot_index,
        multiplier: ballPath.multiplier,
        visualPath: ballPath.visual_path,
        status: "dropping" as const,
        startTime: Date.now() + (index * STAGGER_DELAY_MS),
      }));

      set({
        gameId: response.game_id,
        status: "dropping",
        totalBet,
        totalProfit: 0,
        activeBalls,
        completedBalls: [],
        _userId: userId,
        _updateBalance: updateBalance,
      });
    } catch (error) {
      console.error("Failed to start drop:", error);
      try {
        await updateBalance(userId, totalBet);
      } catch (refundError) {
        console.error("Failed to refund balance:", refundError);
      }
      throw error;
    }
  },

  completeBall: async (ballId, actualSlotIndex) => {
    const state = get();

    const ballIndex = state.activeBalls.findIndex((b) => b.id === ballId);
    if (ballIndex === -1) {
      console.warn(`Ball ${ballId} not found in active balls`);
      return;
    }

    const ball = state.activeBalls[ballIndex];

    const finalSlotIndex = actualSlotIndex !== undefined ? actualSlotIndex : ball.slotIndex;

    let finalMultiplier = ball.multiplier;
    if (actualSlotIndex !== undefined) {
      const { getMultiplier } = await import("../utils/plinkoMultiplier");
      finalMultiplier = getMultiplier(state.riskLevel, state.linesCount, actualSlotIndex);
    }

    const profit = BET_PER_BALL * finalMultiplier;

    const completedBall: typeof state.completedBalls[0] = {
      id: ball.id,
      betAmount: BET_PER_BALL,
      multiplier: finalMultiplier,
      profit,
      slotIndex: finalSlotIndex,
    };

    const newActiveBalls = state.activeBalls.filter((_, i) => i !== ballIndex);
    const newCompletedBalls = [...state.completedBalls, completedBall];
    const newTotalProfit = state.totalProfit + profit;

    set({
      activeBalls: newActiveBalls,
      completedBalls: newCompletedBalls,
      totalProfit: newTotalProfit,
    });

    if (newActiveBalls.length === 0) {
      set({ status: "completed" });

      if (state._userId && state._updateBalance) {
        try {
          await state._updateBalance(state._userId, newTotalProfit);
        } catch (error) {
          console.error("Failed to update balance:", error);
        }
      }

      const historyEntry: HistoryEntry = {
        id: state.gameId || `history_${Date.now()}`,
        timestamp: Date.now(),
        riskLevel: state.riskLevel,
        linesCount: state.linesCount,
        ballsCount: state.ballsCount,
        totalBet: state.totalBet,
        results: newCompletedBalls.map((b) => ({
          slotIndex: b.slotIndex,
          multiplier: b.multiplier,
          profit: b.profit,
        })),
        totalProfit: newTotalProfit,
        netProfit: newTotalProfit - state.totalBet,
      };

      get().addToHistory(historyEntry);

      setTimeout(() => {
        get().reset();
      }, 3000);
    }
  },

  addToHistory: (entry) => {
    try {
      const history = get().getHistory();
      history.unshift(entry);

      const MAX_HISTORY = 100;
      if (history.length > MAX_HISTORY) {
        history.splice(MAX_HISTORY);
      }

      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  },

  getHistory: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load history:", error);
      return [];
    }
  },

  reset: () => {
    set({
      ...INITIAL_STATE,
      riskLevel: get().riskLevel,
      linesCount: get().linesCount,
      ballsCount: get().ballsCount,
    });
  },
}));
