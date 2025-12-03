"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Brain,
  Heart,
  MessageSquareQuote,
  ChevronRight,
  ArrowLeft,
  Target,
  Lightbulb,
  ListChecks,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function HistoryDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const supabase = supabaseBrowser();

  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // LOAD ENTRY
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!error) setEntry(data);

      setLoading(false);
    };

    load();
  }, [id, supabase]);

  if (loading)
    return (
      <div className="px-6 py-10 text-slate-500">Loading entry…</div>
    );

  if (!entry)
    return (
      <div className="px-6 py-10 text-red-500">
        Entry not found or you do not have permission.
      </div>
    );

  const analysis = entry.analysis || {};
  const actions = analysis.actions || {};
  const emotions = analysis?.emotions?.primary || [];

  const date = new Date(entry.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-10 px-4 md:px-10 py-10">

      {/* BACK LINK */}
      <Link href="/dashboard/history" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to history
      </Link>

      {/* HERO */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Entry Details</h1>
        <p className="text-indigo-200 text-sm mt-1">Reflection from {date}</p>

        {/* SCORE */}
        <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-2 rounded-xl border border-white/20">
          <Brain className="w-5 h-5" />
          <span className="text-lg font-semibold">
            Mindset score: {analysis.mindset_score ?? 0}
          </span>
        </div>
      </div>

      {/* YOUR REFLECTION */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Your Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 text-sm md:text-base whitespace-pre-line">
            {entry.content}
          </p>
        </CardContent>
      </Card>

      {/* EMOTIONS */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Primary Emotions</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emotions.length === 0 && (
            <p className="text-sm text-muted-foreground">No emotions detected.</p>
          )}

          {emotions.map((e: any, i: number) => {
            const emoji =
              e.emotion === "sadness"
                ? "😞"
                : e.emotion === "anxiety"
                ? "😟"
                : e.emotion === "frustration"
                ? "😠"
                : e.emotion === "fear"
                ? "😨"
                : e.emotion === "anger"
                ? "😡"
                : "🙂";

            return (
              <div key={i} className="border rounded-xl p-4 shadow-sm">
                <p className="text-3xl">{emoji}</p>
                <p className="font-medium capitalize">{e.emotion}</p>
                <p className="text-xs text-slate-500">Intensity: {e.intensity}/10</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* SUMMARY */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 text-sm md:text-base">
            {analysis.summary || "No summary available."}
          </p>
        </CardContent>
      </Card>

      {/* COGNITIVE PATTERNS */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Cognitive Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          {analysis.cognitive_patterns?.length ? (
            <ul className="list-disc list-inside space-y-2 text-slate-700 text-sm md:text-base">
              {analysis.cognitive_patterns.map((p: any, i: number) => (
                <li key={i}>
                  <strong>{p.name}</strong> ({p.score}/10) — {p.explanation}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">No patterns detected.</p>
          )}
        </CardContent>
      </Card>

      {/* SENTENCE SCAN */}
      {analysis.sentence_scan && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Sentence Scan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.sentence_scan.map((s: any, i: number) => (
              <div
                key={i}
                className="border rounded-xl p-4 bg-slate-50 space-y-1"
              >
                <p className="font-medium text-slate-800">“{s.sentence}”</p>
                <p className="text-xs text-slate-500">
                  Type: {s.type} | Emotion: {s.emotion} | Pattern: {s.pattern}
                </p>
                <p className="text-xs text-slate-500">{s.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ROOT CAUSE */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Root Cause</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 text-sm md:text-base">
            {analysis.root_cause || "No root cause identified."}
          </p>
        </CardContent>
      </Card>

      {/* REFRAMES */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Reframes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-slate-700 text-sm md:text-base">

          <p><strong>Stoic:</strong> {analysis.reframes?.stoic}</p>
          <p><strong>CBT:</strong> {analysis.reframes?.cognitive_behavioral_therapy}</p>
          <p><strong>Logic:</strong> {analysis.reframes?.logic}</p>
          <p><strong>Self-Compassion:</strong> {analysis.reframes?.self_compassion}</p>
          <p><strong>Growth Mindset:</strong> {analysis.reframes?.growth_mindset_reframe}</p>
          <p><strong>Meta Perspective:</strong> {analysis.reframes?.meta_perspective_reframe}</p>
          <p><strong>Action Reframe:</strong> {analysis.reframes?.action_reframe}</p>
          <p><strong>Values-Based:</strong> {analysis.reframes?.values_based_reframe}</p>

        </CardContent>
      </Card>

      {/* ACTIONS */}
      <Card className="rounded-2xl shadow-md bg-indigo-50 border border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <ListChecks className="w-5 h-5" />
            Action Steps
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-sm md:text-base">

          <div>
            <p className="uppercase text-xs text-indigo-500 font-semibold">Micro step today</p>
            <p className="mt-1 text-slate-800">{actions.today_micro_step}</p>
          </div>

          <div>
            <p className="uppercase text-xs text-indigo-500 font-semibold">Tomorrow's focus</p>
            <p className="mt-1 text-slate-800">{actions.tomorrow_focus}</p>
          </div>

          <div>
            <p className="uppercase text-xs text-indigo-500 font-semibold">Potential pitfall</p>
            <p className="mt-1 text-slate-800">{actions.potential_pitfall}</p>
          </div>

          <div>
            <p className="uppercase text-xs text-indigo-500 font-semibold">Supportive mindset</p>
            <p className="mt-1 text-slate-800">{actions.supportive_mindset}</p>
          </div>

        </CardContent>
      </Card>

      {/* AI INSIGHT */}
      <Card className="rounded-2xl shadow-md bg-emerald-50 border border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Sparkles className="w-5 h-5" />
            AI Insight Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-800 text-sm md:text-base">
            {analysis.ai_insight_today}
          </p>
        </CardContent>
      </Card>

      {/* TAGS */}
      {analysis.tags?.length > 0 && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.tags.map((t: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
              >
                {t}
              </span>
            ))}
          </CardContent>
        </Card>
      )}

      {/* META */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            <strong>Confidence:</strong> {analysis.meta?.analysis_confidence}
          </p>
          <p className="text-sm text-slate-600">
            <strong>Distress level:</strong> {analysis.meta?.distress_level}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
