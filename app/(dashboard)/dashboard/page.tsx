"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Sparkles,
  Loader2,
  Activity,
  Brain,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

import { useUpdateSummary } from "@/app/hooks/useUpdateSummary";
import { useWeeklyAIRefresh } from "@/app/hooks/useWeeklyAIRefresh";
import {
  useEntriesStore,
  type EntryRow,
  type DeepAnalysis,
} from "@/lib/store/useEntriesStore";

// ===============================
// Emotion helpers
// ===============================
const emotionStyles: Record<string, any> = {
  joy: { emoji: "😊", bg: "bg-amber-50", text: "text-amber-800", ring: "ring-amber-200" },
  calm: { emoji: "😌", bg: "bg-sky-50", text: "text-sky-800", ring: "ring-sky-200" },
  anxiety: { emoji: "😰", bg: "bg-indigo-50", text: "text-indigo-800", ring: "ring-indigo-200" },
  stress: { emoji: "😵‍💫", bg: "bg-rose-50", text: "text-rose-800", ring: "ring-rose-200" },
  hope: { emoji: "🌱", bg: "bg-emerald-50", text: "text-emerald-800", ring: "ring-emerald-200" },
  frustration: { emoji: "😤", bg: "bg-red-50", text: "text-red-800", ring: "ring-red-200" },
};

function getEmotionStyle(name: string) {
  const key = name.toLowerCase().trim();
  return (
    emotionStyles[key] || {
      emoji: "🧠",
      bg: "bg-slate-50",
      text: "text-slate-800",
      ring: "ring-slate-200",
    }
  );
}

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

