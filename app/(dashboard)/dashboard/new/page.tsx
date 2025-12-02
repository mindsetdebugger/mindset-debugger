"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Star,
  FileText,
  Heart,
  Brain,
  Lightbulb,
  Quote,
  Target,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";

type DeepAnalysis = {
  summary: string;

  emotions: {
    primary: { emotion: string; intensity: number }[];
    secondary: { emotion: string; intensity: number }[];
    body_sensations: string[];
  };

  cognitive_patterns: {
    name: string;
    score: number;
    explanation: string;
  }[];

  micro_thoughts: {
    core_thought: string;
    supporting_thoughts: string[];
    hidden_assumptions: string[];
    emotional_statements: string[];
  };

  sentence_scan: {
    sentence: string;
    type: "fact" | "interpretation" | "fear_projection";
    emotion: string;
    pattern: string;
    notes: string;
  }[];

  root_cause: string;

  reframes: {
    stoic: string;
    cbt: string;
    logic: string;
    self_compassion: string;
    growth_mindset_reframe : string;
    meta_perspective_reframe : string;
    action_reframe : string;
    values_based_reframe : string;
  };

  actions: {
    today_micro_step: string;
    momentum_builder : string;
    avoid_this: string;
    this_week_focus: string;
  };

  mindset_score: number;
  ai_insight_today: string;

  tags: string[];

  meta: {
    analysis_confidence: number;
    distress_level: number;
  };
};

// --------------------------------------------------------------
// Section wrapper with icon + animation
// --------------------------------------------------------------
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="pb-6 border-b last:border-none"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
          <Icon size={18} className="text-indigo-600 dark:text-indigo-300" />
        </div>
        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      </div>

      {children}
    </motion.section>
  );
}

// --------------------------------------------------------------
// MAIN PAGE
// --------------------------------------------------------------
export default function NewEntryPage() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<DeepAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // SAVE INSIGHT
  async function saveInsight(type: string, label: string, content: string) {
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please log in.");
    await supabase.from("insights").insert({ user_id: user.id, type, label, content });
    alert("Saved ✔️");
  }

  // ANALYZE
  async function analyze() {
    try {
      setLoading(true);
      setErrorMsg("");

      if (input.trim().split(" ").length < 10) {
        setLoading(false);
        setErrorMsg("Write at least 4–5 meaningful sentences.");
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

      setAnalysis(data.analysis);

      // Save entry
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("entries").insert({
          user_id: user.id,
          content: input,
          analysis: data.analysis,
        });
      }

    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message);
    }
  }

  // --------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------
  return (
    <div className="px-5 md:px-12 py-12 max-w-4xl mx-auto space-y-12">

      {/* HEADER - dynamic */}
      {!analysis ? (
        <>
          <h1 className="text-4xl font-bold">New Entry</h1>
          <p className="text-slate-600 -mt-3">
            Write a reflection. AI will analyze your thoughts & patterns.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <span className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center">
              🧠
            </span>
            Analysis Complete
          </h1>

          <p className="text-slate-600 dark:text-slate-300 -mt-3">
            Here’s your detailed breakdown of thoughts, emotions & cognitive patterns.
          </p>
        </>
      )}

      {/* INPUT (hidden after results) */}
      {!analysis && (
        <Card className="rounded-2xl shadow-xl border">
          <CardHeader>
            <CardTitle>Your Reflection</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* SAMPLE INPUT */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border text-sm">
              <strong>Example:</strong><br />
              “Today I woke up overwhelmed and kept thinking I'm behind on everything.
              I feel pressure and fear disappointing people. Instead of starting tasks,
              I overthink and freeze.”
            </div>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write how you think, feel, react…"
              className="min-h-[220px] p-4 text-md rounded-xl"
            />

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <Button
              onClick={analyze}
              disabled={loading || !input.trim()}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                "Analyze with AI"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* LOADING */}
      {loading && (
        <Card className="p-6 rounded-2xl animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-2/5" />
        </Card>
      )}

      {/* RESULTS */}
      {analysis && !loading && (
        <Card className="rounded-2xl shadow-xl border p-8 space-y-12">

          {/* Mindset Score Card */}
          <Section title="Mindset Score" icon={Brain}>
            <div className="flex justify-between items-center">

              <div>
                <p className="text-4xl font-bold text-indigo-600">
                  {analysis.mindset_score}
                </p>
                <p className="text-xs text-slate-500 mt-1">out of 100</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  saveInsight("mindset_score", "Today's Score", String(analysis.mindset_score))
                }
              >
                <Star size={15} />
              </Button>
            </div>
          </Section>

          {/* AI INSIGHT TODAY */}
          <Section title="Your AI Insight Today" icon={Lightbulb}>
            <div className="flex justify-between">
              <p className="leading-relaxed">{analysis.ai_insight_today}</p>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  saveInsight("ai_insight_today", "AI Insight", analysis.ai_insight_today)
                }
              >
                <Star size={15} />
              </Button>
            </div>
          </Section>

          {/* SUMMARY */}
          <Section title="Summary" icon={FileText}>
            <div className="flex justify-between">
              <p>{analysis.summary}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => saveInsight("summary", "Summary", analysis.summary)}
              >
                <Star size={15} />
              </Button>
            </div>
          </Section>

          {/* EMOTIONS */}
          <Section title="Emotional Map" icon={Heart}>
            <div className="space-y-2">
              {analysis.emotions.primary.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl hover:shadow-sm transition"
                >
                  <p className="text-sm">{e.emotion} ({e.intensity}/10)</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => saveInsight("emotion", e.emotion, JSON.stringify(e))}
                  >
                    <Star size={15} />
                  </Button>
                </div>
              ))}
            </div>
          </Section>

          {/* COGNITIVE PATTERNS */}
          <Section title="Cognitive Patterns" icon={Brain}>
            {analysis.cognitive_patterns.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl hover:shadow-sm transition"
              >
                <div>
                  <p className="font-medium">{p.name} ({p.score}/10)</p>
                  <p className="text-xs text-slate-600">{p.explanation}</p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveInsight("pattern", p.name, JSON.stringify(p))}
                >
                  <Star size={15} />
                </Button>
              </div>
            ))}
          </Section>

          {/* MICRO THOUGHT */}
          <Section title="Micro Thought Breakdown" icon={Lightbulb}>
            <div className="flex justify-between">
              <p>{analysis.micro_thoughts.core_thought}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  saveInsight("core_thought", "Core Thought", analysis.micro_thoughts.core_thought)
                }
              >
                <Star size={15} />
              </Button>
            </div>
          </Section>

          {/* SENTENCE SCAN */}
          <Section title="Sentence-Level Scan" icon={Quote}>
            <div className="space-y-4">
              {analysis.sentence_scan.map((s, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-xl hover:bg-slate-50 transition shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm mb-1">"{s.sentence}"</p>
                      <p className="text-xs text-slate-600">
                        {s.type} • {s.pattern} • {s.emotion}
                      </p>
                      <p className="text-xs mt-1">{s.notes}</p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveInsight("sentence", s.sentence, JSON.stringify(s))}
                    >
                      <Star size={15} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ROOT CAUSE */}
          <Section title="Root Cause" icon={Target}>
            <div className="flex justify-between">
              <p>{analysis.root_cause}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => saveInsight("root_cause", "Root Cause", analysis.root_cause)}
              >
                <Star size={15} />
              </Button>
            </div>
          </Section>

