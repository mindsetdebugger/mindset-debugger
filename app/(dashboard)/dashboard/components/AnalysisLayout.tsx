"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { EntryRow } from "@/lib/store/useEntriesStore";

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

export function scoreColor(score: number | null | undefined) {
  if (score == null) return "text-slate-500";
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-500";
  return "text-rose-500";
}

interface AnalysisLayoutProps {
  entry: EntryRow;
}

export default function AnalysisLayout({ entry }: AnalysisLayoutProps) {
  const a = entry.analysis;
  const primaryEmotions = a.emotions?.primary || [];
  const secondaryEmotions = a.emotions?.secondary || [];
  const bodySensations = a.emotions?.body_sensations || [];

  return (
    <div className="space-y-8">

      {/* TOP GRID: left + right */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Reflection */}
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm">
                  ✍️
                </span>
                Tvoj zapis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm md:text-base text-slate-800 leading-relaxed">
                {entry.content}
              </p>
            </CardContent>
          </Card>

          {/* AI Insight */}
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-indigo-50/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm">
                  ✨
                </span>
                AI insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p className="text-indigo-900">
                {a.ai_insight_today || "Nema zapisanog insighta."}
              </p>

              <div className="rounded-2xl bg-white/80 border border-indigo-100 p-4">
                <p className="text-[11px] font-semibold text-indigo-600 uppercase mb-1">
                  Sažetak
                </p>
                <p className="text-sm text-slate-800">
                  {a.summary || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action steps */}
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-emerald-50/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-sm">
                  🎯
                </span>
                Akcijski koraci
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                ["Današnji micro-step", a.actions?.today_micro_step],
                ["Fokus za sutra", a.actions?.tomorrow_focus],
                ["Potencijalna zamka", a.actions?.potential_pitfall],
                ["Podržavajući mindset", a.actions?.supportive_mindset],
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

          {/* Root cause & micro thoughts */}
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-sm">
                  🧩
                </span>
                Root cause & micro thoughts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
                  Root cause
                </p>
                <p className="text-slate-800">
                  {a.root_cause || "—"}
                </p>
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

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Emotions & body */}
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-sm">
                  💗
                </span>
                Emocije & tijelo
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
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm">
                  📊
                </span>
                Mindset statistika
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
          <Card className="rounded-3xl border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-sm">
                  🧠
                </span>
                Kognitivni obrasci
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {(a.cognitive_patterns || []).length > 0 ? (
                a.cognitive_patterns.map((p: any, i: number) => (
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
                ))
              ) : (
                <p className="text-xs text-slate-500">
                  Nema detektiranih obrazaca.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FULL-WIDTH BELOW GRID */}

      {/* Reframes */}
      <Card className="rounded-3xl border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm">
              🔄
            </span>
            Reframes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs md:text-sm">
          {Object.entries(a.reframes || {}).map(([key, val]) => (
            <ReframeBlock
              key={key}
              label={key.replace(/_/g, " ")}
              text={val as string}
            />
          ))}
          {(!a.reframes || Object.keys(a.reframes).length === 0) && (
            <p className="text-xs text-slate-500">Nema sačuvanih reframinga.</p>
          )}
        </CardContent>
      </Card>

      {/* Sentence scan */}
      <Card className="rounded-3xl border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-sm">
              ☑️
            </span>
            Sentence scan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs md:text-sm">
          {(a.sentence_scan || []).length > 0 ? (
            a.sentence_scan.map((s: any, i: number) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-50 border border-slate-200 p-3 md:p-4 space-y-2"
              >
                <p className="text-slate-900 text-sm md:text-base">
                  “{s.sentence}”
                </p>
                <div className="flex flex-wrap gap-2 text-[11px]">
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
                </div>
                {s.notes && (
                  <p className="text-slate-700 text-xs md:text-sm">
                    {s.notes}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">
              Nema sentence scana za ovaj unos.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- small sub components ---------- */

function StatPill({ label, value }: { label: string; value?: number }) {
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
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function ReframeBlock({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-3 md:p-4">
      <p className="text-[11px] font-semibold uppercase text-amber-600 mb-1">
        {label}
      </p>
      <p className="text-slate-800 text-sm md:text-base">{text}</p>
    </div>
  );
}

function MicroBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
      <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-slate-800 text-sm">{value || "—"}</p>
    </div>
  );
}

function MicroList({ label, list }: { label: string; list?: string[] }) {
  if (!list || list.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
        <p className="text-[11px] font-semibold uppercase text-slate-500 mb-1">
          {label}
        </p>
        <p className="text-xs text-slate-500">No data.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 space-y-1">
      <p className="text-[11px] font-semibold uppercase text-slate-500">
        {label}
      </p>
      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
        {list.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
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
        {emotions.length === 0 ? (
          <p className="text-xs text-slate-500">No data.</p>
        ) : (
          emotions.map((em, i) => {
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
          })
        )}
      </div>
    </div>
  );
}

function SecondaryEmotionSection({ emotions }: { emotions: any[] }) {
  if (!emotions || emotions.length === 0) return null;

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
  if (!body || body.length === 0) return null;

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
