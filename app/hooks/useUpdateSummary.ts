"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export function useUpdateSummary() {
  const supabase = supabaseBrowser();
  const [loadingSummary, setLoadingSummary] = useState(false);

  async function updateSummary(analysis: any) {
    setLoadingSummary(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data: existing } = await supabase
        .from("history_summaries")
        .select("summary_long")
        .eq("user_id", user.id)
        .maybeSingle();

      const oldSummary = existing?.summary_long || "";

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historySummary: oldSummary, analysis }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      // Save full summary object
      const { error } = await supabase
        .from("history_summaries")
        .upsert({
          user_id: user.id,
          summary_long: json.summary_long,
          summary_short: json.summary_short,
          aggregates: json.aggregates,
          insights_page: json.insights_page,
          trends_page: json.trends_page,
          updated_at: new Date().toISOString(),
        });

      if (error) console.log("UPSERT ERROR:", error);

      return json;
    } catch (err) {
      console.error("SUMMARY UPDATE ERROR:", err);
      return null;
    } finally {
      setLoadingSummary(false);
    }
  }

  return { updateSummary, loadingSummary };
}
