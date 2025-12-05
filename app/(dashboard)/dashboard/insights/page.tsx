"use client";

import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Sparkles,
  Heart,
  Feather,
  Layers,
} from "lucide-react";

import { SaveToNotesButton } from "@/components/SaveToNotesButton";
import { useAppStore } from "@/lib/store/useAppStore";


// =====================================
// Emotion UI mapping
// =====================================
const emotionStyles: Record<
  string,
  { emoji: string; bg: string; text: string; ring: string }
> = {
  joy: { emoji: "😊", bg: "bg-amber-50", text: "text-amber-800", ring: "ring-amber-200" },
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
  const {
    historySummary,
    latestEntry,
    loadHistorySummary,
    loadLatestEntry,
    loading,
  } = useAppStore();

  // Load data on mount
  useEffect(() => {
    loadHistorySummary();
    loadLatestEntry();
  }, [loadHistorySummary, loadLatestEntry]);

  // Show loader until we have data
  if (loading || !historySummary) {
    return (
      <div className="py-20 text-center text-slate-500">
        Loading insights…
      </div>
    );
  }

  const summary = historySummary;
  const insights = summary.insights_page || {};
  const aggregates = summary.aggregates || {};
  const top3 =
    latestEntry?.analysis?.emotions?.primary?.slice(0, 3) || [];


  return (
    <div className="py-12 space-y-14">

      {/* HEADER */}
      <header className="space-y-3 max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          ✨ Deep Personal Insights
        </h1>
        <p className="text-slate-600 leading-relaxed">
          Tvoj personalizirani emocionalni i kognitivni profil — generiran kroz
          stotine signala iz svih tvojih unosa. Minimalno, jasno, profesionalno.
        </p>
      </header>


      {/* ---------------------------------------------------------- */}
      {/* GRID LAYOUT */}
      {/* ---------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">


        {/* ---------------- TOP EMOTIONS ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-slate-200 bg-white/90 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              💗 Top Emotions
            </CardTitle>

            <SaveToNotesButton
              title="Top Emotions"
              content={top3.map((e) => `${e.emotion} (${e.intensity})`)}
              tags={["emotions", "top3"]}
            />
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
                    <p className="font-medium capitalize">{e.emotion}</p>
                    <p className="text-xs opacity-70">Intensity: {e.intensity}/100</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>




        {/* ---------------- COGNITIVE PATTERN ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-indigo-200 bg-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-indigo-900">
              🧠 Dominant Cognitive Pattern
            </CardTitle>

            <SaveToNotesButton
              title="Dominant Cognitive Pattern"
              content={aggregates?.top_cognitive_patterns?.[0] || "N/A"}
              tags={["pattern", "cognition"]}
            />
          </CardHeader>

          <CardContent>
            <div className="p-4 rounded-2xl bg-white shadow-sm border border-indigo-200 text-indigo-900">
              {aggregates?.top_cognitive_patterns?.[0] || "N/A"}
            </div>
          </CardContent>
        </Card>




        {/* ---------------- LIMITING BELIEFS ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-rose-200 bg-rose-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-rose-700">
              ⚠️ Limiting Beliefs
            </CardTitle>

            <SaveToNotesButton
              title="Limiting Beliefs"
              content={insights.recurring_limiting_beliefs || []}
              tags={["beliefs", "limitations"]}
            />
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
        <Card className="rounded-3xl shadow-xl border border-emerald-200 bg-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
              <Heart className="w-5" /> Core Needs
            </CardTitle>

            <SaveToNotesButton
              title="Core Needs"
              content={insights.core_needs || []}
              tags={["needs", "core"]}
            />
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
        <Card className="rounded-3xl shadow-xl border border-indigo-200 bg-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
              <Feather className="w-5" /> Deep Fears
            </CardTitle>

            <SaveToNotesButton
              title="Deep Fears"
              content={insights.deep_fears || []}
              tags={["fears", "deep"]}
            />
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
        <Card className="rounded-3xl shadow-xl border border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-amber-700">
              ✨ Strengths Over Time
            </CardTitle>

            <SaveToNotesButton
              title="Strengths Over Time"
              content={insights.strengths_visible_over_time || []}
              tags={["strengths"]}
            />
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
        <Card className="rounded-3xl shadow-xl border border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
              <Layers className="w-5" /> Growth Edges
            </CardTitle>

            <SaveToNotesButton
              title="Growth Edges"
              content={insights.growth_edges || []}
              tags={["growth", "edges"]}
            />
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




        {/* ---------------- PERSONAL STYLE ---------------- */}
        <Card className="rounded-3xl shadow-xl border border-slate-200 bg-white md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600 w-5" />
              Your Personal Style
            </CardTitle>

            <SaveToNotesButton
              title="Personal Style"
              content={[
                `Thinking: ${insights.thinking_style || "N/A"}`,
                `Emotional: ${insights.emotional_style || "N/A"}`,
                `Behavior: ${insights.behavior_style || "N/A"}`,
              ]}
              tags={["style", "personal"]}
            />
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border bg-white shadow-sm">
                <p className="text-slate-800 font-semibold mb-1">Thinking Style</p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {insights.thinking_style || "N/A"}
                </p>
              </div>

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
