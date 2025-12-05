"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";


import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  ArrowRight,
  Download,
  Activity,
  CalendarDays,
  Tag,
  Brain,
  HeartPulse,
  Sparkles,
  Quote,
  Target,
  ListTree,
} from "lucide-react";
import { useEntriesStore } from "@/lib/store/useEntriesStore";

function styleForEmotion(name: string) {
  const emotionStyles: Record<
    string,
    { emoji: string; bg: string; text: string; ring: string }
  > = {
    joy: {
      emoji: "😊",
      bg: "bg-amber-50",
      text: "text-amber-800",
      ring: "ring-amber-200",
    },
    calm: {
      emoji: "😌",
      bg: "bg-sky-50",
      text: "text-sky-800",
      ring: "ring-sky-200",
    },
    anxiety: {
      emoji: "😰",
      bg: "bg-indigo-50",
      text: "text-indigo-900",
      ring: "ring-indigo-200",
    },
    sadness: {
      emoji: "😢",
      bg: "bg-blue-50",
      text: "text-blue-800",
      ring: "ring-blue-200",
    },
    stress: {
      emoji: "😵‍💫",
      bg: "bg-rose-50",
      text: "text-rose-800",
      ring: "ring-rose-200",
    },
  };

  const key = name?.toLowerCase();
  return (
    emotionStyles[key] || {
      emoji: "🧠",
      bg: "bg-slate-50",
      text: "text-slate-800",
      ring: "ring-slate-200",
    }
  );
}

function scoreColor(score: number | null | undefined) {
  if (score == null) return "text-slate-500";
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-500";
  return "text-rose-500";
}

