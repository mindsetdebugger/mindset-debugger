"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Bot,
  Sparkles,
  Sunrise,
  CalendarDays,
  Target,
  HeartHandshake,
  Trophy,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ==============================
// Types
// ==============================
type CoachingRecommendations = {
  focus_for_today: string;
  focus_for_tomorrow: string;
  optimal_strategy: string;
  motivation_driver: string;
  energy_management: string;
};

type ProgressTracking = {
  consistency_score: number;
  streak_days: number;
  recent_wins: string[];
  areas_to_improve: string[];
};

type ActionsBlock = {
  today_micro_step: string;
  tomorrow_focus: string;
  potential_pitfall: string;
  supportive_mindset: string;
};

type DeepAnalysis = {
  summary: string;
  actions: ActionsBlock;
  coaching_recommendations?: CoachingRecommendations;
  progress_tracking?: ProgressTracking;
};

type EntryRow = {
  id: string;
  user_id: string;
  created_at: string;
  content: string;
  analysis: DeepAnalysis;
};

type CoachLayers = {
  daily?: {
    anchor_sentence: string;
    reassurance: string;
    reminder: string;
  };
  weekly?: {
    weekly_theme: string;
    weekly_focus_areas: string[];
    weekly_key_actions: string[];
    weekly_pitfall: string;
    weekly_supportive_message: string;
  };
  long_term?: {
    long_term_direction: string;
    long_term_focus_areas: string[];
    skill_building_focus: string[];
    when_you_slip: string;
  };
};

type HistorySummaryRow = {
  summary_short?: string;
  coach_layers?: CoachLayers;
};

// Animation preset
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

