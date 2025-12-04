// app/dashboard/trends/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  Activity,
  Brain,
  CalendarRange,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import {
  buildMindsetSeries,
  buildEmotionIntensitySeries,
  buildEmotionDistribution,
  buildPatternFrequency,
  buildWeeklySummaries,
  deriveForecast,
  type EntryRow,
} from "@/lib/trends-helpers";

const COLORS = [
  "#4f46e5",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#0ea5e9",
  "#6366f1",
  "#facc15",
];

// ----------------------------- PAGE -----------------------------

export default function TrendsPage() {
  const supabase = supabaseBrowser();

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // derived
  const [mindsetSeries, setMindsetSeries] = useState<
    { dateLabel: string; score: number }[]
  >([]);
  const [emotionSeries, setEmotionSeries] = useState<
    { dateLabel: string; intensity: number }[]
  >([]);
  const [emotionDistribution, setEmotionDistribution] = useState<
    { emotion: string; value: number }[]
  >([]);
  const [patternFrequency, setPatternFrequency] = useState<
    { pattern: string; count: number }[]
  >([]);
  const [weeklySummaries, setWeeklySummaries] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: session } = await supabase.auth.getUser();
        const user = session?.user;
        if (!user) {
          setError("No user session.");
          setLoading(false);
          return;
        }

        // 1) history_summaries (aggregati za trends / insights)
        const { data: summaryData, error: sErr } = await supabase
          .from("history_summaries")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (sErr) console.warn("history_summaries error:", sErr);
        setSummary(summaryData || null);

        // 2) entries zadnjih 30 dana
        const since = new Date();
        since.setDate(since.getDate() - 30);

        const { data: entryData, error: eErr } = await supabase
          .from("entries")
          .select("created_at, analysis")
          .eq("user_id", user.id)
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true });

        if (eErr) {
          console.error(eErr);
          setError(eErr.message);
          setLoading(false);
          return;
        }

        const cleanEntries: EntryRow[] = (entryData || []).map((e: any) => ({
          created_at: e.created_at,
          analysis: e.analysis,
        }));

        setEntries(cleanEntries);

        // derived series
        setMindsetSeries(buildMindsetSeries(cleanEntries));
        setEmotionSeries(buildEmotionIntensitySeries(cleanEntries));
        setEmotionDistribution(buildEmotionDistribution(cleanEntries));
        setPatternFrequency(buildPatternFrequency(cleanEntries));
        setWeeklySummaries(buildWeeklySummaries(cleanEntries));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const trends = summary?.trends_page || null;

  const forecastText = deriveForecast(trends);

  // -------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------
  if (loading) {
    return (
      <div className="px-4 md:px-10 py-10 text-slate-500">
        Učitavanje trendova…
      </div>
    );
  }

  if (!entries.length && !summary) {
    return (
      <div className="px-4 md:px-10 py-16 text-center text-slate-500">
        Za prikaz trendova trebaš barem nekoliko unosa.  
        Započni s današnjim zapisom na Home stranici. 🙂
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-10 space-y-10">

      {/* --------------------- HEADER --------------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 text-white px-6 py-8 md:px-10 md:py-10 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <CalendarRange className="h-7 w-7" />
              Long-Term Trends
            </h1>
            <p className="mt-3 text-sm md:text-base text-indigo-100">
              Pogled unatrag na zadnjih 30 dana — kako su se tvoj mindset,
              emocije i obrasci stvarno mijenjali kroz vrijeme.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4 shadow-lg backdrop-blur-md max-w-sm">
            <p className="text-xs uppercase tracking-wide text-indigo-100 mb-1">
              Sažetak tvog razdoblja
            </p>
            <p className="text-sm leading-snug text-indigo-50">
              {summary?.summary_short ||
                "Nema još agregiranog sažetka – svaki novi zapis pomaže da ovdje dobiješ jasnu sliku svojih obrazaca."}
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-32 -bottom-32 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* --------------------- TOP STATS STRIP --------------------- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-md border-slate-200">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Prosječni Mindset Score
              </p>
              <p className="text-3xl font-bold text-indigo-600 mt-1">
                {trends?.avg_mindset_score ?? "—"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                kroz zadnjih 30 dana
              </p>
            </div>
            <Activity className="h-9 w-9 text-indigo-500" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-slate-200">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Emocionalna stabilnost
              </p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {trends?.emotional_stability_score ?? "—"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                viši broj = manje oscilacija
              </p>
            </div>
            <Brain className="h-9 w-9 text-emerald-500" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border-slate-200">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Momentum
              </p>
              <p className="text-sm mt-1 flex items-center gap-2 text-slate-700">
                {trends?.overall_progress === "improving" && (
                  <>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span>Opći trend ide prema naprijed.</span>
                  </>
                )}
                {trends?.overall_progress === "declining" && (
                  <>
                    <TrendingDown className="h-4 w-4 text-rose-500" />
                    <span>Ovo razdoblje ti je izazovnije nego prije.</span>
                  </>
                )}
                {(!trends || !trends?.overall_progress || trends?.overall_progress === "mixed") && (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Slika je miješana — ima i rasta i padova.</span>
                  </>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                bazirano na stresu, otpornosti i mindsetu
              </p>
            </div>
            <Sparkles className="h-9 w-9 text-purple-500" />
          </CardContent>
        </Card>
      </section>

      {/* --------------------- LINE & AREA CHARTS --------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mindset Score Trend */}
        <Card className="rounded-3xl shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-indigo-600" />
              Mindset Score • zadnjih 30 dana
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {mindsetSeries.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nema dovoljno podataka za prikaz Mindset trenda.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mindsetSeries}>
                  <XAxis dataKey="dateLabel" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={2.4}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Emotional Intensity Trend */}
        <Card className="rounded-3xl shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-rose-500" />
              Prosječna emocionalna intenzivnost
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {emotionSeries.length === 0 ? (
              <p className="text-sm text-slate-500">
                Još nemamo mjerljive emocije za ovo razdoblje.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emotionSeries}>
                  <XAxis dataKey="dateLabel" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip />
                  <defs>
                    <linearGradient id="emotionArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="intensity"
                    stroke="#ec4899"
                    fill="url(#emotionArea)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* --------------------- EMOTION DISTRIBUTION + PATTERNS -------- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Distribution */}
        <Card className="rounded-3xl shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Emocije kroz zadnje zapise
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {emotionDistribution.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nema dovoljno označenih emocija za distribuciju.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionDistribution}
                    dataKey="value"
                    nameKey="emotion"
                    outerRadius={90}
                    label={(d: any) => `${d.emotion} (${d.value}%)`}
                  >
                    {emotionDistribution.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pattern Frequency */}
        <Card className="rounded-3xl shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Učestalost kognitivnih obrazaca
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {patternFrequency.length === 0 ? (
              <p className="text-sm text-slate-500">
                Još nemamo prepoznate kognitivne obrasce.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternFrequency}>
                  <XAxis
                    dataKey="pattern"
                    fontSize={11}
                    tickFormatter={(v) =>
                      (v as string).length > 10
                        ? (v as string).slice(0, 10) + "…"
                        : v
                    }
                  />
                  <YAxis allowDecimals={false} fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* --------------------- WEEKLY SUMMARIES ------------------------ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Tjedni uzorci (sažetak)
          </h2>
          <p className="text-xs text-slate-500">
            Najnovija 3 tjedna tvojih obrazaca.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weeklySummaries.slice(0, 3).map((w) => (
            <Card
              key={w.key}
              className="rounded-2xl border-slate-200 shadow-md"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  {w.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-600">
                <p>
                  <span className="font-semibold">Mindset prosjek: </span>
                  {w.avgMindset ?? "—"}
                </p>
                <p>
                  <span className="font-semibold">Dominantna emocija: </span>
                  {w.dominantEmotion ? w.dominantEmotion : "—"}
                </p>
                <p>
                  <span className="font-semibold">Glavni obrazac: </span>
                  {w.dominantPattern ? w.dominantPattern : "—"}
                </p>
                <p>
                  <span className="font-semibold">Broj zapisa: </span>
                  {w.entriesCount}
                </p>
              </CardContent>
            </Card>
          ))}

          {weeklySummaries.length === 0 && (
            <p className="text-sm text-slate-500">
              Još nema dovoljno zapisa za tjedne sažetke.
            </p>
          )}
        </div>
      </section>

      {/* --------------------- AI FORECAST ----------------------------- */}
      <section>
        <Card className="rounded-3xl shadow-lg border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              AI Forecast — kamo ovo sve ide?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 leading-relaxed">
              {forecastText}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