export default function HistoryDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const {
    entries,
    loaded,
    loading,
    fetchAll,
    getEntryById,
  } = useEntriesStore();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // ===========================
  // LOAD ALL ENTRIES ONCE
  // ===========================
  useEffect(() => {
    if (!loaded && !loading) fetchAll();
  }, [loaded, loading, fetchAll]);

  // ===========================
  // FIND CURRENT INDEX
  // ===========================
  useEffect(() => {
    if (!loaded || entries.length === 0) return;

    const idx = entries.findIndex((e) => e.id === id);
    setCurrentIndex(idx >= 0 ? idx : null);
  }, [id, entries, loaded]);

  if (loading || !loaded) {
    return (
      <div className="px-4 md:px-10 py-10 text-slate-500">
        Loading entry…
      </div>
    );
  }

  const entry = getEntryById(id);

  if (!entry) {
    return (
      <div className="px-4 md:px-10 py-10">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center text-sm text-indigo-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to history
        </Link>
        <p className="text-red-500 text-sm">Entry not found.</p>
      </div>
    );
  }

  // ------------------------
  // ENTRY DATA
  // ------------------------
  const a = entry.analysis || {};
  const tags: string[] = a.tags || [];

  const primaryEmotions: any[] = a.emotions?.primary || [];
  const secondaryEmotions: any[] = a.emotions?.secondary || [];
  const bodySensations: string[] = a.emotions?.body_sensations || [];

  const created = new Date(entry.created_at);
  const dateLabel = created.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeLabel = created.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ------------------------
  // NEXT / PREVIOUS
  // ------------------------
  const prevId =
    currentIndex != null && currentIndex < entries.length - 1
      ? entries[currentIndex + 1]?.id
      : null;

  const nextId =
    currentIndex != null && currentIndex > 0
      ? entries[currentIndex - 1]?.id
      : null;

  function goPrev() {
    if (prevId) router.push(`/dashboard/history/${prevId}`);
  }

  function goNext() {
    if (nextId) router.push(`/dashboard/history/${nextId}`);
  }

  function handleExport() {
    if (typeof window !== "undefined") window.print();
  }

  // ------------------------
  // RENDER
  // ------------------------
  return (
    <div className="px-4 md:px-10 py-10 space-y-8 print:px-6 print:py-6">
      {/* Top bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard/history"
            className="inline-flex items-center text-sm text-indigo-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to history
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            Entry Details
            <span className="inline-flex items-center gap-1 text-xs rounded-full bg-slate-900 text-white px-2 py-1">
              <CalendarDays className="w-3 h-3" />
              {dateLabel}
            </span>
          </h1>

          <p className="text-slate-500 text-sm mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-400" />
              <span
                className={`font-semibold ${scoreColor(a.mindset_score)}`}
              >
                Mindset score: {a.mindset_score ?? "—"}
              </span>
            </span>

            <span>·</span>

            <span className="flex items-center gap-1 text-xs text-slate-500">
              <CalendarDays className="w-3 h-3" />
              {timeLabel}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" /> Print / PDF
          </Button>

          <Button variant="outline" size="sm" onClick={goPrev} disabled={!prevId}>
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <Button variant="outline" size="sm" onClick={goNext} disabled={!nextId}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2">
        {a.meta?.category && (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-slate-900 text-white">
            {a.meta.category}
          </span>
        )}

        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200"
          >
            <Tag className="w-3 h-3" /> {t}
          </span>
        ))}
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1.4fr] gap-8">
        {/* LEFT: TEXT + INSIGHTS + ACTIONS */}
        <div className="space-y-6">
          {/* Original content */}
          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Quote className="w-5 h-5 text-indigo-600" />
                Your Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm md:text-base text-slate-800 leading-relaxed">
                {entry.content}
              </p>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="rounded-3xl border-slate-200 bg-indigo-50/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                AI Insight Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm md:text-base text-indigo-900">
                {a.ai_insight_today || "No insight available."}
              </p>

              <div className="rounded-2xl bg-white/80 border border-indigo-100 p-4">
                <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">
                  Summary
                </p>
                <p className="text-sm text-slate-800">{a.summary || "—"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action steps */}
          <Card className="rounded-3xl border-slate-200 bg-emerald-50/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-emerald-600" />
                Action Steps
              </CardTitle>
            </CardHeader>

            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                ["Today micro step", a.actions?.today_micro_step],
                ["Tomorrow focus", a.actions?.tomorrow_focus],
                ["Potential pitfall", a.actions?.potential_pitfall],
                ["Supportive mindset", a.actions?.supportive_mindset],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/80 border border-emerald-100 p-3"
                >
                  <p className="text-[11px] font-semibold uppercase text-emerald-600">
                    {label}
                  </p>
                  <p className="mt-1 text-slate-800">{value || "—"}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Root cause + micro thoughts */}
          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListTree className="w-5 h-5 text-slate-700" />
                Root Cause & Micro Thoughts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
                  Root cause
                </p>
                <p className="text-slate-800">{a.root_cause || "—"}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <MicroBlock
                  label="Core thought"
                  value={a.micro_thoughts?.core_thought}
                />
                <MicroList
                  label="Supporting thoughts"
                  list={a.micro_thoughts?.supporting_thoughts}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <MicroList
                  label="Hidden assumptions"
                  list={a.micro_thoughts?.hidden_assumptions}
                />
                <MicroList
                  label="Emotional statements"
                  list={a.micro_thoughts?.emotional_statements}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: EMOTIONS, STATS, PATTERNS, REFRAMES, SCAN */}
        <div className="space-y-6">
          {/* Emotions */}
          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                Emotions & Body
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <EmotionSection
                title="Primary emotions"
                emotions={primaryEmotions}
              />
              <SecondaryEmotionSection emotions={secondaryEmotions} />
              <BodySection body={bodySensations} />
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-indigo-600" />
                Mindset Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["Mindset score", a.mindset_score],
                ["Clarity", a.stats?.clarity_score],
                ["Stress", a.stats?.stress_marker],
                ["Motivation", a.stats?.motivation_score],
                ["Resilience", a.stats?.resilience_marker],
                ["Emotional stability", a.stats?.emotional_stability_score],
              ].map(([label, value], i) => (
                <StatPill key={i} label={label} value={value as number} />
              ))}
            </CardContent>
          </Card>

          {/* Cognitive patterns */}
          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-slate-700" />
                Cognitive Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {(a.cognitive_patterns || []).map((p: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-50 border border-slate-200 p-3"
                >
                  <p className="font-semibold text-slate-800 text-sm">
                    {p.name}{" "}
                    <span className="text-[11px] text-slate-500">
                      ({p.score}/100)
                    </span>
                  </p>
                  <p className="mt-1 text-slate-700">{p.explanation}</p>
                </div>
              ))}
              {(!a.cognitive_patterns ||
                a.cognitive_patterns.length === 0) && (
                <p className="text-xs text-slate-500">No patterns detected.</p>
              )}
            </CardContent>
          </Card>

          {/* Reframes */}
          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Reframes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <ReframeBlock label="Stoic" text={a.reframes?.stoic} />
              <ReframeBlock
                label="CBT"
                text={a.reframes?.cognitive_behavioral_therapy}
              />
              <ReframeBlock label="Logic" text={a.reframes?.logic} />
              <ReframeBlock
                label="Self-compassion"
                text={a.reframes?.self_compassion}
              />
              <ReframeBlock
                label="Growth mindset"
                text={a.reframes?.growth_mindset_reframe}
              />
              <ReframeBlock
                label="Meta perspective"
                text={a.reframes?.meta_perspective_reframe}
              />
              <ReframeBlock
                label="Action reframe"
                text={a.reframes?.action_reframe}
              />
              <ReframeBlock
                label="Values-based"
                text={a.reframes?.values_based_reframe}
              />
            </CardContent>
          </Card>

          {/* Sentence scan */}
          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListTree className="w-5 h-5 text-slate-700" />
                Sentence Scan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {(a.sentence_scan || []).map((s: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-50 border border-slate-200 p-3"
                >
                  <p className="text-slate-800 text-sm">“{s.sentence}”</p>
                  <p className="mt-1 text-[11px] text-slate-500 flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white">
                      {s.type}
                    </span>
                    {s.emotion && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        emotion: {s.emotion}
                      </span>
                    )}
                    {s.pattern && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        pattern: {s.pattern}
                      </span>
                    )}
                  </p>
                  {s.notes && (
                    <p className="mt-1 text-slate-600">{s.notes}</p>
                  )}
                </div>
              ))}

              {(!a.sentence_scan || a.sentence_scan.length === 0) && (
                <p className="text-xs text-slate-500">
                  No sentence scan available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* -------------------- small sub components -------------------- */

function StatPill({ label, value }: { label: string; value: number }) {
  if (value == null || Number.isNaN(value)) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 flex flex-col">
        <span className="text-[11px] text-slate-500 uppercase mb-1">
          {label}
        </span>
        <span className="text-sm text-slate-400">—</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 flex flex-col">
      <span className="text-[11px] text-slate-500 uppercase mb-1">
        {label}
      </span>
      <span className={`text-sm font-semibold ${scoreColor(value)}`}>
        {value}
      </span>
    </div>
  );
}

function ReframeBlock({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="rounded-2xl bg-white border border-amber-100 p-3">
      <p className="text-[11px] font-semibold uppercase text-amber-600 mb-1">
        {label}
      </p>
      <p className="text-slate-800">{text}</p>
    </div>
  );
}

function MicroBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
      <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-slate-800">{value || "—"}</p>
    </div>
  );
}

