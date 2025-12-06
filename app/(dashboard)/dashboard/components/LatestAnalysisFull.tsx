"use client";

import { CalendarDays, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import type { EntryRow } from "@/lib/store/useEntriesStore";
import AnalysisLayout, { scoreColor } from "./AnalysisLayout";

interface LatestAnalysisFullProps {
  entry: EntryRow;
}

export default function LatestAnalysisFull({ entry }: LatestAnalysisFullProps) {
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

  const a = entry.analysis;

  function handleExport() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            Zadnja analiza
            <span className="inline-flex items-center gap-1 text-xs rounded-full bg-slate-900 text-white px-2 py-1">
              <CalendarDays className="w-3 h-3" />
              {dateLabel}
            </span>
          </h2>

          <p className="text-slate-500 text-sm mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-400" />
              <span className={`font-semibold ${scoreColor(a.mindset_score)}`}>
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

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Print / PDF
        </Button>
      </div>

      {/* SHARED LAYOUT */}
      <AnalysisLayout entry={entry} />
    </div>
  );
}
