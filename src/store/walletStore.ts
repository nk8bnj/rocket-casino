import { create } from "zustand";
import { supabase } from "../services/supabase";

interface WalletState {
  balance: number;
  isLoading: boolean;
  error: string | null;
  fetchBalance: (userId: string) => Promise<void>;
  updateBalance: (userId: string, amount: number) => Promise<void>;
  addBonus: (userId: string, amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  isLoading: false,
  error: null,

  fetchBalance: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("wallet")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      set({ balance: data.balance, isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },

  updateBalance: async (userId: string, amount: number) => {
    try {
      set({ isLoading: true, error: null });

      const newBalance = get().balance + amount;

      const { error } = await supabase
        .from("wallet")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      if (error) throw error;

      set({ balance: newBalance, isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },

  addBonus: async (userId: string, amount: number) => {
    try {
      set({ isLoading: true, error: null });

      await get().updateBalance(userId, amount);

      const { error } = await supabase.from("bonuses").insert([
        {
          user_id: userId,
          amount,
          claimed_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      set({ isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },
}));