function MicroList({ label, list }: { label: string; list?: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 space-y-1">
      <p className="text-[11px] font-semibold uppercase text-slate-500">
        {label}
      </p>
      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
        {(list || []).map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      {(!list || list.length === 0) && (
        <p className="text-xs text-slate-500">No data.</p>
      )}
    </div>
  );
}

function EmotionSection({
  title,
  emotions,
}: {
  title: string;
  emotions: any[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase text-slate-500 mb-2">
        {title}
      </p>

      <div className="flex flex-wrap gap-3">
        {emotions.length === 0 && (
          <p className="text-xs text-slate-500">No data.</p>
        )}

        {emotions.map((em, i) => {
          const s = styleForEmotion(em.emotion);
          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl ring-1 shadow-sm ${s.bg} ${s.text} ${s.ring}`}
            >
              <span className="text-xl">{s.emoji}</span>
              <div>
                <p className="font-semibold capitalize text-xs">
                  {em.emotion}
                </p>
                <p className="text-[11px] opacity-80">
                  Intensity: {em.intensity}/100
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecondaryEmotionSection({ emotions }: { emotions: any[] }) {
  if (emotions.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
        Secondary emotions
      </p>
      <div className="flex flex-wrap gap-2">
        {emotions.map((em, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 capitalize"
          >
            {em.emotion} ({em.intensity}/100)
          </span>
        ))}
      </div>
    </div>
  );
}

function BodySection({ body }: { body: string[] }) {
  if (body.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
        Body sensations
      </p>
      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
        {body.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
