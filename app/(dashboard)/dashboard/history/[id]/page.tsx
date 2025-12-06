"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Activity,
  CalendarDays,
} from "lucide-react";

import { useEntriesStore } from "@/lib/store/useEntriesStore";
import AnalysisLayout, { scoreColor } from "../../components/AnalysisLayout";

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

  // load all entries
  useEffect(() => {
    if (!loaded && !loading) fetchAll();
  }, [loaded, loading, fetchAll]);

  // find current index
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

  const a = entry.analysis;
  const created = new Date(entry.created_at);

  const dateLabel = created.toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeLabel = created.toLocaleTimeString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  });

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

  return (
    <div className="px-4 md:px-10 py-10 space-y-8">

      {/* TOP BAR */}
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
            Entry details
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

      {/* SHARED ANALYSIS LAYOUT */}
      <AnalysisLayout entry={entry} />
    </div>
  );
}
