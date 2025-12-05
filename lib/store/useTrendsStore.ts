"use client";
import { create } from "zustand";
import { supabaseBrowser } from "@/lib/supabase/client";

import {
  buildMindsetSeries,
  buildEmotionIntensitySeries,
  buildEmotionDistribution,
  buildPatternFrequency,
  buildWeeklySummaries,
  deriveForecast,
  type EntryRow,
} from "@/lib/trends-helpers";

type TrendsState = {
  loading: boolean;
  loadedOnce: boolean;

  entries: EntryRow[];
  summary: any | null;

  mindsetSeries: any[];
  emotionSeries: any[];
  emotionDistribution: any[];
  patternFrequency: any[];
  weeklySummaries: any[];

  forecast: string;

  loadTrends: () => Promise<void>;
  reset: () => void;
};

export const useTrendsStore = create<TrendsState>((set, get) => ({
  loading: false,
  loadedOnce: false,

  entries: [],
  summary: null,

  mindsetSeries: [],
  emotionSeries: [],
  emotionDistribution: [],
  patternFrequency: [],
  weeklySummaries: [],

  forecast: "",

  // ======================================================
  // LOAD TRENDS (hibrid: fetch ako ne postoji, inače koristi cache)
  // ======================================================
  loadTrends: async () => {
    const { loadedOnce, loading } = get();
    if (loadedOnce || loading) return;

    set({ loading: true });

    try {
      const supabase = supabaseBrowser();

      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) {
        set({ loading: false });
        return;
      }

      // ------- summary -------
      const { data: summaryData } = await supabase
        .from("history_summaries")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // ------- entries (last 30 days) -------
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const { data: entryData } = await supabase
        .from("entries")
        .select("created_at, analysis")
        .eq("user_id", user.id)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });

      const entries = (entryData || []).map((e: any) => ({
        created_at: e.created_at,
        analysis: e.analysis,
      }));

      // ------- derive charts -------
      const mindsetSeries = buildMindsetSeries(entries);
      const emotionSeries = buildEmotionIntensitySeries(entries);
      const emotionDistribution = buildEmotionDistribution(entries);
      const patternFrequency = buildPatternFrequency(entries);
      const weeklySummaries = buildWeeklySummaries(entries);

      const trends = summaryData?.trends_page || null;
      const forecast = deriveForecast(trends);

      set({
        entries,
        summary: summaryData || null,
        mindsetSeries,
        emotionSeries,
        emotionDistribution,
        patternFrequency,
        weeklySummaries,
        forecast,
        loadedOnce: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  // ======================================================
  // RESET STORE (ako želiš ručno invalidirati)
  // ======================================================
  reset: () => {
    set({
      loading: false,
      loadedOnce: false,
      entries: [],
      summary: null,
      mindsetSeries: [],
      emotionSeries: [],
      emotionDistribution: [],
      patternFrequency: [],
      weeklySummaries: [],
      forecast: "",
    });
  },
}));
