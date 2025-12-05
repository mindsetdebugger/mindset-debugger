"use client";

import { create } from "zustand";
import { supabaseBrowser } from "@/lib/supabase/client";

export type DeepAnalysis = any;

export type EntryRow = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  analysis: DeepAnalysis;
};

type EntriesStoreState = {
  entries: EntryRow[];
  latestEntry: EntryRow | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;

  // actions
  fetchAll: () => Promise<void>;
  createEntry: (content: string, analysis: DeepAnalysis) => Promise<EntryRow | null>;
  getEntryById: (id: string) => EntryRow | undefined;
};

export const useEntriesStore = create<EntriesStoreState>((set, get) => ({
  entries: [],
  latestEntry: null,
  loading: false,
  loaded: false,
  error: null,

  async fetchAll() {
    const { loaded, loading } = get();
    if (loaded || loading) return;

    set({ loading: true, error: null });

    try {
      const supabase = supabaseBrowser();
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;

      if (!user) {
        set({
          entries: [],
          latestEntry: null,
          loading: false,
          loaded: true,
          error: null,
        });
        return;
      }

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("fetchAll entries error", error);
        set({ loading: false, loaded: true, error: error.message });
        return;
      }

      const list = (data || []) as EntryRow[];

      set({
        entries: list,
        latestEntry: list[0] ?? null,
        loading: false,
        loaded: true,
        error: null,
      });
    } catch (err: any) {
      console.error("fetchAll entries error", err);
      set({
        loading: false,
        loaded: true,
        error: err?.message ?? "Unknown error",
      });
    }
  },

  async createEntry(content, analysis) {
    try {
      const supabase = supabaseBrowser();
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) return null;

      const { data, error } = await supabase
        .from("entries")
        .insert({
          user_id: user.id,
          content,
          analysis,
        })
        .select("*")
        .single();

      if (error) {
        console.error("createEntry error", error);
        return null;
      }

      const newEntry = data as EntryRow;

      set((state) => ({
        entries: [newEntry, ...state.entries],
        latestEntry: newEntry,
      }));

      return newEntry;
    } catch (err) {
      console.error("createEntry error", err);
      return null;
    }
  },

  getEntryById(id) {
    return get().entries.find((e) => e.id === id);
  },
}));
