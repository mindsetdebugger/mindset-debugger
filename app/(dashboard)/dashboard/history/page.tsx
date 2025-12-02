// app/(dashboard)/dashboard/history/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  LayoutGrid,
  LayoutList,
  Clock,
  HeartPulse,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabaseBrowser } from "@/lib/supabase/client";

type Entry = {
  id: string;
  created_at: string;
  emotion: string | null;
  summary: string | null;
  content: string | null;
  tone?: string | null;
};

export default function HistoryPage() {
  const supabase = supabaseBrowser();

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // heatmap u stateu da izbjegnemo hydration error
  const [heatmap, setHeatmap] = useState<number[]>([]);

  const heatColors = [
    "bg-slate-200",
    "bg-indigo-100",
    "bg-indigo-300",
    "bg-indigo-500",
    "bg-indigo-700",
  ];

  useEffect(() => {
    // generiraj heatmap jednom na klijentu
    setHeatmap(
      Array.from({ length: 21 }, () => Math.floor(Math.random() * 5))
    );
  }, []);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        // 1) Uzmemo usera na klijentu (ovdje cookies rade normalno)
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setErrorMsg(userError.message);
          setLoading(false);
          return;
        }

        if (!user) {
          setErrorMsg("You are not logged in.");
          setLoading(false);
          return;
        }

        // 2) Dohvati sve entries za tog usera
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMsg(error.message);
        } else if (data) {
          setEntries(
            data.map((e: any) => ({
              ...e,
              tone: e.emotion || "Mixed",
            }))
          );
        }
      } catch (err: any) {
        setErrorMsg(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [supabase]);

  return (
    <div className="space-y-12 px-6 md:px-12 py-10">
      {/* HERO HEADER */}
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

      {/* SEARCH + FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search – za sad samo UI, bez logike */}
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

      {/* EMOTION HEATMAP */}
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

      {/* STATE PORUKE */}
      {loading && <p className="text-sm text-slate-500">Loading entries…</p>}
      {errorMsg && !loading && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      {/* ENTRIES LIST / GRID */}
      {!loading && !errorMsg && entries.length === 0 && (
        <p className="text-slate-500 text-sm">No entries yet. Create your first one!</p>
      )}

      {!loading && entries.length > 0 && (
        <>
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
                          <span className="text-2xl">
                            {e.emotion || "🧠"}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {e.summary || "Untitled entry"}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                            {e.tone}
                          </span>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {e.content}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(e.created_at).toLocaleDateString()}
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
                      <span className="text-3xl">
                        {e.emotion || "🧠"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(e.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-800 text-lg">
                      {e.summary || "Untitled entry"}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {e.content}
                    </p>

                    <span className="inline-block mt-4 text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {e.tone}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
