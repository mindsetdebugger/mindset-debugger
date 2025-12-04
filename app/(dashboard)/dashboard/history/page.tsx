"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  CalendarDays,
  Activity,
  Filter,
  RefreshCw,
  Clock,
  Tag,
  Sparkles,
  SmilePlus,
} from "lucide-react";

type EntryRow = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  analysis: any | null;
};

export default function HistoryPage() {
  const supabase = supabaseBrowser();

  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [emotionFilter, setEmotionFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [scoreMin, setScoreMin] = useState<number>(0);
  const [scoreMax, setScoreMax] = useState<number>(100);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // ===========================
  // LOAD ENTRIES
  // ===========================
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setEntries(data as EntryRow[]);
      }

      setLoading(false);
    })();
  }, [supabase]);

  // ===========================
  // DERIVED DATA
  // ===========================
  const uniqueEmotions = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      const primary = e.analysis?.emotions?.primary || [];
      primary.forEach((em: any) => {
        if (em?.emotion) set.add(em.emotion);
      });
    });
    return Array.from(set);
  }, [entries]);

  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      const tags: string[] = e.analysis?.tags || [];
      tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const a = e.analysis || {};
      const score = typeof a.mindset_score === "number" ? a.mindset_score : 0;

      // score range
      if (score < scoreMin || score > scoreMax) return false;

      // emotion filter
      if (emotionFilter !== "all") {
        const primaries: any[] = a.emotions?.primary || [];
        const hasEmotion = primaries.some(
          (em) =>
            typeof em.emotion === "string" &&
            em.emotion.toLowerCase() === emotionFilter.toLowerCase()
        );
        if (!hasEmotion) return false;
      }

      // tag filter
      if (tagFilter !== "all") {
        const tags: string[] = a.tags || [];
        if (!tags.includes(tagFilter)) return false;
      }

      // date range
      const created = new Date(e.created_at);
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (created < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        // include entire end day
        to.setHours(23, 59, 59, 999);
        if (created > to) return false;
      }

      return true;
    });
  }, [entries, scoreMin, scoreMax, emotionFilter, tagFilter, dateFrom, dateTo]);

  // small stats
  const stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        avgScore: null as number | null,
        entryCount: 0,
        dominantEmotion: null as string | null,
      };
    }

    const scores: number[] = [];
    const emotionCount: Record<string, number> = {};

    entries.forEach((e) => {
      const a = e.analysis || {};
      if (typeof a.mindset_score === "number") {
        scores.push(a.mindset_score);
      }
      const primaries: any[] = a.emotions?.primary || [];
      primaries.forEach((em) => {
        if (!em?.emotion) return;
        const key = String(em.emotion).toLowerCase();
        emotionCount[key] = (emotionCount[key] || 0) + 1;
      });
    });

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((sum, v) => sum + v, 0) / scores.length)
        : null;

    let dominantEmotion: string | null = null;
    let maxCount = 0;
    Object.entries(emotionCount).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion;
      }
    });

    return { avgScore, entryCount: entries.length, dominantEmotion };
  }, [entries]);

  function resetFilters() {
    setEmotionFilter("all");
    setTagFilter("all");
    setScoreMin(0);
    setScoreMax(100);
    setDateFrom("");
    setDateTo("");
  }

  function scoreColor(score: number | null | undefined) {
    if (score == null) return "text-slate-500";
    if (score >= 70) return "text-emerald-600";
    if (score >= 40) return "text-amber-500";
    return "text-rose-500";
  }

  // ===========================
  // RENDER
  // ===========================
  if (loading) {
    return (
      <div className="px-4 md:px-10 py-10 text-slate-500">
        Loading history…
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="px-4 md:px-10 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-slate-500">
          Još nemaš niti jedan unos. Započni s novim zapisom na{" "}
          <Link href="/dashboard" className="text-indigo-600 underline">
            Dashboardu
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-10 space-y-10">
      {/* HEADER + SMALL STATS */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            📚 Reflection History
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Pregled svih tvojih zapisa kroz vrijeme — s filtrima po emocijama,
            tagovima i mindset score-u.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 min-w-[260px] lg:max-w-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Entries
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {stats.entryCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Avg. Mindset
            </p>
            <p
              className={`text-lg font-semibold ${scoreColor(
                stats.avgScore
              )}`}
            >
              {stats.avgScore ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Dominant Emotion
            </p>
            <p className="text-sm font-semibold text-slate-800 capitalize line-clamp-1">
              {stats.dominantEmotion || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN GRID: FILTERS + TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8">
        {/* FILTERS PANEL */}
        <Card className="rounded-3xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-indigo-600" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            {/* Emotion chips */}
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase mb-2">
                Primary emotion
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setEmotionFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    emotionFilter === "all"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  All
                </button>
                {uniqueEmotions.map((em) => (
                  <button
                    key={em}
                    onClick={() => setEmotionFilter(em)}
                    className={`px-3 py-1 rounded-full text-xs border capitalize ${
                      emotionFilter === em
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Tag
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTagFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    tagFilter === "all"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  All
                </button>
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tag)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      tagFilter === tag
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Score range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                  Min score
                </p>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={scoreMin}
                  onChange={(e) =>
                    setScoreMin(
                      Math.max(0, Math.min(100, Number(e.target.value) || 0))
                    )
                  }
                />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                  Max score
                </p>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={scoreMax}
                  onChange={(e) =>
                    setScoreMax(
                      Math.max(0, Math.min(100, Number(e.target.value) || 100))
                    )
                  }
                />
              </div>
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  From
                </p>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                  To
                </p>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {filteredEntries.length}
                </span>{" "}
                of {entries.length} entries
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TIMELINE */}
        <Card className="rounded-3xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-indigo-600" />
                Timeline
              </span>
              <Link
                href="/dashboard/trends"
                className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
              >
                View Trends
                <Sparkles className="w-3 h-3" />
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {filteredEntries.length === 0 && (
              <p className="text-sm text-slate-500">
                Nema unosa koji odgovaraju trenutnim filtrima.
              </p>
            )}

            {filteredEntries.length > 0 && (
              <div className="relative pl-4">
                {/* vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />

                <div className="space-y-6">
                  {filteredEntries.map((entry) => {
                    const a = entry.analysis || {};
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
                    const score = a.mindset_score ?? 0;
                    const primaryEmotion =
                      a.emotions?.primary?.[0]?.emotion || null;
                    const tags: string[] = a.tags || [];
                    const category = a.meta?.category || null;

                    return (
                      <div
                        key={entry.id}
                        className="relative pl-6 group hover:pl-7 transition-all"
                      >
                        {/* Node */}
                        <div
                          className="
                            absolute left-0 top-3 w-3 h-3 rounded-full 
                            border-2 border-white bg-indigo-500 
                            shadow-[0_0_0_4px_rgba(79,70,229,0.15)]
                            group-hover:bg-indigo-600
                          "
                        />

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm group-hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {dateLabel} · {timeLabel}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900 line-clamp-2">
                                {a.summary ||
                                  entry.content.slice(0, 120) ||
                                  "Reflection"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                              <div className="flex items-center gap-1 text-xs">
                                <Activity className="w-3 h-3 text-slate-400" />
                                <span
                                  className={`font-semibold ${scoreColor(
                                    score
                                  )}`}
                                >
                                  {score}
                                </span>
                              </div>

                              {primaryEmotion && (
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                                  <SmilePlus className="w-3 h-3" />
                                  <span className="capitalize">
                                    {primaryEmotion}
                                  </span>
                                </span>
                              )}

                              {category && (
                                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-slate-900 text-white">
                                  {category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* tags */}
                          {tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {tags.map((t) => (
                                <span
                                  key={t}
                                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200"
                                >
                                  <Tag className="w-3 h-3" />
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {entry.content}
                            </p>
                            <Link href={`/dashboard/history/${entry.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                Open
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
