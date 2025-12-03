"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Search,
  BookText,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

export default function HistoryPage() {
  const supabase = supabaseBrowser();

  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) return;

      const { data } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setEntries(data || []);
      setLoading(false);
    })();
  }, []);

  // FILTER LOGIC
  const filtered = entries.filter((e) => {
    const s = search.toLowerCase();

    return (
      e.content.toLowerCase().includes(s) ||
      e.analysis?.summary?.toLowerCase().includes(s) ||
      e.analysis?.ai_insight_today?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="px-6 md:px-12 py-10 space-y-12">

      {/* HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Journal</h1>
          <p className="text-slate-500 mt-1">
            Explore your reflections, patterns and insights.
          </p>
        </div>

        <div className="flex items-center gap-2 text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-xl shadow-sm">
          <BookText className="w-4 h-4" />
          <span className="text-sm font-medium">Entry History</span>
        </div>
      </div>

      {/* FILTERS CARD — only search now */}
      <Card className="rounded-2xl shadow-md border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            Filters
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries by text, summary or insight..."
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-300"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
          </div>
        </CardContent>
      </Card>

      {/* ENTRIES LIST */}
      <Card className="rounded-2xl shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookText className="text-indigo-600" />
            Entries
          </CardTitle>
        </CardHeader>

        <CardContent className="divide-y">
          {loading && (
            <p className="p-4 text-slate-500">Loading…</p>
          )}

          {!loading && filtered.length === 0 && (
            <p className="p-4 text-slate-400">
              No entries match your search.
            </p>
          )}

          {filtered.map((e) => {
            const summary =
              e.analysis?.summary ||
              e.content.slice(0, 80) ||
              "Reflection";

            const date = new Date(e.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <Link
                key={e.id}
                href={`/dashboard/history/${e.id}`}
                className="block group py-4 px-3 rounded-lg transition hover:bg-indigo-50/60"
              >
                <div className="flex justify-between items-start gap-4">

                  {/* LEFT */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🧠</span>
                      <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition">
                        {summary}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {e.content}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right whitespace-nowrap">
                    <p className="text-xs text-slate-400">{date}</p>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition mt-1 inline-block" />
                  </div>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
