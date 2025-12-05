"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import { supabaseBrowser } from "@/lib/supabase/client";

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

// ===============================
// Types
// ===============================
type DeepAnalysis = {
  summary: string;
  emotions: {
    primary: { emotion: string; intensity: number }[];
  };
  reframes: Record<string, string>;
  actions: {
    today_micro_step: string;
    tomorrow_focus: string;
    potential_pitfall: string;
    supportive_mindset: string;
  };
  mindset_score: number;
  ai_insight_today: string;
};

type EntryRow = {
  id?: number;
  user_id: string;
  content: string;
  created_at: string;
  analysis: DeepAnalysis;
};

// ===============================
// Emotion helpers (unchanged)
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
  const supabase = supabaseBrowser();
  const { updateSummary, loadingSummary } = useUpdateSummary();

  // ⭐ NEW: Universal weekly auto-refresh (Compass + Roadmap)
  const { loading: weeklyLoading, refreshing: weeklyRefreshing } =
    useWeeklyAIRefresh();

  // ===============================
  // LOCAL STATE
  // ===============================
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<DeepAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [latestEntry, setLatestEntry] = useState<EntryRow | null>(null);
  const [recentEntries, setRecentEntries] = useState<EntryRow[]>([]);
  const [mindsetScore, setMindsetScore] = useState<number | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // ===============================
  // LOAD ENTRIES (unchanged)
  // ===============================
  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) return;

      const { data } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!data) return;

      const typed = data as EntryRow[];

      if (typed.length > 0) {
        const latest = typed[0];
        setLatestEntry(latest);
        setMindsetScore(latest.analysis?.mindset_score ?? null);
        setAiInsight(latest.analysis?.ai_insight_today ?? null);
      }

      setRecentEntries(typed.slice(0, 7));
    })();
  }, []);

  // ===============================
  // ACTIVE ENTRY
  // ===============================
  const activeEntry = useMemo(() => {
    if (analysis) {
      return {
        user_id: "local",
        content: input,
        created_at: new Date().toISOString(),
        analysis,
      } as EntryRow;
    }
    return latestEntry;
  }, [analysis, input, latestEntry]);

  const activeDate = activeEntry ? new Date(activeEntry.created_at) : null;
  const isToday = activeDate ? isSameDay(activeDate, new Date()) : false;

  const moodTimeline = useMemo(
    () =>
      recentEntries
        .filter((e) => e.analysis?.mindset_score !== undefined)
        .slice(0, 7)
        .map((e) => ({ date: new Date(e.created_at), score: e.analysis.mindset_score }))
        .reverse(),
    [recentEntries]
  );

  // ===============================
  // ANALYZE ENTRY (unchanged)
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
      setAnalysis(deep);
      setMindsetScore(deep.mindset_score);
      setAiInsight(deep.ai_insight_today);

      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;

      if (user) {
        const newEntry: EntryRow = {
          user_id: user.id,
          content: input,
          created_at: new Date().toISOString(),
          analysis: deep,
        };

        await supabase.from("entries").insert({
          user_id: user.id,
          content: input,
          analysis: deep,
        });

        setLatestEntry(newEntry);
        setRecentEntries((prev) => [newEntry, ...prev]);

        await updateSummary(deep);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  }

  // ===============================
  // Render
  // ===============================
  return (
    <div className="px-4 md:px-10 py-10 space-y-10">
      {/* -------------------------------------
         NEW ENTRY HERO (only when no analysis yet)
      -------------------------------------- */}
      {!activeEntry && (
        <Card className="rounded-3xl border-none bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white shadow-2xl shadow-indigo-500/30">
          <CardContent className="p-7 md:p-9 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Welcome back 👋
                </h1>
                <p className="text-indigo-100 mt-2 max-w-xl text-sm md:text-base">
                  Napiši što ti se vrti po glavi. Mindset Debugger će razbiti
                  priču na emocije, obrasce i konkretne korake.
                </p>
              </div>
              <div className="hidden md:block rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
                🔐 Tvoja analiza ostaje privatna – koristi se samo za tvoje
                uvide i statistiku.
              </div>
            </div>

            <div className="mt-4 bg-black/10 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/15">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Napiši kako se osjećaš, što te muči ili vrtiš po glavi…"
                className="bg-transparent text-white placeholder:text-white/50 border-white/30 min-h-[130px] text-sm md:text-base"
              />

              {errorMsg && (
                <p className="text-rose-200 text-xs mt-2">{errorMsg}</p>
              )}

              <div className="flex items-center justify-between mt-3 gap-3">
                {loadingSummary && (
                  <p className="text-xs text-indigo-100 animate-pulse">
                    Ažuriram tvoje dugoročne uvide…
                  </p>
                )}

                <Button
                  onClick={analyze}
                  disabled={loading}
                  className="ml-auto bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg shadow-black/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* If we already have at least one entry */}
      {activeEntry && (
        <>
          {/* TOP LAYOUT: Insight + Score / Timeline */}
          <div className="grid gap-8 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] items-start">
            {/* Insight Card */}
            <Card className="rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100">
              <CardContent className="p-7 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <span className="text-pink-500 text-2xl">🧠</span>
                    {isToday
                      ? "Današnji insight"
                      : `Insight od ${formatDateLabel(activeDate!)}`}
                  </h2>
                  {activeDate && (
                    <span className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-600">
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
                    <Button variant="outline" size="sm" className="text-xs">
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
              <Card className="rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <Activity className="text-indigo-600 h-5 w-5" />
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
                        className="stroke-slate-200"
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
                          2 *
                          Math.PI *
                          46 *
                          (1 - (mindsetScore ?? 0) / 100)
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
              <Card className="rounded-3xl border border-slate-100 shadow-md shadow-slate-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <CalendarDays className="text-indigo-600 h-5 w-5" />
                    Recent Mood (last 7 entries)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  {moodTimeline.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      Nema još dovoljno podataka.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {moodTimeline.map((m, idx) => {
                        const mood = scoreToMood(m.score);
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs ${mood.bg} ${mood.text}`}
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
          </div>

          {/* Section separator */}
          <div className="h-px bg-slate-200/70 my-6" />

          {/* Masonry-ish layout: Emotions + Actions + Reframes */}
          {activeEntry && (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] auto-rows-fr items-start">
              {/* Primary Emotions */}
              <Card className="rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/70 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
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
                        (emo, index) => {
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
                    <p className="text-xs text-slate-400">
                      Nema jasno označenih emocija za ovaj unos.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Action Steps */}
              <Card className="rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/70 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    🧭 Action Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-2xl border bg-emerald-50 text-emerald-800 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Today’s Micro-Step
                      </p>
                      <p className="text-sm mt-1">
                        {activeEntry.analysis.actions.today_micro_step}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border bg-sky-50 text-sky-800 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Tomorrow Focus
                      </p>
                      <p className="text-sm mt-1">
                        {activeEntry.analysis.actions.tomorrow_focus}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border bg-rose-50 text-rose-800 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Potential Pitfall
                      </p>
                      <p className="text-sm mt-1">
                        {activeEntry.analysis.actions.potential_pitfall}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border bg-amber-50 text-amber-900 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide">
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
              <Card className="rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/70 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    🔄 Reframes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-1">
                    {Object.entries(activeEntry.analysis.reframes || {}).map(
                      ([key, val]) => (
                        <div
                          key={key}
                          className="p-4 rounded-2xl border bg-purple-50 text-purple-900 shadow-sm"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm mt-1">{val}</p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Separator */}
          <div className="h-px bg-slate-200/70 my-6" />

          {/* Recent entries compact list */}
          <Card className="rounded-3xl border border-slate-100 shadow-md shadow-slate-200/70">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm md:text-base">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  Recent Entries
                </span>
                <Link
                  href="/dashboard/history"
                  className="text-xs md:text-sm text-indigo-600 flex items-center gap-1"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100">
              {recentEntries.length === 0 && (
                <p className="text-sm text-slate-400 py-4">
                  Još nema spremljenih unosa.
                </p>
              )}

              {recentEntries.map((e) => (
                <Link
                  key={e.id}
                  href={`/dashboard/history/${e.id}`}
                  className="block py-3 hover:bg-slate-50/80 rounded-xl -mx-3 px-3 transition"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm md:text-base line-clamp-1">
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
                      <span className="text-[11px] rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                        {e.analysis?.mindset_score ?? "--"}/100
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
