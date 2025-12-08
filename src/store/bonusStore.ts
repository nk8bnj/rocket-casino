import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../services/supabase";

interface BonusState {
  lastClaimed: string | null;
  streak: number;
  nextClaimTime: number;
  isLoading: boolean;
  error: string | null;
  canClaim: () => boolean;
  claimBonus: (userId: string) => Promise<number>;
  checkStreak: (userId: string) => Promise<void>;
  getTimeUntilNextClaim: () => number;
}

const BONUS_AMOUNT = 10;
const BONUS_INTERVAL = 60000;

export const useBonusStore = create<BonusState>()(
  persist(
    (set, get) => ({
      lastClaimed: null,
      streak: 0,
      nextClaimTime: 0,
      isLoading: false,
      error: null,

      canClaim: () => {
        const { nextClaimTime } = get();
        return Date.now() >= nextClaimTime;
      },

      claimBonus: async (userId: string) => {
        try {
          if (!get().canClaim()) {
            throw new Error("Bonus not ready yet");
          }

          set({ isLoading: true, error: null });

          const now = new Date().toISOString();
          const newStreak = get().streak + 1;

          const { error } = await supabase.from("bonuses").insert([
            {
              user_id: userId,
              amount: BONUS_AMOUNT,
              claimed_at: now,
              streak: newStreak,
            },
          ]);

          if (error) throw error;

          set({
            lastClaimed: now,
            streak: newStreak,
            nextClaimTime: Date.now() + BONUS_INTERVAL,
            isLoading: false,
          });

          return BONUS_AMOUNT;
        } catch (error: unknown) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      checkStreak: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase
            .from("bonuses")
            .select("*")
            .eq("user_id", userId)
            .order("claimed_at", { ascending: false })
            .limit(1);

          if (error) throw error;

          if (data && data.length > 0) {
            const lastBonus = data[0];
            const lastClaimedTime = new Date(lastBonus.claimed_at).getTime();
            const daysSinceLastClaim =
              (Date.now() - lastClaimedTime) / (1000 * 60 * 60 * 24);

            const streak = daysSinceLastClaim > 1 ? 0 : lastBonus.streak || 0;
            const nextClaimTime = lastClaimedTime + BONUS_INTERVAL;

            set({
              lastClaimed: lastBonus.claimed_at,
              streak,
              nextClaimTime,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error: unknown) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },

      getTimeUntilNextClaim: () => {
        const { nextClaimTime } = get();
        const timeLeft = nextClaimTime - Date.now();
        return Math.max(0, timeLeft);
      },
    }),
    {
      name: "bonus-storage",
    }
  )
);