// ===============================
// Dashboard Page
// ===============================
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

  // ===============================
  // LOCAL STATE
  // ===============================
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // init load
  useEffect(() => {
    if (!entriesLoaded) {
      fetchAll();
    }
  }, [entriesLoaded, fetchAll]);

  const initialLoading = !entriesLoaded && entriesLoading;

  // ===============================
  // ACTIVE ENTRY + DERIVED
  // ===============================
  const recentEntries: EntryRow[] = useMemo(
    () => entries.slice(0, 7),
    [entries]
  );

  const activeEntry = latestEntry;
  const activeDate = activeEntry ? new Date(activeEntry.created_at) : null;

  const mindsetScore =
    activeEntry?.analysis?.mindset_score ?? null;
  const aiInsight =
    activeEntry?.analysis?.ai_insight_today ?? null;

  const hasEntryToday = activeEntry
    ? isSameDay(new Date(activeEntry.created_at), new Date())
    : false;

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

  // ===============================
  // ANALYZE Entry
  // ===============================
  async function analyze() {
    try {
      setLoading(true);
      setErrorMsg("");

      if (input.trim().split(" ").length < 8) {
        setLoading(false);
        setErrorMsg("Write at least 3–4 meaningful sentences.");
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
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }

      const deep: DeepAnalysis = data.analysis;

      const newEntry = await createEntry(input, deep);
      if (!newEntry) {
        setErrorMsg("Could not save entry.");
        return;
      }

      await updateSummary(deep);
      setInput("");
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  }

  // ===============================
  // INITIAL LOADING SCREEN
  // ===============================
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-[#F5F7FF] text-slate-900">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-10 space-y-10 md:space-y-12">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white shadow-sm px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-700 border border-slate-200">
              MINDSET DEBUGGER
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500">
            {activeDate && (
              <span>
                Last entry:{" "}
                <span className="font-semibold text-slate-800">
                  {formatDateLabel(activeDate)}
                </span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 border border-slate-200 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-medium text-slate-700">
                {entries.length || 0} reflections
              </span>
            </span>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E2E9FF] via-[#D8E7FF] to-[#F8ECFF] px-6 py-8 md:px-10 md:py-10 shadow-[0_24px_60px_rgba(148,163,184,0.45)] border border-white">
          {/* Pastel blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#B8C7FF]/50 blur-3xl" />
            <div className="absolute -left-16 bottom-[-80px] h-72 w-72 rounded-full bg-[#FBCFE8]/40 blur-3xl" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)] items-start">
            {/* Left column */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium tracking-[0.16em] uppercase text-indigo-700 border border-indigo-100 shadow-sm">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span>Daily mental check-in</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-slate-900">
                  Beautifully simple{" "}
                  <span className="font-bold">mindset dashboard.</span>
                </h1>
                <p className="max-w-xl text-sm md:text-base text-slate-700">
                  Jedan kratki zapis dnevno. AI ti razbije priču na emocije,
                  obrasce i jasne mikro-korake – sve na jednom, uvijek istom
                  mjestu.
                </p>
              </div>

              {/* Metrics */}
              <div className="grid gap-3 sm:grid-cols-3 max-w-xl text-xs md:text-sm">
                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 px-4 py-3 shadow-sm">
                  <p className="text-slate-500">Mindset score</p>
                  <p className="mt-1 text-lg md:text-xl font-semibold text-slate-900">
                    {mindsetScore ?? "--"}/100
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 px-4 py-3 shadow-sm">
                  <p className="text-slate-500">Recent streak</p>
                  <p className="mt-1 text-lg md:text-xl font-semibold text-slate-900">
                    {recentEntries.length > 1
                      ? `${recentEntries.length} days`
                      : recentEntries.length === 1
                      ? "1 day"
                      : "Just starting"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 px-4 py-3 shadow-sm">
                  <p className="text-slate-500">Latest insight</p>
                  <p className="mt-1 text-[11px] md:text-xs text-slate-700 line-clamp-3">
                    {aiInsight || "Your next reflection will unlock a fresh AI insight."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column – input / today summary */}
            <div className="relative">
              <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200 shadow-xl p-4 md:p-5 space-y-4">
                {!hasEntryToday ? (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        Today&apos;s reflection
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Takes ~3 minutes
                      </span>
                    </div>

                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Napiši kako se osjećaš, što te muči ili što ti se danas vrti po glavi…"
                      className="bg-slate-50 border-slate-200 text-sm md:text-base text-slate-900 placeholder:text-slate-400 min-h-[130px] focus-visible:ring-1 focus-visible:ring-indigo-300"
                    />

                    {errorMsg && (
                      <p className="text-rose-500 text-[11px]">{errorMsg}</p>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      {loadingSummary && (
                        <p className="text-[11px] text-slate-500 animate-pulse">
                          Ažuriram tvoje dugoročne uvide…
                        </p>
                      )}
                      <Button
                        onClick={analyze}
                        disabled={loading}
                        className="ml-auto bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-300/60"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Analyzing…
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Run today&apos;s analysis
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        Today&apos;s check-in done ✅
                      </p>
                      {activeDate && (
                        <span className="text-[11px] text-slate-500">
                          {formatDateLabel(activeDate)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 text-xs md:text-sm">
                      <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-500 mb-1">
                          AI Insight
                        </p>
                        <p className="text-slate-800 line-clamp-4">
                          {activeEntry?.analysis.ai_insight_today}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600 mb-1">
                          Today&apos;s micro-step
                        </p>
                        <p className="text-slate-800">
                          {activeEntry?.analysis.actions.today_micro_step}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      {loadingSummary && (
                        <p className="text-[11px] text-slate-500 animate-pulse">
                          Ažuriram tvoju povijest u pozadini…
                        </p>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <Link href="/dashboard/history">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            View full history
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Ako još nema nijednog unosa */}
        {!activeEntry && entries.length === 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            Nakon prvog unosa, ovdje ćeš vidjeti detaljnu analizu, emocije,
            score i povijest promjena kroz vrijeme.
          </section>
        )}

        {/* DALJNJI DIO DASHBOARDA */}
        {activeEntry && (
          <main className="space-y-10 md:space-y-12">
            {/* Insight + Score */}
            <section className="grid gap-8 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] items-start">
              {/* Insight Card */}
              <Card className="rounded-3xl shadow-lg shadow-slate-200/70 border border-slate-200 bg-white">
                <CardContent className="p-7 space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2 text-slate-900">
                      <span className="text-pink-500 text-2xl">🧠</span>
                      Insight (last entry)
                    </h2>
                    {activeDate && (
                      <span className="text-xs rounded-full bg-slate-50 px-3 py-1 text-slate-600 border border-slate-200">
                        {formatDateLabel(activeDate)}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                    {activeEntry.analysis.ai_insight_today}
                  </p>

                  {/* Summary */}
                  <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm shadow-inner">
                    <span className="font-semibold text-indigo-800">
                      Sažetak:&nbsp;
                    </span>
                    <span className="text-indigo-900">
                      {activeEntry.analysis.summary}
                    </span>
                  </div>

                  {/* Micro-step */}
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm flex items-start gap-2">
                    <span className="font-semibold text-emerald-800">
                      Micro-step:
                    </span>
                    <span className="text-emerald-900">
                      {activeEntry.analysis.actions.today_micro_step}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link href="/dashboard/history">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        View full analysis
                      </Button>
                    </Link>

                    {loadingSummary && (
                      <p className="text-[11px] text-slate-400 italic">
                        Ažuriram tvoju povijest u pozadini…
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Right column: Score + Mood timeline */}
              <div className="space-y-6">
                {/* Score */}
                <Card className="rounded-3xl border border-slate-200 shadow-md shadow-slate-200/80 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm md:text-base text-slate-900">
                      <Activity className="text-indigo-500 h-5 w-5" />
                      Mindset Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-4">
                    <div className="relative w-36 h-36 md:w-40 md:h-40">
                      <svg className="w-full h-full" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="46"
                          className="stroke-slate-100"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="46"
                          stroke="url(#grad)"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 46}
                          strokeDashoffset={
                            2 * Math.PI * 46 * (1 - (mindsetScore ?? 0) / 100)
                          }
                          transform="rotate(-90 60 60)"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="grad">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-3xl md:text-4xl font-bold text-indigo-700">
                          {mindsetScore ?? 0}
                        </p>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          /100
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent mood timeline */}
                <Card className="rounded-3xl border border-slate-200 shadow-sm shadow-slate-200/70 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm md:text-base text-slate-900">
                      <CalendarDays className="text-indigo-500 h-5 w-5" />
                      Recent Mood (last 7 entries)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1">
                    {moodTimeline.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        Nema još dovoljno podataka.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {moodTimeline.map((m, idx) => {
                          const mood = scoreToMood(m.score);
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-700`}
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
              </div>
            </section>

            {/* Emotions + Actions + Reframes */}
            <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] auto-rows-fr items-start">
              {/* Primary Emotions */}
              <Card className="rounded-3xl border border-slate-200 shadow-md shadow-slate-200/70 bg-white h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base text-slate-900">
                    😶‍🌫️ Primary Emotions
                    <span className="text-[11px] font-normal text-slate-400">
                      (zadnji unos)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeEntry.analysis.emotions?.primary?.length ? (
                    <div className="flex flex-wrap gap-3">
                      {activeEntry.analysis.emotions.primary.map(
                        (emo: any, index: number) => {
                          const style = getEmotionStyle(emo.emotion);
                          return (
                            <div
                              key={index}
                              className={`flex items-start gap-2 rounded-2xl px-3 py-2 text-xs md:text-sm ring-1 ${style.bg} ${style.text} ${style.ring} shadow-sm`}
                            >
                              <span className="text-lg mt-[1px]">
                                {style.emoji}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-semibold capitalize">
                                  {emo.emotion}
                                </span>
                                <span className="opacity-80">
                                  Intenzitet: {emo.intensity}/100
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Nema jasno označenih emocija za ovaj unos.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Action Steps */}
              <Card className="rounded-3xl border border-slate-200 shadow-md shadow-slate-200/70 bg-white h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base text-slate-900">
                    🧭 Action Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-900 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wide">
                        Today’s Micro-Step
                      </p>
                      <p className="text-sm mt-1">
                        {activeEntry.analysis.actions.today_micro_step}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50 text-sky-900 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wide">
                        Tomorrow Focus
                      </p>
                      <p className="text-sm mt-1">
                        {activeEntry.analysis.actions.tomorrow_focus}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50 text-rose-900 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wide">
                        Potential Pitfall
                      </p>
                      <p className="text-sm mt-1">
                        {activeEntry.analysis.actions.potential_pitfall}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50 text-amber-900 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wide">
                        Supportive Mindset
                      </p>
                      <p className="text-sm mt-1">
                        {activeEntry.analysis.actions.supportive_mindset}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reframes */}
              <Card className="rounded-3xl border border-slate-200 shadow-md shadow-slate-200/70 bg-white h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base text-slate-900">
                    🔄 Reframes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-1">
                    {Object.entries(activeEntry.analysis.reframes || {}).map(
                      ([key, val]) => (
                        <div
                          key={key}
                          className="p-4 rounded-2xl border border-purple-100 bg-purple-50 text-purple-900 shadow-sm"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-wide">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm mt-1">{val as string}</p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent entries compact list */}
            <section>
              <Card className="rounded-3xl border border-slate-200 shadow-md shadow-slate-200/70 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm md:text-base text-slate-900">
                    <span className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-500" />
                      Recent Entries
                    </span>
                    <Link
                      href="/dashboard/history"
                      className="text-xs md:text-sm text-indigo-600 flex items-center gap-1 hover:text-indigo-500"
                    >
                      View all <ChevronRight className="w-4 h-4" />
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-slate-100">
                  {recentEntries.length === 0 && (
                    <p className="text-sm text-slate-500 py-4">
                      Još nema spremljenih unosa.
                    </p>
                  )}

                  {recentEntries.map((e) => (
                    <Link
                      key={e.id}
                      href={`/dashboard/history/${e.id}`}
                      className="block py-3 hover:bg-slate-50 rounded-xl -mx-3 px-3 transition"
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm md:text-base line-clamp-1">
                            {e.analysis?.summary ||
                              e.content.slice(0, 60) ||
                              "Reflection"}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            {e.content}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[11px] text-slate-400">
                            {formatDateLabel(new Date(e.created_at))}
                          </span>
                          <span className="text-[11px] rounded-full bg-slate-50 px-2 py-0.5 text-slate-700 border border-slate-200">
                            {e.analysis?.mindset_score ?? "--"}/100
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
