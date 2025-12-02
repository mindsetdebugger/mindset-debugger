"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

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
  const supabase = supabaseBrowser();

  // ============================
  // TYPING EFFECT
  // ============================
  const fullInsight =
    "Detected a procrastination-with-rationalization loop. Emotional tone: anxiety + guilt. You are self-aware enough to change — you just need momentum-building micro-steps.";
  const [typedInsight, setTypedInsight] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTypedInsight(fullInsight.slice(0, i));
      if (i >= fullInsight.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // ============================
  // REAL DATA: RECENT ENTRIES
  // ============================
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase.auth.getUser();
      if (!session?.user) return;
      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("entries")
        .select("id, created_at, content, analysis")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error(error);
        return;
      }

      const mapped =
        data?.map((e) => {
          const a = e.analysis ?? {};

          // primary emotion
          const emotion =
            a?.emotions?.primary?.[0]?.emoji ??
            a?.emotions?.primary?.[0]?.emotion ??
            "📝";

          // summary fallback
          const summary =
            a?.summary?.trim()?.length > 0
              ? a.summary
              : a?.key_themes?.[0]
              ? a.key_themes[0]
              : e.content?.split(".")[0]
              ? e.content.split(".")[0]
              : "Reflection";

          return {
            id: e.id,
            created_at: e.created_at,
            emotion,
            summary,
            content: e.content,
          };
        }) ?? [];

      setRecentEntries(mapped);
    };

    load();
  }, []);

  // ============================
  // STATIC MOCKS (KEEP THEM)
  // ============================
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

  const moodLevels = useMemo(
    () =>
      [1, 2, 3, 1, 4, 2, 3, 0, 1, 2, 4, 3, 2, 1, 0, 2, 3, 4, 2, 1, 1, 3, 4, 2, 2, 3, 1, 0, 2, 3],
    []
  );

  const heatmapColors = [
    "bg-slate-100",
    "bg-indigo-100",
    "bg-indigo-300",
    "bg-indigo-500",
    "bg-indigo-700",
  ];

  const weeklyGoalCompletion = 64;
  const mindsetScore = 72;

  // ============================
  // COMPONENT
  // ============================

  return (
    <div className="space-y-10 px-4 md:px-10 py-6">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white p-6 md:p-8 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Your inner dashboard, today.
        </h1>
        <p className="text-indigo-200 mt-2 text-sm md:text-base max-w-xl">
          See your mindset score, emotional patterns, biases, and progress — all in one overview.
        </p>

        <Link href="/dashboard/new">
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-white text-indigo-800 text-sm font-medium px-4 py-2 shadow hover:shadow-lg hover:-translate-y-0.5 transition">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            New entry
          </button>
        </Link>
      </div>

      {/* TOP: SCORE + AI INSIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* RADIAL SCORE */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Activity className="h-5 w-5 text-indigo-600" />
              Today’s Mindset Score
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="46" className="stroke-slate-200" strokeWidth="10" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  stroke="url(#mindsetGrad)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - mindsetScore / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="mindsetGrad">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-indigo-700">{mindsetScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI INSIGHT */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Brain className="h-5 w-5 text-indigo-600" />
              Your AI Insight Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs uppercase text-indigo-500 tracking-wide mb-2">
              Mindset Debugger Interpretation
            </p>

            <p className="text-sm md:text-base font-mono text-slate-800 min-h-[90px]">
              {typedInsight}
              <span className="inline-block w-1 h-4 bg-indigo-400 animate-pulse ml-0.5" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HEATMAP + BIAS RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* HEATMAP */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-indigo-600" />
              Mood Heatmap (Last 30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-1">
              {moodLevels.map((lvl, i) => (
                <div key={i} className={`w-5 h-5 rounded-md ${heatmapColors[lvl]}`} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* RADAR */}
        <Card className="rounded-2xl shadow-md border border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Cognitive Bias Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="80%" data={biasData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="bias" tick={{ fontSize: 10 }} />
                <Radar dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* PROGRESS + RECENT ENTRIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROGRESS CARD */}
        <Card className="rounded-2xl shadow-md border border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Personal Growth Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Weekly consistency towards your reflection & growth goals.
            </p>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden my-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                style={{ width: `${weeklyGoalCompletion}%` }}
              />
            </div>
            <p className="text-xs text-slate-700">{weeklyGoalCompletion}% achieved</p>
          </CardContent>
        </Card>

        {/* RECENT ENTRIES (REAL DATA) */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Entries
              <Link href="/dashboard/history" className="text-sm text-indigo-600 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent className="divide-y">

            {recentEntries.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">No recent entries yet.</p>
            )}

            {recentEntries.map((e) => (
              <Link
                key={e.id}
                href={`/dashboard/history/${e.id}`}
                className="block py-4 px-3 hover:bg-indigo-50/60 rounded-lg transition"
              >
                <div className="flex justify-between items-start gap-4">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium text-sm md:text-base">
                      <span className="text-xl">{e.emotion}</span>
                      {e.summary}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {e.content}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(e.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              </Link>
            ))}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
