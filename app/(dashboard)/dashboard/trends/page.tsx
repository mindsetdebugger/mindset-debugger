"use client";

import { useEffect, useState } from "react";

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
} from "@/lib/trends-helpers";
import { SaveToNotesButton } from "@/components/SaveToNotesButton";
import { useEntriesStore } from "@/lib/store/useEntriesStore";
import { useSummaryStore } from "@/lib/store/useSummaryStore";


// pastel color palette
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
  const {
    entries,
    loading: entriesLoading,
    loaded: entriesLoaded,
    fetchAll,
  } = useEntriesStore();

  const {
    summary,
    loading: summaryLoading,
    loaded: summaryLoaded,
    fetchSummary,
  } = useSummaryStore();

  const [mindsetSeries, setMindsetSeries] = useState<any[]>([]);
  const [emotionSeries, setEmotionSeries] = useState<any[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<any[]>([]);
  const [patternFrequency, setPatternFrequency] = useState<any[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<any[]>([]);

  // ensure data
  useEffect(() => {
    if (!entriesLoaded && !entriesLoading) {
      fetchAll();
    }
    if (!summaryLoaded && !summaryLoading) {
      fetchSummary();
    }
  }, [
    entriesLoaded,
    entriesLoading,
    fetchAll,
    summaryLoaded,
    summaryLoading,
    fetchSummary,
  ]);

  // build derived series when entries change
  useEffect(() => {
    if (!entries.length) {
      setMindsetSeries([]);
      setEmotionSeries([]);
      setEmotionDistribution([]);
      setPatternFrequency([]);
      setWeeklySummaries([]);
      return;
    }

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const recentEntries = entries.filter(
      (e) => new Date(e.created_at) >= since
    );

    const cleanEntries = recentEntries.map((e) => ({
      created_at: e.created_at,
      analysis: e.analysis,
    }));

    setMindsetSeries(buildMindsetSeries(cleanEntries));
    setEmotionSeries(buildEmotionIntensitySeries(cleanEntries));
    setEmotionDistribution(buildEmotionDistribution(cleanEntries));
    setPatternFrequency(buildPatternFrequency(cleanEntries));
    setWeeklySummaries(buildWeeklySummaries(cleanEntries));
  }, [entries]);

  const trends = summary?.trends_page || null;
  const forecastText = deriveForecast(trends);

  const loading = (!entriesLoaded && entriesLoading) || (!summaryLoaded && summaryLoading);

  if (loading)
    return (
      <div className="py-20 text-center text-slate-500">
        Učitavanje trendova…
      </div>
    );

  return (
    <div className="py-12 space-y-14">

      {/* HEADER */}
      <header className="space-y-3 max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          📈 Long-Term Trends
        </h1>
        <p className="text-slate-600 leading-relaxed">
          Tvoj mentalni, emocionalni i kognitivni obrazac kroz posljednjih 30 dana.
          Moderno, jednostavno, jasno — kao što bi SaaS dashboard trebao izgledati.
        </p>
      </header>

      {/* TOP SUMMARY BANNER */}
      <section
        className="
        rounded-3xl 
        bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500
        text-white px-6 py-10 md:px-10 shadow-xl
      "
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-3xl font-semibold flex items-center gap-2">
              <CalendarRange /> 30-day Overview
            </h2>
            <p className="text-indigo-100 text-sm">
              Automatski generiran pregled tvog zadnjeg mjeseca.
            </p>
          </div>

          <SaveToNotesButton
            title="30-day Trends Summary"
            content={summary?.summary_short || ""}
            tags={["trends"]}
          />
        </div>

        {(summary?.summary_short || "").length > 0 && (
          <div className="mt-6 bg-white/10 border border-white/20 rounded-2xl px-5 py-4 shadow-lg backdrop-blur-md max-w-sm">
            <p className="text-xs uppercase tracking-wide text-indigo-100 mb-1">
              Sažetak
            </p>
            <p className="text-sm leading-snug text-indigo-50">
              {summary?.summary_short}
            </p>
          </div>
        )}
      </section>

      {/* TOP CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AVG MINDSET */}
        <Card className="rounded-2xl shadow-md border-slate-200 bg-white">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm text-slate-700">
              Prosječni Mindset Score
            </CardTitle>

            <SaveToNotesButton
              title="Average Mindset Score"
              content={trends?.avg_mindset_score ?? "N/A"}
              tags={["mindset"]}
            />
          </CardHeader>
          <CardContent className="flex justify-between p-5">
            <div>
              <p className="text-3xl font-bold text-indigo-600">
                {trends?.avg_mindset_score ?? "—"}
              </p>
              <p className="text-xs text-slate-500 mt-1">kroz zadnjih 30 dana</p>
            </div>
            <Activity className="h-8 w-8 text-indigo-500" />
          </CardContent>
        </Card>

        {/* STABILITY */}
        <Card className="rounded-2xl shadow-md border-slate-200 bg-white">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm text-slate-700">
              Emocionalna stabilnost
            </CardTitle>

            <SaveToNotesButton
              title="Emotional Stability"
              content={trends?.emotional_stability_score ?? "N/A"}
              tags={["emotion"]}
            />
          </CardHeader>
          <CardContent className="flex justify-between p-5">
            <div>
              <p className="text-3xl font-bold text-emerald-600">
                {trends?.emotional_stability_score ?? "—"}
              </p>
              <p className="text-xs text-slate-500 mt-1">manje oscilacija = bolje</p>
            </div>
            <Brain className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>

        {/* MOMENTUM */}
        <Card className="rounded-2xl shadow-md border-slate-200 bg-white">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm text-slate-700">Momentum</CardTitle>

            <SaveToNotesButton
              title="Momentum Summary"
              content={trends?.overall_progress ?? "N/A"}
              tags={["momentum"]}
            />
          </CardHeader>

          <CardContent className="flex justify-between p-5">
            <div>
              <p className="text-sm flex items-center gap-2">
                {trends?.overall_progress === "improving" && (
                  <>
                    <TrendingUp className="text-emerald-500" /> Napredak
                  </>
                )}
                {trends?.overall_progress === "declining" && (
                  <>
                    <TrendingDown className="text-rose-500" /> Teže razdoblje
                  </>
                )}
                {!trends?.overall_progress && (
                  <>
                    <AlertTriangle className="text-amber-500" /> Mješovito
                  </>
                )}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                bazirano na stresu + mindsetu
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </section>

      {/* MAIN CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MINDSET TREND */}
        <Card className="rounded-3xl shadow-lg border-slate-200 bg-white">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-5 text-indigo-600" />
              Mindset Score • 30 dana
            </CardTitle>

            <SaveToNotesButton
              title="Mindset Trend"
              content={mindsetSeries.map((x: any) => `${x.dateLabel}: ${x.score}`)}
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
        <Card className="rounded-3xl shadow-lg border-slate-200 bg-white">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Brain className="h-5 text-rose-500" />
              Emocionalna intenzivnost
            </CardTitle>

            <SaveToNotesButton
              title="Emotion Intensity Trend"
              content={emotionSeries.map((x: any) => `${x.dateLabel}: ${x.intensity}`)}
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

      {/* SECONDARY DATA: PIE + BARS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EMOTION DISTRIBUTION */}
        <Card className="rounded-3xl shadow-lg border-slate-200 bg-white">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-slate-800">Distribucija emocija</CardTitle>

            <SaveToNotesButton
              title="Emotion Distribution"
              content={emotionDistribution.map((x: any) => `${x.emotion}: ${x.value}`)}
              tags={["emotion"]}
            />
          </CardHeader>

          <CardContent className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionDistribution}
                  nameKey="emotion"
                  dataKey="value"
                  outerRadius={90}
                  label
                >
                  {emotionDistribution.map((_: any, idx: number) => (
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
        <Card className="rounded-3xl shadow-lg border-slate-200 bg-white">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-slate-800">Učestalost obrazaca</CardTitle>

            <SaveToNotesButton
              title="Pattern Frequency"
              content={patternFrequency.map((x: any) => `${x.pattern}: ${x.count}`)}
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

      {/* WEEKLY SUMMARIES */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Tjedni uzorci
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weeklySummaries.slice(0, 3).map((w: any) => (
            <Card key={w.key} className="rounded-2xl border-slate-200 shadow-md bg-white">
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-sm">{w.label}</CardTitle>

                <SaveToNotesButton
                  title={`Weekly Summary: ${w.label}`}
                  content={[
                    `Mindset: ${w.avgMindset}`,
                    `Emocija: ${w.dominantEmotion}`,
                    `Obrazac: ${w.dominantPattern}`,
                    `Zapisi: ${w.entriesCount}`,
                  ]}
                  tags={["weekly"]}
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

      {/* FORECAST */}
      <section>
        <Card
          className="
          rounded-3xl shadow-lg border-slate-200
          bg-gradient-to-r from-slate-50 to-emerald-50
        "
        >
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-emerald-600" />
              AI Forecast
            </CardTitle>

            <SaveToNotesButton
              title="AI Forecast"
              content={forecastText}
              tags={["forecast"]}
            />
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
