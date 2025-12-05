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
  ArrowRight,
  Loader2,
} from "lucide-react";

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

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function CoachPage() {
  const supabase = supabaseBrowser();

  const [latestEntry, setLatestEntry] = useState<EntryRow | null>(null);
  const [historySummary, setHistorySummary] = useState<HistorySummaryRow | null>(null);
  const [loading, setLoading] = useState(true);

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

      // last entry (for daily coach)
      const { data: entriesData } = await supabase
        .from("entries")
        .select("id, user_id, created_at, content, analysis")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (entriesData && entriesData.length > 0) {
        setLatestEntry(entriesData[0] as EntryRow);
      }

      // history summary (for weekly/long-term coach)
      const { data: summaryData } = await supabase
        .from("history_summaries")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (summaryData) {
        setHistorySummary(summaryData as any);
      }

      setLoading(false);
    })();
  }, [supabase]);

  if (loading) {
    return (
      <div className="px-4 md:px-10 py-16 flex justify-center">
        <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
      </div>
    );
  }

  if (!latestEntry) {
    return (
      <div className="px-4 md:px-10 py-16 space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="text-indigo-600 w-7 h-7" />
          Your AI Coach
        </h1>
        <p className="text-slate-600 max-w-xl">
          Za početak ti treba barem jedan zapis. Napiši što ti je u glavi na
          Dashboardu, a tvoj Coach će iz toga složiti dnevni, tjedni i dugoročni fokus.
        </p>
        <Link href="/dashboard">
          <Button className="mt-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Create first entry
          </Button>
        </Link>
      </div>
    );
  }

  const a = latestEntry.analysis || ({} as DeepAnalysis);
  const coach = historySummary?.coach_layers || {};
  const dailyLayer = coach.daily || {};
  const weeklyLayer = coach.weekly || {};
  const longTermLayer = coach.long_term || {};

  const rec = a.coaching_recommendations || ({} as CoachingRecommendations);
  const prog = a.progress_tracking || ({} as ProgressTracking);

  const created = new Date(latestEntry.created_at);
  const dateLabel = created.toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "short",
  });

  const hasLongTerm =
    !!longTermLayer.long_term_direction ||
    (Array.isArray(longTermLayer.long_term_focus_areas) &&
      longTermLayer.long_term_focus_areas.length > 0);

  return (
    <motion.div
      className="px-4 md:px-10 py-10 space-y-10 relative"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
    >
      {/* Glow pozadina */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-40 -left-32 w-[420px] h-[420px] bg-indigo-500/25 blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[360px] h-[360px] bg-purple-500/20 blur-[140px]" />
      </div>

      {/* HERO */}
      <motion.section variants={fadeIn}>
        <Card className="rounded-3xl border-none bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white shadow-2xl overflow-hidden">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative">
            {/* animirani “coach bubble” */}
            <motion.div
              className="absolute right-6 top-6 bg-white/10 rounded-2xl px-4 py-2 text-xs flex items-center gap-2 border border-white/20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>Personalized just for you</span>
            </motion.div>

            <div className="space-y-4 max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <Bot className="w-8 h-8 text-emerald-300" />
                Your AI Coach for Today
              </h1>
              <p className="text-indigo-100 text-sm md:text-base">
                Na temelju tvog zadnjeg unosa ({dateLabel}) i svih prijašnjih
                obrazaca, Coach ti daje jasan dnevni, tjedni i dugoročni fokus –
                bez preplavljivanja analizama.
              </p>

              {dailyLayer.anchor_sentence && (
                <div className="mt-3 rounded-2xl bg-black/20 border border-white/15 px-4 py-3 text-sm">
                  <p className="text-[11px] uppercase tracking-wide text-indigo-200 mb-1">
                    Današnja sidrena misao
                  </p>
                  <p className="text-indigo-50">{dailyLayer.anchor_sentence}</p>
                </div>
              )}
            </div>

            <motion.div
              className="md:w-72"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="rounded-3xl bg-white/10 border border-white/20 p-5 shadow-xl">
                <p className="text-xs uppercase tracking-wide text-indigo-100 mb-2 flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-amber-300" />
                  Tvoj fokus danas
                </p>
                <p className="text-sm leading-relaxed">
                  {rec.focus_for_today ||
                    a.actions?.today_micro_step ||
                    "Napravi kratki zapis na Dashboardu – Coach će iz njega izvući prioritet za danas."}
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.section>

      {/* GRID: DAILY + WEEKLY + WINS */}
      <motion.section
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] gap-8 items-start"
        variants={fadeIn}
      >
        {/* LEFT: DAILY COACHING */}
        <Card className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-md shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sunrise className="w-5 h-5 text-amber-500" />
              Daily Coaching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base text-slate-800">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Fokus danas */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase text-amber-700 mb-1">
                  Glavni fokus danas
                </p>
                <p>
                  {rec.focus_for_today ||
                    a.actions?.today_micro_step ||
                    "Postavi si 1 mikro zadatak koji možeš završiti u 2 minute."}
                </p>
              </div>

              {/* Fokus sutra */}
              <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase text-sky-700 mb-1">
                  Gledaj prema sutra
                </p>
                <p>
                  {rec.focus_for_tomorrow ||
                    a.actions?.tomorrow_focus ||
                    "Sutra nastavi tamo gdje si danas stao – ali bez samokritike."}
                </p>
              </div>
            </div>

            {/* Strategija + energija */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase text-emerald-700 mb-1">
                  Optimalna strategija za danas
                </p>
                <p>{rec.optimal_strategy || "Radi u kratkim fokus blokovima i često provjeri kako se osjećaš."}</p>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase text-violet-700 mb-1">
                  Upravljanje energijom
                </p>
                <p>{rec.energy_management || "Radi kratke pauze i dozvoli si da ti energija bude valovita, ne ravna crta."}</p>
              </div>
            </div>

            {/* Supportive mindset */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 shadow-inner">
              <p className="text-[11px] font-semibold uppercase text-indigo-700 mb-1">
                Supportive mindset poruka
              </p>
              <p>{a.actions?.supportive_mindset || dailyLayer.reassurance || "Nisi sam/a u ovome. I male promjene kod tebe već znače jako puno."}</p>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: WINS + AREAS */}
        <div className="space-y-4">
          {/* wins */}
          <Card className="rounded-3xl border border-emerald-100 bg-emerald-50/80 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
                <Trophy className="w-5 h-5" />
                Your Recent Wins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-emerald-900">
              {prog.recent_wins && prog.recent_wins.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {prog.recent_wins.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  Coach još nema eksplicitno označene pobjede – ali sama činjenica da reflektiraš već je veliki win.
                </p>
              )}
            </CardContent>
          </Card>

          {/* areas to improve */}
          <Card className="rounded-3xl border border-rose-100 bg-rose-50/80 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-rose-800">
                <HeartHandshake className="w-5 h-5" />
                Gentle Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-rose-900">
              {prog.areas_to_improve && prog.areas_to_improve.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {prog.areas_to_improve.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  Coach za sada ne ističe konkretna područja – fokusiraj se na to da ostaneš u kontaktu sa sobom iz dana u dan.
                </p>
              )}

              <div className="flex items-center justify-between mt-2 text-[11px] text-rose-700">
                <span>
                  Consistency score:{" "}
                  <strong>{prog.consistency_score ?? 0}/100</strong>
                </span>
                <span>Streak: <strong>{prog.streak_days ?? 0} dana</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* WEEKLY COACHING */}
      <motion.section variants={fadeIn}>
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                Weekly Coaching Plan
              </span>
              <span className="text-xs text-slate-400">
                Ažurira se automatski 1× tjedno
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)] gap-6 text-sm">
            {/* lijevo – tema i fokus */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                <p className="text-[11px] uppercase text-indigo-600 font-semibold mb-1">
                  Tema ovog tjedna
                </p>
                <p className="text-slate-900">
                  {weeklyLayer.weekly_theme ||
                    "Ovaj tjedan fokus je na tome da budeš nježniji prema sebi dok rješavaš stvari."}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-[11px] uppercase text-emerald-700 font-semibold mb-1">
                    Fokus područja
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-emerald-900">
                    {(weeklyLayer.weekly_focus_areas || []).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                    {(!weeklyLayer.weekly_focus_areas ||
                      weeklyLayer.weekly_focus_areas.length === 0) && (
                      <li>Jedno područje odnosa i jedno područje energije.</li>
                    )}
                  </ul>
                </div>

                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3">
                  <p className="text-[11px] uppercase text-amber-700 font-semibold mb-1">
                    Ključne akcije
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-amber-900">
                    {(weeklyLayer.weekly_key_actions || []).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                    {(!weeklyLayer.weekly_key_actions ||
                      weeklyLayer.weekly_key_actions.length === 0) && (
                      <li>Svaki dan 1 mala akcija koja te približava onome što želiš.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* desno – pitfall + poruka */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4">
                <p className="text-[11px] uppercase text-rose-700 font-semibold mb-1">
                  Tjedni pitfall
                </p>
                <p className="text-rose-900">
                  {weeklyLayer.weekly_pitfall ||
                    "Tipična zamka ovaj tjedan bit će da podcijeniš male korake i čekaš “savršeni trenutak”."}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 text-white p-4 flex flex-col justify-between">
                <p className="text-[11px] uppercase text-slate-300 font-semibold mb-1">
                  Coach ti poručuje
                </p>
                <p className="text-sm leading-relaxed">
                  {weeklyLayer.weekly_supportive_message ||
                    "Ovaj tjedan nije test tvoje vrijednosti, nego prilika da vidiš kako se vraćaš sebi, čak i kada ti je teško."}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <Target className="w-3 h-3" />
                  <span>Drži se jednog fokusa umjesto deset paralelnih.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* LONG-TERM COACHING (ako ima dovoljno podataka) */}
      {hasLongTerm && (
        <motion.section variants={fadeIn}>
          <Card className="rounded-3xl border-none bg-gradient-to-r from-slate-900 via-indigo-900 to-emerald-900 text-white shadow-2xl overflow-hidden">
            <CardContent className="p-7 md:p-9 grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] gap-8 items-start">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-wide text-emerald-300 flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" />
                  Long-Term Direction
                </p>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Smjer koji tvoj Coach vidi za tebe
                </h2>
                <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
                  {longTermLayer.long_term_direction}
                </p>

                <div className="grid md:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[11px] uppercase text-emerald-200 font-semibold mb-1">
                      Fokus područja
                    </p>
                    <ul className="list-disc list-inside text-xs text-emerald-50 space-y-1">
                      {(longTermLayer.long_term_focus_areas || []).map(
                        (f, i) => (
                          <li key={i}>{f}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[11px] uppercase text-indigo-200 font-semibold mb-1">
                      Vještine koje gradiš
                    </p>
                    <ul className="list-disc list-inside text-xs text-indigo-50 space-y-1">
                      {(longTermLayer.skill_building_focus || []).map(
                        (f, i) => (
                          <li key={i}>{f}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
                  <p className="text-[11px] uppercase text-rose-200 font-semibold mb-1">
                    Kada “padneš” s puta
                  </p>
                  <p className="text-sm text-rose-50 leading-relaxed">
                    {longTermLayer.when_you_slip ||
                      "Kad god ti se čini da si pao/la s puta, tvoj zadatak nije da se kazniš, nego da se što nježnije vratiš sebi s jednim malim korakom."}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-xs text-indigo-50">
                  <p className="mb-1 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Sažetak tvog dosadašnjeg putovanja
                  </p>
                  <p className="leading-relaxed">
                    {historySummary?.summary_short ||
                      "Kroz tvoje zapise vidi se da ti je stalo, da promatraš sebe i da već sada radiš više nego što možda priznaješ sebi."}
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
