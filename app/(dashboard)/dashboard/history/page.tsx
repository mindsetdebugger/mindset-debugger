"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  LayoutGrid,
  LayoutList,
  Clock,
  HeartPulse,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabaseBrowser } from "@/lib/supabase/client";

type Entry = {
  id: string;
  created_at: string;
  content: string | null;
  analysis: any;
  emotion: string;
  summary: string;
  tone: string;
};

export default function HistoryPage() {
  const supabase = supabaseBrowser();

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [latest, setLatest] = useState<Entry | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [heatmap, setHeatmap] = useState<number[]>([]);
  const heatColors = ["bg-slate-200", "bg-indigo-100", "bg-indigo-300", "bg-indigo-500", "bg-indigo-700"];

  useEffect(() => {
    setHeatmap(Array.from({ length: 21 }, () => Math.floor(Math.random() * 5)));
  }, []);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setErrorMsg("Not logged in.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("entries")
          .select("id, created_at, content, analysis")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        const mapped: Entry[] =
          data?.map((e: any) => {
            const a = e.analysis || {};

            const emotion = a?.emotions?.primary?.[0]?.emotion ?? "neutral";

            const summary =
              a?.summary?.trim()?.length > 0
                ? a.summary
                : a?.key_themes?.[0]
                ? a.key_themes[0]
                : e.content?.split(".")[0]
                ? e.content.split(".")[0]
                : "Reflection entry";

            return {
              id: e.id,
              created_at: e.created_at,
              content: e.content,
              analysis: a,
              emotion,
              summary,
              tone: emotion,
            };
          }) ?? [];

        setEntries(mapped);
        if (mapped.length > 0) setLatest(mapped[0]);
      } catch (err: any) {
        setErrorMsg(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [supabase]);

  const EmotionBadge = ({ emotion }: { emotion: string }) => (
    <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 capitalize">
      {emotion}
    </span>
  );

  return (
    <div className="space-y-12 px-6 md:px-12 py-10">

      {/* HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-10 shadow-xl text-white">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Reflection History
        </h1>
        <p className="text-indigo-200 max-w-xl text-sm md:text-base mt-2">
          Browse your past reflections, emotions, patterns, and AI insights.
        </p>
      </div>

      {/* TODAY SCORE + INSIGHT */}
      {latest && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* SCORE CARD */}
          <Card className="rounded-2xl p-6 flex flex-col items-center text-center shadow-md">
            <CardHeader>
              <CardTitle>Today's Mindset Score</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center">
              <div className="relative w-28 h-28 my-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#4f46e5"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={Math.PI * 2 * 48}
                    strokeDashoffset={
                      Math.PI *
                      2 *
                      48 *
                      (1 - (latest.analysis?.mindset_score ?? 0) / 100)
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-indigo-600">
                    {latest.analysis?.mindset_score ?? 0}
                  </span>
                </div>
              </div>

              <p className="text-slate-500 text-sm">Your mindset trend today.</p>
            </CardContent>
          </Card>

          {/* AI INSIGHT TODAY */}
          <Card className="rounded-2xl p-6 shadow-md">
            <CardHeader>
              <CardTitle>Your AI Insight Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-700 uppercase text-xs font-semibold tracking-wide mb-2">
                Mindset Debugger Interpretation
              </p>
              <p className="text-slate-700 leading-relaxed mb-2">
                {latest.analysis?.ai_insight_today ?? "No insight available."}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search entries..."
            className="w-full px-4 py-2 rounded-xl border bg-white shadow"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
        </div>
      </div>

      {/* HEATMAP */}
      <Card className="rounded-2xl bg-white/60 backdrop-blur border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HeartPulse className="h-5 w-5 text-indigo-600" />
            Emotion Heatmap (Last 21 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 max-w-xs">
            {heatmap.map((lvl, i) => (
              <div key={i} className={`w-6 h-6 rounded-md ${heatColors[lvl]}`} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ENTRIES */}
      {!loading && entries.length > 0 && (
        <Card className="rounded-2xl shadow-lg border border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-indigo-600" />
              Entries
            </CardTitle>
          </CardHeader>

          <CardContent className="divide-y">
            {entries.map((e) => (
              <Link
                key={e.id}
                href={`/dashboard/history/${e.id}`}
                className="block py-5 px-4 hover:bg-indigo-50 rounded-xl transition"
              >
                <div className="flex justify-between items-start gap-6">

                  {/* LEFT */}
                  <div className="flex-1 space-y-2">
                    {/* Summary line */}
                    <div className="flex items-center gap-3">
                      <EmotionBadge emotion={e.emotion} />

                      <span className="font-semibold text-slate-800 leading-tight">
                        {e.summary}
                      </span>
                    </div>

                    {/* Content preview */}
                    <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                      {e.content}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(e.created_at).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
