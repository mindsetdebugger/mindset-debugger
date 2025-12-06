"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Loader2, CalendarDays, Activity, Brain } from "lucide-react";

import { useUpdateSummary } from "@/app/hooks/useUpdateSummary";
import { useWeeklyAIRefresh } from "@/app/hooks/useWeeklyAIRefresh";
import {
  useEntriesStore,
  type EntryRow,
  type DeepAnalysis,
} from "@/lib/store/useEntriesStore";
import CheckInHero from "./components/CheckInHero";
import LatestAnalysisFull from "./components/AnalysisLayout";




// ---------------------------------------------
// Helpers
// ---------------------------------------------
function scoreToMood(score: number | null) {
  if (score === null || score === undefined)
    return { emoji: "❔", label: "N/A", bg: "bg-slate-100", text: "text-slate-600" };
  if (score >= 75) return { emoji: "😄", label: "High", bg: "bg-emerald-50", text: "text-emerald-700" };
  if (score >= 55) return { emoji: "🙂", label: "Balanced", bg: "bg-indigo-50", text: "text-indigo-700" };
  if (score >= 35) return { emoji: "😕", label: "Low", bg: "bg-amber-50", text: "text-amber-800" };
  return { emoji: "😣", label: "Very low", bg: "bg-rose-50", text: "text-rose-800" };
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("hr-HR", { day: "2-digit", month: "short" });
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

// ---------------------------------------------
// Dashboard Page
// ---------------------------------------------
export default function DashboardPage() {
  const { updateSummary, loadingSummary } = useUpdateSummary();
  useWeeklyAIRefresh();

  const {
    entries,
    latestEntry,
    loading: entriesLoading,
    loaded: entriesLoaded,
    fetchAll,
    createEntry,
  } = useEntriesStore();

  // Local state
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Initial load
  useEffect(() => {
    if (!entriesLoaded) fetchAll();
  }, [entriesLoaded, fetchAll]);

  const initialLoading = !entriesLoaded && entriesLoading;

  // Recent entries
  const recentEntries: EntryRow[] = useMemo(
    () => entries.slice(0, 7),
    [entries]
  );

  // Active entry
  const activeEntry = latestEntry;
  const hasEntryToday = activeEntry
    ? isSameDay(new Date(activeEntry.created_at), new Date())
    : false;

  // Mood timeline
  const moodTimeline = useMemo(
    () =>
      recentEntries
        .filter((e) => e.analysis?.mindset_score !== undefined)
        .slice(0, 7)
        .map((e) => ({
          date: new Date(e.created_at),
          score: e.analysis.mindset_score,
        }))
        .reverse(),
    [recentEntries]
  );

  // ANALYZE ENTRY
  async function analyze() {
    try {
      setLoading(true);
      setErrorMsg("");

      if (input.trim().split(" ").length < 8) {
        setLoading(false);
        setErrorMsg("Napiši barem 4-5 smislenih rečenica.");
        return;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || "Nešto je pošlo krivo.");
        return;
      }

      const deep: DeepAnalysis = data.analysis;

      const newEntry = await createEntry(input, deep);
      if (!newEntry) {
        setErrorMsg("Nije moguće spremiti unos.");
        return;
      }

      await updateSummary(deep);
      setInput("");
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  }

  // ---------------------------------------------
  // INITIAL LOADING SCREEN
  // ---------------------------------------------
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F7FF] text-slate-900">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-8 space-y-12">

        {/* Top bar */}
        <header className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-white shadow-sm px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-700 border border-slate-200">
            MINDSET DEBUGGER
          </span>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            {activeEntry && (
              <span>
                Last entry:{" "}
                <span className="font-semibold text-slate-900">
                  {formatDateLabel(new Date(activeEntry.created_at))}
                </span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 border border-slate-200 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {entries.length} reflections
            </span>
          </div>
        </header>

        {/* --------------------------------------------- */}
        {/* HERO (only if NO entry today) */}
        {/* --------------------------------------------- */}
        {!hasEntryToday && (
          <CheckInHero
            input={input}
            setInput={setInput}
            loading={loading}
            analyze={analyze}
            errorMsg={errorMsg}
            loadingSummary={loadingSummary}
          />
        )}

        {/* If no entries at all */}
        {!activeEntry && entries.length === 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            Nakon prvog unosa vidjet ćeš analizu, emocije, score i povijest kroz vrijeme.
          </section>
        )}

        {/* --------------------------------------------- */}
        {/* IF ENTRY EXISTS (latest full analysis) */}
        {/* --------------------------------------------- */}
        {activeEntry && (
          <>
            {/* If today's entry exists → show only analysis */}
            {hasEntryToday ? (
              <LatestAnalysisFull entry={activeEntry} />
            ) : (
              <>
                {/* Latest Score */}
                <Card className="rounded-3xl border border-slate-200 shadow-md bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Activity className="text-indigo-500 h-5 w-5" />
                      Latest Mindset Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="text-4xl font-bold text-indigo-700">
                      {activeEntry.analysis?.mindset_score ?? "--"}
                      <span className="text-slate-400 text-lg">/100</span>
                    </p>
                  </CardContent>
                </Card>

                {/* Recent mood timeline */}
                <Card className="rounded-3xl border border-slate-200 shadow-md bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <CalendarDays className="text-indigo-500 h-5 w-5" />
                      Recent Mood (last 7 entries)
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {moodTimeline.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        Nema još dovoljno podataka.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {moodTimeline.map((m, idx) => {
                          const mood = scoreToMood(m.score);
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs border border-slate-200 bg-slate-50`}
                            >
                              <span className="text-base">{mood.emoji}</span>
                              <div className="flex flex-col leading-tight">
                                <span className="font-semibold">
                                  {m.score ?? "--"}
                                </span>
                                <span className="opacity-80">
                                  {formatDateLabel(m.date)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Latest full analysis */}
                <LatestAnalysisFull entry={activeEntry} />
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
