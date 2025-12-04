"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Feather, Layers } from "lucide-react";

// =====================================
// Emotion UI mapping
// =====================================
const emotionStyles: Record<
  string,
  { emoji: string; bg: string; text: string; ring: string }
> = {
  joy: { emoji: "😊", bg: "bg-amber-50", text: "text-amber-800", ring: "ring-amber-200" },
  happiness: { emoji: "😄", bg: "bg-amber-50", text: "text-amber-800", ring: "ring-amber-200" },
  calm: { emoji: "😌", bg: "bg-sky-50", text: "text-sky-800", ring: "ring-sky-200" },
  anxiety: { emoji: "😰", bg: "bg-indigo-50", text: "text-indigo-900", ring: "ring-indigo-200" },
  stress: { emoji: "😵‍💫", bg: "bg-rose-50", text: "text-rose-800", ring: "ring-rose-200" },
  sadness: { emoji: "😢", bg: "bg-blue-50", text: "text-blue-800", ring: "ring-blue-200" },
  hope: { emoji: "🌱", bg: "bg-emerald-50", text: "text-emerald-800", ring: "ring-emerald-200" },
  frustration: { emoji: "😤", bg: "bg-red-50", text: "text-red-800", ring: "ring-red-200" },
  fear: { emoji: "😨", bg: "bg-indigo-50", text: "text-indigo-800", ring: "ring-indigo-200" },
};

function styleForEmotion(name: string) {
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

// =====================================
// PAGE COMPONENT
// =====================================
export default function InsightsPage() {
  const supabase = supabaseBrowser();

  const [summary, setSummary] = useState<any>(null);
  const [latestEntry, setLatestEntry] = useState<any>(null);

  // Load data
  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) return;

      const { data: summaryData } = await supabase
        .from("history_summaries")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setSummary(summaryData);

      const { data: entryData } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (entryData?.length) setLatestEntry(entryData[0]);
    })();
  }, []);

  if (!summary)
    return <div className="p-10 text-center text-slate-500">Loading insights…</div>;

  const insights = summary.insights_page || {};
  const aggregates = summary.aggregates || {};

  const top3 = latestEntry?.analysis?.emotions?.primary?.slice(0, 3) || [];

  return (
    <div className="px-4 md:px-10 py-12 space-y-14">

      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
          ✨ Deep Personal Insights
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Sveobuhvatni prikaz tvojih emocionalnih obrazaca, potreba, uvjerenja i smjerova rasta — bazirano na svim tvojim dosadašnjim unosima i automatski ažurirano.
        </p>
      </header>

      {/* ---------------------------------------------------------- */}
      {/* GRID LAYOUT */}
      {/* ---------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ---------------- TOP EMOTIONS ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-slate-200 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              💗 Top Emotions (Last Entry)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {top3.map((e: any, idx: number) => {
              const s = styleForEmotion(e.emotion);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl ${s.bg} ${s.text} ring-1 ${s.ring} shadow-sm flex gap-3`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <p className="font-semibold capitalize">{e.emotion}</p>
                    <p className="text-xs opacity-70">Intensity: {e.intensity}/100</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ---------------- DOMINANT COGNITIVE PATTERN ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-indigo-200 bg-indigo-50 col-span-1">
          <CardHeader>
            <CardTitle className="text-indigo-900 flex items-center gap-2 text-lg">
              🧠 Dominant Cognitive Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-2xl border border-indigo-200 shadow-sm text-indigo-900">
              {aggregates?.top_cognitive_patterns?.[0] || "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* ---------------- LIMITING BELIEFS ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-rose-200 bg-rose-50 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-rose-700">⚠️ Limiting Beliefs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(insights.recurring_limiting_beliefs || []).map((b: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-rose-200 text-rose-800 shadow-sm"
              >
                {b}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ---------------- CORE NEEDS ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-emerald-200 bg-emerald-50 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700 flex items-center gap-2">
              <Heart className="w-5" /> Core Needs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(insights.core_needs || []).map((n: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-emerald-200 text-emerald-900 shadow-sm"
              >
                {n}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ---------------- DEEP FEARS ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-indigo-200 bg-indigo-50 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-indigo-800 flex items-center gap-2">
              <Feather className="w-5" /> Deep Fears
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(insights.deep_fears || []).map((f: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-indigo-200 text-indigo-900 shadow-sm"
              >
                {f}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ---------------- STRENGTHS OVER TIME ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-amber-200 bg-amber-50 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-amber-700">✨ Strengths Over Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(insights.strengths_visible_over_time || []).map((s: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-amber-200 text-amber-900 shadow-sm"
              >
                {s}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ---------------- GROWTH EDGES ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-purple-200 bg-purple-50 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
              <Layers className="w-5" /> Growth Edges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(insights.growth_edges || []).map((g: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-purple-200 text-purple-900 shadow-sm"
              >
                {g}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ---------------- PERSONAL STYLE (IMPROVED) ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-slate-200 bg-white col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="text-indigo-600 w-5" />
              Your Personal Style
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6">

            {/* LEFT SIDE */}
            <div className="space-y-6">

              {/* Thinking */}
              <div className="p-5 rounded-2xl border bg-white shadow-sm">
                <p className="text-slate-800 font-semibold mb-1">Thinking Style</p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {insights.thinking_style || "N/A"}
                </p>
              </div>

              {/* Emotional */}
              <div className="p-5 rounded-2xl border bg-white shadow-sm">
                <p className="text-slate-800 font-semibold mb-1">Emotional Style</p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {insights.emotional_style || "N/A"}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-5 rounded-2xl border bg-white shadow-sm">
              <p className="text-slate-800 font-semibold mb-1">Behavior Style</p>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {insights.behavior_style || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
