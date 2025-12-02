"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Activity,
  Brain,
  TrendingUp,
  CalendarDays,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  // === TYPING EFFECT FOR AI INSIGHT ===
  const fullInsight =
    "Detected a procrastination-with-rationalization loop. Emotional tone: anxiety + guilt. You are self-aware enough to change — you just need momentum-building micro-steps.";
  const [typedInsight, setTypedInsight] = useState("");

  useEffect(() => {
    let i = 0;
    setTypedInsight("");
    const interval = setInterval(() => {
      i += 1;
      setTypedInsight(fullInsight.slice(0, i));
      if (i >= fullInsight.length) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // === MOCK DATA: RADAR BIAS CHART ===
  const biasData = useMemo(
    () => [
      { bias: "Overthinking", value: 80 },
      { bias: "Catastrophizing", value: 60 },
      { bias: "Personalization", value: 40 },
      { bias: "Labeling", value: 30 },
      { bias: "All-or-nothing", value: 50 },
    ],
    []
  );

  // === MOCK DATA: MOOD HEATMAP (30 dana) ===
  // 0 = low intensity, 4 = high
  const moodLevels = useMemo(
    () => [1, 2, 3, 1, 4, 2, 3, 0, 1, 2, 4, 3, 2, 1, 0, 2, 3, 4, 2, 1, 1, 3, 4, 2, 2, 3, 1, 0, 2, 3],
    []
  );

  const heatmapColors = [
    "bg-slate-100",
    "bg-indigo-100",
    "bg-indigo-300",
    "bg-indigo-500",
    "bg-indigo-700",
  ];

  // === MOCK DATA: PROGRESS BAR ===
  const weeklyGoalCompletion = 64; // %

  const mindsetScore = 72; // for radial chart

  return (
    <div className="space-y-10 px-4 md:px-10 py-6">

      {/* =============================== */}
      {/* HERO SUMMARY BAR                */}
      {/* =============================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white p-6 md:p-8 shadow-xl">
        {/* background blobs */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute w-72 h-72 bg-indigo-300 rounded-full blur-3xl -top-10 -left-10" />
          <div className="absolute w-64 h-64 bg-purple-400 rounded-full blur-3xl -bottom-10 right-10" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Your inner dashboard, today.
            </h1>
            <p className="text-indigo-200 mt-2 text-sm md:text-base max-w-xl">
              See your mindset score, emotional patterns, biases, and progress —
              all in one overview.
            </p>
          </div>

          <Link href="/dashboard/new" className="self-start md:self-auto">
            <button className="inline-flex items-center gap-2 rounded-full bg-white text-indigo-800 text-sm font-medium px-4 py-2 shadow hover:shadow-lg hover:-translate-y-0.5 transition">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              New entry
            </button>
          </Link>
        </div>
      </div>

      {/* =============================== */}
      {/* TOP ROW: RADIAL + AI INSIGHT    */}
      {/* =============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* RADIAL SCORE CHART */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Activity className="h-5 w-5 text-indigo-600" />
              Today’s Mindset Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              {/* background circle */}
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  className="stroke-slate-200"
                  strokeWidth="10"
                  fill="none"
                />
                {/* progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  stroke="url(#mindsetGradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={
                    2 * Math.PI * 46 * (1 - mindsetScore / 100)
                  }
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="mindsetGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-indigo-700">
                  {mindsetScore}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  / 100
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs md:text-sm text-muted-foreground text-center max-w-xs">
              Your mindset is trending upward. Small consistent shifts beat
              massive one-off bursts.
            </p>
          </CardContent>
        </Card>

        {/* AI INSIGHT TODAY */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Brain className="h-5 w-5 text-indigo-600" />
              Your AI Insight Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-indigo-500">
              Mindset Debugger interpretation
            </p>
            <p className="text-sm md:text-base leading-relaxed font-mono text-slate-800 min-h-[90px]">
              {typedInsight}
              <span className="inline-block w-1 h-4 bg-indigo-400 align-baseline animate-pulse ml-0.5" />
            </p>
            <p className="text-xs text-muted-foreground">
              This is a sample preview. In your account, insights are based on
              your actual entries and patterns.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* =============================== */}
      {/* SECOND ROW: HEATMAP + RADAR     */}
      {/* =============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MOOD HEATMAP */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <CalendarDays className="h-5 w-5 text-indigo-600" />
              Mood Heatmap (last 30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-1">
              {moodLevels.map((level, index) => (
                <div
                  key={index}
                  className={`w-5 h-5 rounded-md ${heatmapColors[level]}`}
                  title={`Day ${index + 1}: mood intensity ${level}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Darker tiles = more intense emotional days.  
              Use this to spot cycles and patterns over time.
            </p>
          </CardContent>
        </Card>

        {/* BIAS RADAR CHART */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Cognitive Bias Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="80%" data={biasData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="bias" tick={{ fontSize: 10 }} />
                <Radar
                  name="Bias"
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              Higher values = stronger detected bias tendencies in your writing.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* =============================== */}
      {/* THIRD ROW: PROGRESS + ENTRIES   */}
      {/* =============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PERSONAL GROWTH PROGRESS */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Target className="h-5 w-5 text-indigo-600" />
              Personal Growth Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Weekly consistency towards your reflection & growth goals.
            </p>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
                style={{ width: `${weeklyGoalCompletion}%` }}
              />
            </div>
            <p className="text-xs font-medium text-slate-700">
              {weeklyGoalCompletion}% of your weekly target completed
            </p>
            <p className="text-[11px] text-muted-foreground">
              Tip: even one short entry a day builds a powerful dataset of your
              inner world over time.
            </p>
          </CardContent>
        </Card>

        {/* RECENT ENTRIES */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-base md:text-lg">
              Recent Entries
              <Link
                href="/dashboard/history"
                className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent className="divide-y">
            <Link
              href="/dashboard/history/1"
              className="block py-4 hover:bg-indigo-50/60 rounded-lg px-3 transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm md:text-base font-medium">
                    <span className="text-2xl">😞</span>
                    Feeling overwhelmed
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                    “I noticed the same stress pattern again when I tried to start
                    something important…”
                  </p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  05 Mar
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/history/2"
              className="block py-4 hover:bg-indigo-50/60 rounded-lg px-3 transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm md:text-base font-medium">
                    <span className="text-2xl">🔥</span>
                    Quiet focus
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                    “Today I finally moved a project forward without overthinking every step…”
                  </p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  04 Mar
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
