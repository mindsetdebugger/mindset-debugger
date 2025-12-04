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
import { SaveToNotesButton } from "@/components/SaveToNotesButton";

const COLORS = [
  "#4f46e5",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#0ea5e9",
  "#6366f1",
  "#facc15",
];

export default function TrendsPage() {
  const supabase = supabaseBrowser();

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // derived
  const [mindsetSeries, setMindsetSeries] = useState([]);
  const [emotionSeries, setEmotionSeries] = useState([]);
  const [emotionDistribution, setEmotionDistribution] = useState([]);
  const [patternFrequency, setPatternFrequency] = useState([]);
  const [weeklySummaries, setWeeklySummaries] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const { data: session } = await supabase.auth.getUser();
        const user = session?.user;
        if (!user) return;

        const { data: summaryData } = await supabase
          .from("history_summaries")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        setSummary(summaryData || null);

        const since = new Date();
        since.setDate(since.getDate() - 30);

        const { data: entryData } = await supabase
          .from("entries")
          .select("created_at, analysis")
          .eq("user_id", user.id)
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true });

        const cleanEntries: any = (entryData || []).map((e: any) => ({
          created_at: e.created_at,
          analysis: e.analysis,
        }));

        setEntries(cleanEntries);

        setMindsetSeries(buildMindsetSeries(cleanEntries));
        setEmotionSeries(buildEmotionIntensitySeries(cleanEntries));
        setEmotionDistribution(buildEmotionDistribution(cleanEntries));
        setPatternFrequency(buildPatternFrequency(cleanEntries));
        setWeeklySummaries(buildWeeklySummaries(cleanEntries));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const trends = summary?.trends_page || null;
  const forecastText = deriveForecast(trends);

  if (loading)
    return <div className="px-10 py-10 text-slate-500">Učitavanje trendova…</div>;

  // ============================================================
  // PAGE RENDER
  // ============================================================
  return (
    <div className="px-4 md:px-10 py-10 space-y-10">

      {/* -------------------------------------------------------- */}
      {/* HEADER with Save */}
      {/* -------------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 text-white px-6 py-8 md:px-10 md:py-10 shadow-xl">

        <div className="flex justify-between items-start">
          <div className="max-w-xl space-y-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <CalendarRange className="h-7 w-7" />
              Long-Term Trends
            </h1>
            <p className="text-indigo-100">
              Pogled unatrag na zadnjih 30 dana.
            </p>
          </div>

          <SaveToNotesButton
            title="30-day Trends Summary"
            content={summary?.summary_short || ""}
            tags={["trends", "summary"]}
          />
        </div>

        <div className="mt-5 bg-white/10 border border-white/20 rounded-2xl px-5 py-4 shadow-lg backdrop-blur-md max-w-sm">
          <p className="text-xs uppercase tracking-wide text-indigo-100 mb-1">Sažetak</p>
          <p className="text-sm leading-snug text-indigo-50">
            {summary?.summary_short || "Nema još agregiranog sažetka."}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- */}
      {/* TOP CARDS — each with SAVE */}
      {/* -------------------------------------------------------- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* AVG MINDSET SCORE */}
        <Card className="rounded-2xl shadow-md border-slate-200">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">Prosječni Mindset Score</CardTitle>
            <SaveToNotesButton
              title="Average Mindset Score"
              content={`Mindset: ${trends?.avg_mindset_score || "N/A"}`}
              tags={["mindset", "score"]}
            />
          </CardHeader>

          <CardContent className="flex justify-between p-5">
            <div>
              <p className="text-3xl font-bold text-indigo-600 mt-1">
                {trends?.avg_mindset_score ?? "—"}
              </p>
              <p className="text-xs text-slate-500">kroz zadnjih 30 dana</p>
            </div>
            <Activity className="h-8 w-8 text-indigo-500" />
          </CardContent>
        </Card>

        {/* EMOTIONAL STABILITY */}
        <Card className="rounded-2xl shadow-md border-slate-200">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">Emocionalna stabilnost</CardTitle>
            <SaveToNotesButton
              title="Emotional Stability"
              content={`Stability: ${trends?.emotional_stability_score || "N/A"}`}
              tags={["emotion", "stability"]}
            />
          </CardHeader>

          <CardContent className="flex justify-between p-5">
            <div>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {trends?.emotional_stability_score ?? "—"}
              </p>
              <p className="text-xs text-slate-500">manje oscilacija = bolje</p>
            </div>
            <Brain className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>

        {/* MOMENTUM */}
        <Card className="rounded-2xl shadow-md border-slate-200">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">Momentum</CardTitle>

            <SaveToNotesButton
              title="Momentum Summary"
              content={trends?.overall_progress || "mixed"}
              tags={["momentum", "progress"]}
            />
          </CardHeader>

          <CardContent className="flex justify-between p-5">
            <div>
              <p className="text-sm flex items-center gap-2">
                {trends?.overall_progress === "improving" && (
                  <><TrendingUp className="text-emerald-500" /> Napredak</>
                )}
                {trends?.overall_progress === "declining" && (
                  <><TrendingDown className="text-rose-500" /> Teže razdoblje</>
                )}
                {!trends?.overall_progress && (
                  <><AlertTriangle className="text-amber-500" /> Mješovito</>
                )}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                bazirano na stresu i mindsetu
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------------------------------- */}
      {/* CHARTS — each gets a SAVE summarizing data */}
      {/* -------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* MINDSET TREND */}
        <Card className="rounded-3xl shadow-lg border-slate-200">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              Mindset Score • 30 dana
            </CardTitle>

            <SaveToNotesButton
              title="Mindset Trend Data"
              content={mindsetSeries.map((d: any) => `${d.dateLabel}: ${d.score}`)}
              tags={["mindset", "trend"]}
            />
          </CardHeader>

          <CardContent className="h-64">
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
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* EMOTION INTENSITY */}
        <Card className="rounded-3xl shadow-lg border-slate-200">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-rose-500" />
              Emocionalna intenzivnost
            </CardTitle>

            <SaveToNotesButton
              title="Emotion Intensity Trend"
              content={emotionSeries.map((d: any) => `${d.dateLabel}: ${d.intensity}`)}
              tags={["emotion", "intensity"]}
            />
          </CardHeader>

          <CardContent className="h-64">
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
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------------------------------- */}
      {/* EMOTION DISTRIBUTION + PATTERN FREQUENCY */}
      {/* -------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PIE */}
        <Card className="rounded-3xl shadow-lg border-slate-200">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Distribucija emocija</CardTitle>

            <SaveToNotesButton
              title="Emotion Distribution"
              content={emotionDistribution.map((e: any) => `${e.emotion}: ${e.value}%`)}
              tags={["emotion", "distribution"]}
            />
          </CardHeader>

          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionDistribution}
                  dataKey="value"
                  nameKey="emotion"
                  outerRadius={90}
                  label
                >
                  {emotionDistribution.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PATTERN FREQUENCY */}
        <Card className="rounded-3xl shadow-lg border-slate-200">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Učestalost obrazaca</CardTitle>

            <SaveToNotesButton
              title="Pattern Frequency"
              content={patternFrequency.map((p: any) => `${p.pattern}: ${p.count}`)}
              tags={["patterns"]}
            />
          </CardHeader>

          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patternFrequency}>
                <XAxis dataKey="pattern" fontSize={11} />
                <YAxis allowDecimals={false} fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------------------------------- */}
      {/* WEEKLY SUMMARIES — each card gets Save */}
      {/* -------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Tjedni uzorci</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weeklySummaries.slice(0, 3).map((w: any) => (
            <Card key={w.key} className="rounded-2xl border-slate-200 shadow-md">

              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-sm">{w.label}</CardTitle>

                <SaveToNotesButton
                  title={`Weekly Summary: ${w.label}`}
                  content={[
                    `Avg Mindset: ${w.avgMindset}`,
                    `Emotion: ${w.dominantEmotion}`,
                    `Pattern: ${w.dominantPattern}`,
                    `Entries: ${w.entriesCount}`
                  ]}
                  tags={["weekly", "summary"]}
                />
              </CardHeader>

              <CardContent className="space-y-1 text-xs text-slate-600">
                <p><strong>Mindset:</strong> {w.avgMindset}</p>
                <p><strong>Emocija:</strong> {w.dominantEmotion}</p>
                <p><strong>Obrazac:</strong> {w.dominantPattern}</p>
                <p><strong>Zapisi:</strong> {w.entriesCount}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- */}
      {/* FORECAST — Save button */}
      {/* -------------------------------------------------------- */}
      <section>
        <Card className="rounded-3xl shadow-lg border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50">

          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex gap-2 items-center">
              <Sparkles className="text-emerald-600" />
              AI Forecast
            </CardTitle>

            <SaveToNotesButton
              title="AI Forecast"
              content={forecastText}
              tags={["forecast", "ai"]}
            />
          </CardHeader>

          <CardContent>
            <p className="text-sm text-slate-700">
              {forecastText}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
