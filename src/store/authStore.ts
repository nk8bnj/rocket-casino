import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../services/supabase";
import type { User } from "../types";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      error: null,

      signUp: async (email: string, password: string, username: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { username },
            },
          });

          if (error) throw error;

          if (data.user) {
            const { error: profileError } = await supabase
              .from("users")
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  username,
                  created_at: new Date().toISOString(),
                },
              ]);

            if (profileError) throw profileError;

            const { error: walletError } = await supabase
              .from("wallet")
              .insert([
                {
                  user_id: data.user.id,
                  balance: 1000,
                },
              ]);

            if (walletError) throw walletError;

            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                username,
                created_at: new Date().toISOString(),
              },
              session: data.session,
              isLoading: false,
            });
          }
        } catch (error: unknown) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("*")
              .eq("id", data.user.id)
              .single();

            if (profileError) throw profileError;

            set({
              user: profile,
              session: data.session,
              isLoading: false,
            });
          }
        } catch (error: unknown) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, session: null, isLoading: false });
        } catch (error: unknown) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email);
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

      updateProfile: async (updates: Partial<User>) => {
        try {
          const user = get().user;
          if (!user) throw new Error("No user logged in");

          set({ isLoading: true, error: null });

          const { error } = await supabase
            .from("users")
            .update(updates)
            .eq("id", user.id);

          if (error) throw error;

          set({
            user: { ...user, ...updates },
            isLoading: false,
          });
        } catch (error: unknown) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      checkSession: async () => {
        try {
          set({ isLoading: true });
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            const { data: profile } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            set({
              user: profile,
              session,
              isLoading: false,
            });
          } else {
            set({ user: null, session: null, isLoading: false });
          }
        } catch (error: unknown) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: state => ({ user: state.user, session: state.session }),
    }
  )
);
