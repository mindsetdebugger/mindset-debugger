"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function useWeeklyAIRefresh() {
  const supabase = supabaseBrowser();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [compassDue, setCompassDue] = useState(false);
  const [roadmapDue, setRoadmapDue] = useState(false);

  // ------------------------------------------------------
  // LOAD last_generated VALUES FROM DB
  // ------------------------------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) {
        setLoading(false);
        return;
      }

      // COMPASS
      const { data: compass } = await supabase
        .from("compass_profiles")
        .select("last_generated")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!compass?.last_generated) {
        setCompassDue(true);
      } else {
        const last = new Date(compass.last_generated);
        if (Date.now() - last.getTime() > WEEK_MS) {
          setCompassDue(true);
        }
      }

      // ROADMAP
      const { data: roadmap } = await supabase
        .from("roadmap_profiles")
        .select("last_generated")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!roadmap?.last_generated) {
        setRoadmapDue(true);
      } else {
        const last = new Date(roadmap.last_generated);
        if (Date.now() - last.getTime() > WEEK_MS) {
          setRoadmapDue(true);
        }
      }

      setLoading(false);

      // Auto-trigger only once on mount
      if (compassDue || roadmapDue) {
        refreshAll();
      }
    })();
  }, []);

  // ------------------------------------------------------
  // FETCH last analysis → Required by Compass + Roadmap APIs
  // ------------------------------------------------------
  async function fetchLastAnalysis() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("entries")
      .select("analysis")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data?.analysis ?? {};
  }

  // ------------------------------------------------------
  // Master Refresh All
  // ------------------------------------------------------
  async function refreshAll() {
    setRefreshing(true);
    const analysis = await fetchLastAnalysis();

    const calls: Promise<any>[] = [];

    if (compassDue) {
      calls.push(
        fetch("/api/compass", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis }),
        })
      );
    }

    if (roadmapDue) {
      calls.push(
        fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis }),
        })
      );
    }

    if (calls.length > 0) {
      await Promise.all(calls);
    }

    setRefreshing(false);
  }

  return {
    loading,
    refreshing,

    compassDue,
    roadmapDue,

    refreshAll,
  };
}