// ==============================
// Page
// ==============================
export default function CoachPage() {
  const supabase = supabaseBrowser();

  const [latestEntry, setLatestEntry] = useState<EntryRow | null>(null);
  const [historySummary, setHistorySummary] =
    useState<HistorySummaryRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // -------------------------------------------------
  // Load data
  // -------------------------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;

      if (!user) {
        setLatestEntry(null);
        setHistorySummary(null);
        setLoading(false);
        return;
      }

      const { data: entriesData } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (entriesData?.length) setLatestEntry(entriesData[0]);

      const { data: summaryData } = await supabase
        .from("history_summaries")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (summaryData) setHistorySummary(summaryData);

      setLoading(false);
    })();
  }, [supabase]);

  // -------------------------------------------------
  // Regenerate Coach
  // -------------------------------------------------
  async function regenerate() {
    setRefreshing(true);

    const { data: session } = await supabase.auth.getUser();
    const user = session?.user;
    if (!user) return;

    const { data: lastEntry } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    await fetch("/api/compass", {
      method: "POST",
      body: JSON.stringify({ analysis: lastEntry?.analysis || {} }),
      headers: { "Content-Type": "application/json" },
    });

    const { data } = await supabase
      .from("history_summaries")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setHistorySummary(data || null);
    setRefreshing(false);
  }

  // -------------------------------------------------
  // If no data
  // -------------------------------------------------
  if (loading)
    return (
      <div className="flex justify-center py-14">
        <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
      </div>
    );

  if (!latestEntry) {
    return (
      <div className="py-12 space-y-4 px-4">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="text-indigo-600 w-7 h-7" />
          Your AI Coach
        </h1>
        <p className="text-slate-600 max-w-lg">
          Za početak ti treba barem jedan zapis. Napiši refleksiju na Dashboardu
          i Coach će generirati dnevni, tjedni i dugoročni fokus.
        </p>
        <Link href="/dashboard">
          <Button className="mt-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Create first entry
          </Button>
        </Link>
      </div>
    );
  }

  const a = latestEntry.analysis;
  const coach = historySummary?.coach_layers || {};
  const daily = coach.daily || {};
  const weekly = coach.weekly || {};
  const longTerm = coach.long_term || {};

  const rec = a.coaching_recommendations || {};
  const prog = a.progress_tracking || {};

  const created = new Date(latestEntry.created_at);
  const dateLabel = created.toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "short",
  });

  const hasLongTerm =
    !!longTerm.long_term_direction ||
    !!longTerm.long_term_focus_areas?.length ||
    !!longTerm.skill_building_focus?.length;

  // ==============================
  // RENDER
  // ==============================
  return (
    <motion.div
      className="py-10 space-y-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
    >
      {/* ============================================= */}
      {/* HERO — white, simple, JUUNO-style */}
      {/* ============================================= */}
      <motion.section
        className="rounded-3xl bg-white shadow-lg border border-slate-200 p-7 md:p-10"
        variants={fadeIn}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-8 h-8 text-indigo-600" />
              Your AI Coach
            </h1>

            <p className="text-slate-600 leading-relaxed">
              Na temelju tvog zadnjeg unosa ({dateLabel}) i svih prijašnjih
              obrazaca, Coach ti daje jasan dnevni, tjedni i dugoročni fokus —
              nježno, jasno i bez preplavljivanja.
            </p>

            {daily.anchor_sentence && (
              <div className="rounded-2xl bg-indigo-50 px-4 py-3 border border-indigo-100 text-sm shadow-sm">
                <p className="text-[11px] uppercase tracking-wide text-indigo-700 font-semibold mb-1">
                  Današnja sidrena misao
                </p>
                <p className="text-slate-800">{daily.anchor_sentence}</p>
              </div>
            )}
          </div>

          <Button
            onClick={regenerate}
            variant="outline"
            className="flex items-center gap-2"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Regenerate
          </Button>
        </div>
      </motion.section>

      {/* ============================================= */}
      {/* DAILY COACHING */}
      {/* ============================================= */}
      <motion.section
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-8"
        variants={fadeIn}
      >
        {/* LEFT */}
        <Card className="rounded-3xl shadow-md border border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sunrise className="w-5 h-5 text-amber-600" />
              Daily Coaching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-800">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 shadow-sm">
                <p className="text-[11px] uppercase text-amber-700 font-semibold mb-1">
                  Fokus danas
                </p>
                <p>{rec.focus_for_today || a.actions?.today_micro_step}</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 shadow-sm">
                <p className="text-[11px] uppercase text-sky-700 font-semibold mb-1">
                  Fokus sutra
                </p>
                <p>{rec.focus_for_tomorrow || a.actions?.tomorrow_focus}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
                <p className="text-[11px] uppercase text-emerald-700 font-semibold mb-1">
                  Optimalna strategija
                </p>
                <p>{rec.optimal_strategy}</p>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 shadow-sm">
                <p className="text-[11px] uppercase text-violet-700 font-semibold mb-1">
                  Upravljanje energijom
                </p>
                <p>{rec.energy_management}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm">
              <p className="text-[11px] uppercase text-indigo-700 font-semibold mb-1">
                Supportive mindset
              </p>
              <p>{a.actions?.supportive_mindset}</p>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT */}
        <div className="space-y-4">
          {/* WINS */}
          <Card className="rounded-3xl shadow-md border border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
                <Trophy className="w-5 h-5" />
                Your Recent Wins
              </CardTitle>
            </CardHeader>
            <CardContent className="text-emerald-900 text-sm space-y-2">
              {prog.recent_wins?.length ? (
                <ul className="list-disc list-inside space-y-1">
                  {prog.recent_wins.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : (
                <p>Nema eksplicitnih winova — ali refleksija sama po sebi je win.</p>
              )}
            </CardContent>
          </Card>

          {/* IMPROVEMENT */}
          <Card className="rounded-3xl shadow-md border border-rose-200 bg-rose-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-rose-800">
                <HeartHandshake className="w-5 h-5" />
                Gentle Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="text-rose-900 text-sm space-y-2">
              {prog.areas_to_improve?.length ? (
                <ul className="list-disc list-inside space-y-1">
                  {prog.areas_to_improve.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : (
                <p>Coach trenutno ne naglašava posebna područja rasta.</p>
              )}

              <div className="flex items-center justify-between text-[11px] text-rose-700 pt-2">
                <span>
                  Consistency score:{" "}
                  <strong>{prog.consistency_score ?? 0}/100</strong>
                </span>
                <span>
                  Streak: <strong>{prog.streak_days ?? 0} dana</strong>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* ============================================= */}
      {/* WEEKLY COACHING */}
      {/* ============================================= */}
      <motion.section variants={fadeIn}>
        <Card className="rounded-3xl bg-white shadow-xl border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                Weekly Coaching Plan
              </span>
              <span className="text-xs text-slate-400">Auto-refresh weekly</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
            {/* Left */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <p className="text-[11px] uppercase text-indigo-700 font-semibold mb-1">
                  Tema ovog tjedna
                </p>
                <p className="text-slate-800">
                  {weekly.weekly_theme ||
                    "Fokus ovog tjedna je povratak jednostavnosti i stabilnosti."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[11px] uppercase text-emerald-700 font-semibold mb-1">
                    Fokus područja
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-emerald-900">
                    {weekly.weekly_focus_areas?.length ? (
                      weekly.weekly_focus_areas.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>1 emocionalno + 1 praktično područje.</li>
                    )}
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-[11px] uppercase text-amber-700 font-semibold mb-1">
                    Ključne akcije
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-amber-900">
                    {weekly.weekly_key_actions?.length ? (
                      weekly.weekly_key_actions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>Svaki dan 1 mala akcija naprijed.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <p className="text-[11px] uppercase text-rose-700 font-semibold mb-1">
                  Tjedni pitfall
                </p>
                <p className="text-rose-900">
                  {weekly.weekly_pitfall ||
                    "Perfekcionizam i odgađanje prvog koraka."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white">
                <p className="text-[11px] uppercase text-slate-300 font-semibold mb-1">
                  Coach ti poručuje
                </p>
                <p className="text-sm leading-relaxed">
                  {weekly.weekly_supportive_message ||
                    "Ovaj tjedan fokusiraj se na stabilnost, ne savršenstvo."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* ============================================= */}
      {/* LONG-TERM COACHING */}
      {/* ============================================= */}
      {hasLongTerm && (
        <motion.section variants={fadeIn}>
          <Card className="rounded-3xl bg-gradient-to-r from-indigo-50 to-slate-50 border border-slate-200 shadow-xl">
            <CardContent className="p-7 md:p-9 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs uppercase text-indigo-600 tracking-wide font-semibold">
                  Long-term direction
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {longTerm.long_term_direction}
                </h2>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <p className="text-[11px] uppercase text-emerald-700 font-semibold mb-1">
                      Fokus područja
                    </p>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-700">
                      {longTerm.long_term_focus_areas?.length ? (
                        longTerm.long_term_focus_areas.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))
                      ) : (
                        <li>Emocionalna stabilnost</li>
                      )}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <p className="text-[11px] uppercase text-indigo-700 font-semibold mb-1">
                      Vještine koje gradiš
                    </p>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-700">
                      {longTerm.skill_building_focus?.length ? (
                        longTerm.skill_building_focus.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))
                      ) : (
                        <li>Samoregulacija</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-inner">
                  <p className="text-xs uppercase text-rose-700 font-semibold mb-1">
                    Kada dođe do “pada”
                  </p>
                  <p className="text-sm text-slate-700">
                    {longTerm.when_you_slip ||
                      "Kad god ti se čini da si “pao”, tvoj zadatak nije da se kritiziraš nego da se nježno vratiš sebi kroz 1 mikro-akciju."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm text-sm">
                  <p className="font-semibold mb-1 text-indigo-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Sažetak tvog putovanja
                  </p>
                  <p className="text-slate-700 whitespace-pre-line">
                    {historySummary?.summary_short ||
                      "Kroz tvoje zapise jasno se vidi da se vraćaš sebi, iz dana u dan."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </motion.div>
  );
}