{/* REFRAMES */}
<Section title="Reframes" icon={RotateCcw}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    {Object.entries(analysis.reframes).map(([key, value]) => {
      const descriptions: Record<string, string> = {
        stoic: "Focus on what you can control.",
        cbt: "Challenge distortions and create balanced thinking.",
        logic: "Use objective facts to reduce emotional reasoning.",
        self_compassion: "Respond with kindness instead of self-judgment.",
        growth_mindset_reframe: "Struggle = growth, not failure.",
        meta_perspective_reframe: "Zoom out and see the bigger picture.",
        action_reframe: "Shift from rumination to small practical steps.",
        values_based_reframe: "Connect your response to your core values.",
      };

      const icons: Record<string, any> = {
        stoic: Target,
        cbt: Brain,
        logic: Lightbulb,
        self_compassion: Heart,
        growth_mindset_reframe: Star,
        meta_perspective_reframe: Quote,
        action_reframe: CheckCircle,
        values_based_reframe: FileText,
      };

      const IconComponent = icons[key] || RotateCcw;

      return (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border rounded-2xl p-5 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <IconComponent size={18} className="text-indigo-600 dark:text-indigo-300" />
            </div>

            <div>
              <h4 className="font-semibold capitalize">
                {key.replace(/_/g, " ")}
              </h4>
              <p className="text-xs text-slate-500">
                {descriptions[key] || "Reframe perspective shift"}
              </p>
            </div>
          </div>

          {/* Reframe Text */}
          <p className="text-sm leading-relaxed">{value}</p>

          {/* Save */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => saveInsight("reframe", key, value)}
            className="self-end"
          >
            <Star size={16} />
          </Button>
        </motion.div>
      );
    })}

  </div>
</Section>



{/* ACTIONS */}
<Section title="Actions" icon={CheckCircle}>
  <div className="space-y-6">

    {/* TODAY MICRO-STEP */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 bg-indigo-50/60 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center">
            <CheckCircle size={18} className="text-indigo-700 dark:text-indigo-300" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            Today – Micro Step
          </h4>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            saveInsight("action_today_micro", "Micro Step", analysis.actions.today_micro_step)
          }
        >
          <Star size={16} />
        </Button>
      </div>

      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {analysis.actions.today_micro_step}
      </p>
    </motion.div>

    {/* MOMENTUM BUILDER */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl p-6 bg-blue-50/60 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
            <Lightbulb size={18} className="text-blue-700 dark:text-blue-300" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            Momentum Builder
          </h4>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            saveInsight("action_momentum", "Momentum Builder", analysis.actions.momentum_builder)
          }
        >
          <Star size={16} />
        </Button>
      </div>

      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {analysis.actions.momentum_builder}
      </p>
    </motion.div>

    {/* AVOID THIS */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl p-6 bg-red-50/60 dark:bg-red-900/30 border border-red-100 dark:border-red-800 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center">
            <XCircle size={18} className="text-red-700 dark:text-red-300" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            Avoid This
          </h4>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            saveInsight("action_avoid", "Avoid This", analysis.actions.avoid_this)
          }
        >
          <Star size={16} />
        </Button>
      </div>

      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {analysis.actions.avoid_this}
      </p>
    </motion.div>

    {/* WEEKLY FOCUS */}
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl p-6 bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-200 dark:bg-amber-700/50 flex items-center justify-center">
            <Target size={18} className="text-amber-700 dark:text-amber-200" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            This Week – Focus
          </h4>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            saveInsight("action_week", "Weekly Focus", analysis.actions.this_week_focus)
          }
        >
          <Star size={16} />
        </Button>
      </div>

      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {analysis.actions.this_week_focus}
      </p>
    </motion.div>

  </div>
</Section>



        </Card>
      )}
    </div>
  );
}
