"use client";

import { create } from "zustand";
import { supabaseBrowser } from "@/lib/supabase/client";

export type HistorySummaryRow = any;

type SummaryStoreState = {
  summary: HistorySummaryRow | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;

  fetchSummary: () => Promise<void>;
  setSummary: (summary: HistorySummaryRow | null) => void;
};

export const useSummaryStore = create<SummaryStoreState>((set, get) => ({
  summary: null,
  loading: false,
  loaded: false,
  error: null,

  async fetchSummary() {
    const { loaded, loading } = get();
    if (loaded || loading) return;

    set({ loading: true, error: null });

    try {
      const supabase = supabaseBrowser();
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;

      if (!user) {
        set({
          summary: null,
          loading: false,
          loaded: true,
          error: null,
        });
        return;
      }

      const { data, error } = await supabase
        .from("history_summaries")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("fetchSummary error", error);
        set({ loading: false, loaded: true, error: error.message });
        return;
      }

      set({
        summary: data ?? null,
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (err: any) {
      console.error("fetchSummary error", err);
      set({
        loading: false,
        loaded: true,
        error: err?.message ?? "Unknown error",
      });
    }
  },

  setSummary(summary) {
    set({ summary });
  },
}));
