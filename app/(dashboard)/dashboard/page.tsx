"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import { supabaseBrowser } from "@/lib/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Sparkles,
  Loader2,
  Activity,
  Brain,
  CalendarDays,
  ChevronRight,
  Heart,
  Lightbulb,
  Target,
} from "lucide-react";

// =====================================
// TYPES
// =====================================
type DeepAnalysis = {
  summary: string;
  emotions: {
    primary: { emotion: string; intensity: number }[];
  };
  reframes: {
    stoic: string;
    cognitive_behavioral_therapy: string;
    logic: string;
    self_compassion: string;
  };
  actions: {
    today_micro_step: string;
    momentum_builder: string;
    avoid_this: string;
    this_week_focus: string;
  };
  mindset_score: number;
  ai_insight_today: string;
};

// =====================================
// DASHBOARD
// =====================================
export default function DashboardPage() {
  const supabase = supabaseBrowser();

  // NEW ENTRY STATE
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<DeepAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // DASHBOARD DATA
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [mindsetScore, setMindsetScore] = useState<number | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // =====================================
  // LOAD TODAY ENTRY + RECENT
  // =====================================
  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) return;

      // Load entries
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) return;

      setRecentEntries(data.slice(0, 3));

      if (data.length > 0) {
        const latest = data[0];
        const lastDate = new Date(latest.created_at).toDateString();
        const today = new Date().toDateString();

        if (lastDate === today) {
          setTodayEntry(latest);
          setMindsetScore(latest.analysis?.mindset_score ?? null);
          setAiInsight(latest.analysis?.ai_insight_today ?? null);
        } else {
          // no entry today
          setTodayEntry(null);
          setMindsetScore(latest.analysis?.mindset_score ?? null);
          setAiInsight(latest.analysis?.ai_insight_today ?? null);
        }
      }
    })();
  }, []);

  // =====================================
  // ANALYZE ENTRY
  // =====================================
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

      // save entry
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("entries").insert({
          user_id: user.id,
          content: input,
          analysis: deep,
        });
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  }

  // =====================================
  // MOCK HEATMAP FOR NOW
  // =====================================
  const moodLevels = useMemo(
    () => Array.from({ length: 30 }, () => Math.floor(Math.random() * 5)),
    []
  );

  const heatmapColors = [
    "bg-slate-100",
    "bg-indigo-100",
    "bg-indigo-300",
    "bg-indigo-500",
    "bg-indigo-700",
  ];

  // =====================================
  // RENDER
  // =====================================
  return (
    <div className="px-4 md:px-10 py-10 space-y-12">

      {/* ===================================== */}
      {/* HERO SECTION */}
      {/* ===================================== */}
      {!todayEntry && !analysis && (
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 shadow-xl">

          <h1 className="text-3xl font-bold">Welcome back 👋</h1>
          <p className="text-indigo-200 mt-2">
            Start today’s check-in. Describe what’s on your mind — the AI will break it down.
          </p>

          <div className="mt-6 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write about your thoughts, feelings, fears, or stressors…"
              className="bg-transparent text-white placeholder:text-white/60 border-white/40 min-h-[140px]"
            />

            {errorMsg && (
              <p className="text-rose-200 text-xs mt-2">{errorMsg}</p>
            )}

            <div className="flex justify-end mt-4">
              <Button
                onClick={analyze}
                disabled={loading}
                className="bg-white text-indigo-900 hover:bg-indigo-50"
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
        </div>
      )}

      {/* ===================================== */}
      {/* IF USER ALREADY WROTE TODAY */}
      {/* ===================================== */}
      {todayEntry && !analysis && (
        <div className="rounded-3xl bg-emerald-50 p-8 border border-emerald-200 shadow-md">
          <h2 className="text-xl font-semibold text-emerald-700">
            You’ve already completed today’s reflection 🎉
          </h2>
          <p className="text-emerald-600 mt-1">
            Come back tomorrow for a new daily check-in.
          </p>
        </div>
      )}

      {/* ===================================== */}
      {/* ANALYSIS RESULT (compact) */}
      {/* ===================================== */}
      {analysis && (
        <Card className="border rounded-3xl shadow-xl p-8 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            🧠 Today’s Insight
          </h2>

          <p className="text-slate-700 text-lg leading-relaxed">
            {analysis.ai_insight_today}
          </p>

          <Card className="bg-indigo-50 border border-indigo-200">
            <CardContent className="py-4 px-5">
              <p className="text-sm text-slate-800">
                <strong>Summary:</strong> {analysis.summary}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border border-emerald-200">
            <CardContent className="py-4 px-5">
              <strong className="text-emerald-700">Today’s micro step:</strong>
              <p className="text-sm mt-1">{analysis.actions.today_micro_step}</p>
            </CardContent>
          </Card>

          <Link href="/dashboard/history">
            <Button variant="outline">View full analysis</Button>
          </Link>
        </Card>
      )}

      {/* ===================================== */}
      {/* TODAY’S SCORE */}
      {/* ===================================== */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="text-indigo-600" />
            Today’s Mindset Score
          </CardTitle>
        </CardHeader>

        <CardContent className="flex justify-center">
          <div className="relative w-40 h-40">
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

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-4xl font-bold text-indigo-700">
                {mindsetScore ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===================================== */}
      {/* AI INSIGHT SUMMARY */}
      {/* ===================================== */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="text-indigo-600" />
            Key Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">
            {aiInsight || "No insight available yet."}
          </p>
        </CardContent>
      </Card>

      {/* ===================================== */}
      {/* HEATMAP */}
      {/* ===================================== */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="text-indigo-600" />
            Mood Heatmap (Last 30 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-1">
            {moodLevels.map((lvl, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-md ${heatmapColors[lvl]}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===================================== */}
      {/* RECENT ENTRIES */}
      {/* ===================================== */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Entries
            <Link
              href="/dashboard/history"
              className="text-sm text-indigo-600 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </CardTitle>
        </CardHeader>

        <CardContent className="divide-y">
          {recentEntries.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              No entries yet.
            </p>
          )}

          {recentEntries.map((e) => (
            <Link
              key={e.id}
              href={`/dashboard/history/${e.id}`}
              className="block py-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    {e.analysis?.summary ||
                      e.content.slice(0, 60) ||
                      "Reflection"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {e.content}
                  </p>
                </div>

                <p className="text-xs text-slate-400">
                  {new Date(e.created_at).toLocaleDateString("en-GB")}
                </p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* ===================================== */}
      {/* MONTHLY GLANCE */}
      {/* ===================================== */}
      <Card className="rounded-2xl border border-indigo-100 bg-indigo-50">
        <CardHeader>
          <CardTitle>Month at a Glance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-500">Most common emotion</p>
            <p className="text-lg font-semibold">
              {recentEntries[0]?.analysis?.emotions?.primary?.[0]?.emotion ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Avg mindset score</p>
            <p className="text-lg font-semibold">
              {mindsetScore ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Top cognitive pattern</p>
            <p className="text-lg font-semibold">
              {recentEntries[0]?.analysis?.cognitive_patterns?.[0]?.name ||
                "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ===================================== */}
      {/* MICRO STEP FOR TOMORROW */}
      {/* ===================================== */}
      <Card className="rounded-2xl bg-emerald-50 border border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-emerald-600" />
            Suggested Micro-Step for Tomorrow
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-slate-700">
            {analysis?.actions.today_micro_step ||
              todayEntry?.analysis?.actions?.today_micro_step ||
              "Write one sentence about how you want to feel tomorrow."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
