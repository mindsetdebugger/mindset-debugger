"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export type RoadmapProfile = {
  core_challenges: string[];
  core_strengths: string[];
  growth_plan: {
    id: string;
    title: string;
    description: string;
    why: string;
    category: string;
    time_estimate: string;
    status: "not_started" | "in_progress" | "done";
  }[];
  weekly_checkpoints: {
    wins: string[];
    stuck_points: string[];
    adjustments: string[];
    trend_signal: string;
  };
  last_generated: string;
};

export function useRoadmap() {
  const supabase = supabaseBrowser();

  const [roadmap, setRoadmap] = useState<RoadmapProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ------------------------------------------------
  // LOAD ROADMAP ON MOUNT
  // ------------------------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/roadmap", { method: "GET" });
      const json = await res.json();

      setRoadmap(json.roadmap ?? null);
      setLoading(false);
    })();
  }, []);

  // ------------------------------------------------
  // AUTO WEEKLY UPDATE
  // ------------------------------------------------
  useEffect(() => {
    if (!roadmap) return;

    const last = new Date(roadmap.last_generated);
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    if (Date.now() - last.getTime() > weekMs) {
      regenerate();
    }
  }, [roadmap]);

  // ------------------------------------------------
  // MANUAL REGENERATE
  // ------------------------------------------------
  async function regenerate() {
    setRefreshing(true);

    const { data: session } = await supabase.auth.getUser();
    const user = session?.user;

    if (!user) {
      setRefreshing(false);
      return;
    }

    // 🧠 fetch last analysis (same logic kao za Compass)
    const { data: lastEntry } = await supabase
      .from("entries")
      .select("analysis")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const res = await fetch("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysis: lastEntry?.analysis ?? {},
      }),
    });

    const { roadmap: newRoadmap } = await res.json();

    setRoadmap(newRoadmap ?? null);
    setRefreshing(false);
  }

  return {
    roadmap,
    loading,
    refreshing,
    regenerate,
  };
}
