import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabaseBrowser } from "@/lib/supabase/client";

type EntryRow = any;
type HistorySummary = any;
type CompassProfile = any;

type Store = {
  // --- Global state ---
  session: any;
  latestEntry: EntryRow | null;
  historySummary: HistorySummary | null;
  compassProfile: CompassProfile | null;

  // --- UI state ---
  loading: boolean;
  refreshing: boolean;

  // --- Loaders ---
  loadSession: () => Promise<void>;
  loadLatestEntry: () => Promise<void>;
  loadHistorySummary: () => Promise<void>;
  loadCompassProfile: () => Promise<void>;

  // --- Combined loader (recommended for pages) ---
  loadAll: () => Promise<void>;

  // --- Regenerate functions ---
  regenerateCoach: () => Promise<void>;
  regenerateCompass: () => Promise<void>;
};

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      session: null,
      latestEntry: null,
      historySummary: null,
      compassProfile: null,

      loading: false,
      refreshing: false,

      // ------------------------------------------------
      // Load session
      // ------------------------------------------------
      loadSession: async () => {
        const supabase = supabaseBrowser();
        const { data } = await supabase.auth.getUser();
        set({ session: data?.user || null });
      },

      // ------------------------------------------------
      // Load latest entry
      // ------------------------------------------------
      loadLatestEntry: async () => {
        const supabase = supabaseBrowser();
        const user = get().session;
        if (!user) return;

        const { data } = await supabase
          .from("entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        set({ latestEntry: data || null });
      },

      // ------------------------------------------------
      // Load summary
      // ------------------------------------------------
      loadHistorySummary: async () => {
        const supabase = supabaseBrowser();
        const user = get().session;
        if (!user) return;

        const { data } = await supabase
          .from("history_summaries")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        set({ historySummary: data || null });
      },

      // ------------------------------------------------
      // Load compass profile
      // ------------------------------------------------
      loadCompassProfile: async () => {
        const supabase = supabaseBrowser();
        const user = get().session;
        if (!user) return;

        const { data } = await supabase
          .from("compass_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        set({ compassProfile: data || null });
      },

      // ------------------------------------------------
      // Load ALL (for pages)
      // ------------------------------------------------
      loadAll: async () => {
        set({ loading: true });

        await get().loadSession();
        await Promise.all([
          get().loadLatestEntry(),
          get().loadHistorySummary(),
          get().loadCompassProfile(),
        ]);

        set({ loading: false });
      },

      // ------------------------------------------------
      // Regenerate COACH (summary + layers)
      // ------------------------------------------------
      regenerateCoach: async () => {
        set({ refreshing: true });

        const supabase = supabaseBrowser();
        const user = get().session;
        if (!user) return;

        const lastEntry = get().latestEntry;
        await fetch("/api/compass", {
          method: "POST",
          body: JSON.stringify({ analysis: lastEntry?.analysis || {} }),
          headers: { "Content-Type": "application/json" },
        });

        await get().loadHistorySummary();
        set({ refreshing: false });
      },

      // ------------------------------------------------
      // Regenerate COMPASS PROFILE
      // ------------------------------------------------
      regenerateCompass: async () => {
        set({ refreshing: true });

        const supabase = supabaseBrowser();
        const user = get().session;
        if (!user) return;

        const { data } = await supabase
          .from("entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        await fetch("/api/compass", {
          method: "POST",
          body: JSON.stringify({ analysis: data?.analysis ?? {} }),
          headers: { "Content-Type": "application/json" },
        });

        await get().loadCompassProfile();
        set({ refreshing: false });
      },
    }),

    {
      name: "app-store", // localStorage key
      partialize: (state) => ({
        // šta peristamo
        session: state.session,
        latestEntry: state.latestEntry,
        historySummary: state.historySummary,
        compassProfile: state.compassProfile,
      }),
    }
  )
);
