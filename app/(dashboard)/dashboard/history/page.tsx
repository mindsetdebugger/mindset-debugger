"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  LayoutGrid,
  LayoutList,
  Clock,
  Flame,
  HeartPulse,
  BrainCog,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const entries = [
    {
      id: 1,
      date: "05 Mar",
      emotion: "😞",
      tone: "Anxious",
      title: "Feeling overwhelmed",
      preview: "Osjećao sam se loše jer sam opet imao osjećaj...",
    },
    {
      id: 2,
      date: "04 Mar",
      emotion: "😐",
      tone: "Neutral",
      title: "Neutral day",
      preview: "Danas sam razmišljao o tome kako sve stići...",
    },
    {
      id: 3,
      date: "03 Mar",
      emotion: "🔥",
      tone: "Motivated",
      title: "Energy spike",
      preview: "Uhvatio sam val fokusa i dovršio nekoliko zadataka...",
    },
  ];

  const heatmap = Array.from({ length: 21 }, () =>
    Math.floor(Math.random() * 5)
  );
  const heatColors = [
    "bg-slate-200",
    "bg-indigo-100",
    "bg-indigo-300",
    "bg-indigo-500",
    "bg-indigo-700",
  ];

  return (
    <div className="space-y-12 px-6 md:px-12 py-10">

      {/* ==================================================== */}
      {/* HERO HEADER */}
      {/* ==================================================== */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-10 shadow-xl text-white">
        <div className="absolute w-80 h-80 bg-purple-400/40 blur-3xl -left-20 -top-20 animate-float" />
        <div className="absolute w-72 h-72 bg-indigo-300/40 blur-3xl -right-16 bottom-0 animate-float-slow" />

        <div className="relative z-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Reflection History
          </h1>
          <p className="text-indigo-200 max-w-xl text-sm md:text-base leading-relaxed">
            Browse your past reflections, emotions, patterns, and AI insights.
          </p>
        </div>
      </div>

      {/* ==================================================== */}
      {/* SEARCH + FILTER BAR */}
      {/* ==================================================== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search entries..."
            className="w-full px-4 py-2 rounded-xl border bg-white shadow focus:outline-none"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white border shadow flex items-center gap-2 text-sm hover:bg-slate-50 transition">
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-white border shadow px-2 py-1 rounded-xl">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500"
              }`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* EMOTION HEATMAP */}
      {/* ==================================================== */}
      <Card className="rounded-2xl bg-white/60 backdrop-blur border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HeartPulse className="h-5 w-5 text-indigo-600" />
            Emotion Heatmap (Last 21 days)
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-7 gap-2 max-w-xs">
            {heatmap.map((lvl, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-md ${heatColors[lvl]}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ==================================================== */}
      {/* ENTRIES LIST / GRID */}
      {/* ==================================================== */}
      {viewMode === "list" ? (
        <Card className="rounded-2xl shadow-lg border border-indigo-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Entries
            </CardTitle>
          </CardHeader>

          <CardContent className="divide-y">
            {entries.map((e) => (
              <Link
                key={e.id}
                href={`/dashboard/history/${e.id}`}
                className="block py-5 px-4 hover:bg-indigo-50 rounded-xl transition tilt"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{e.emotion}</span>
                      <span className="font-semibold text-slate-800">
                        {e.title}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {e.tone}
                      </span>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {e.preview}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {e.date}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {entries.map((e) => (
            <Link
              key={e.id}
              href={`/dashboard/history/${e.id}`}
              className="block"
            >
              <Card className="rounded-2xl p-6 shadow-xl hover:shadow-2xl border border-indigo-100 bg-white/70 backdrop-blur transition tilt">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-3xl">{e.emotion}</span>
                  <span className="text-xs text-slate-500">{e.date}</span>
                </div>

                <h3 className="font-semibold text-slate-800 text-lg">
                  {e.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {e.preview}
                </p>

                <span className="inline-block mt-4 text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  {e.tone}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
