"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// ⬇️ VAŽNO: uvoz supabaseBrowser
import { supabaseBrowser } from "@/lib/supabase/client";

export default function NewEntryPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [analysis, setAnalysis] = useState<{
    emotion: string;
    summary: string;
    biases: string[];
    recommendation: string;
  } | null>(null);

  // REAL ANALYZE + SAVE FUNCTION
  async function analyze() {
    try {
      setLoading(true);
      setErrorMsg("");
      setAnalysis(null);

      if (input.trim().split(" ").length < 5) {
        setLoading(false);
        setErrorMsg("Please write at least one full sentence (5–10 words).");
        return;
      }

      // 1) AI ANALYZA
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }), // 🔥 ovo se slaže s tvojim backendom
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }

      // 2) Prikaz analize u UI
      setAnalysis(data.analysis);

      // 3) SPREMANJE U SUPABASE (client-side)
      const supabase = supabaseBrowser();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn("User not logged in, entry not saved to DB.");
        return; // možeš i pokazati poruku ako želiš
      }

      const { error: dbError } = await supabase.from("entries").insert({
        user_id: user.id,
        content: input,
        emotion: data.analysis.emotion,
        summary: data.analysis.summary,
        biases: data.analysis.biases,
        recommendation: data.analysis.recommendation,
      });

      if (dbError) {
        console.error("Supabase insert error:", dbError);
        // opcionalno:
        // setErrorMsg("AI worked, but saving to history failed.");
      }
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setErrorMsg(err.message || "Unexpected error.");
    }
  }

  return (
    <div className="space-y-12 px-4 md:px-10 py-12 relative">

      {/* Glow background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[600px] h-[600px] bg-indigo-400/20 blur-[160px] -top-40 -left-20" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[140px] bottom-0 right-0" />
      </div>

      {/* Back button */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 transition"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">New Entry</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Reflect on your day — AI will analyze emotions & cognitive patterns.
        </p>
      </motion.div>

      {/* Input card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="rounded-2xl shadow-lg backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg">Your Reflection</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write how you felt today..."
              className="min-h-[200px] p-4 text-md rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />

            {errorMsg && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}

            <Button
              onClick={analyze}
              disabled={loading || !input.trim()}
              className="w-full md:w-auto relative group overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  "Analyze with AI"
                )}
              </span>

              {/* Shine */}
              <div className="absolute inset-0 w-[200%] -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition animate-[shine_1.4s_ease-in-out_infinite]" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading skeleton */}
      {loading && (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="rounded-2xl border-indigo-200 dark:border-indigo-900 p-6 animate-pulse space-y-4">
            <div className="h-4 bg-slate-300/40 rounded w-1/3" />
            <div className="h-3 bg-slate-300/40 rounded w-3/4" />
            <div className="h-3 bg-slate-300/40 rounded w-2/5" />
            <div className="h-3 bg-slate-300/40 rounded w-1/2" />
          </Card>
        </motion.div>
      )}

      {/* AI Output */}
      {analysis && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl border-indigo-300 dark:border-indigo-900 shadow-xl py-6 px-4 md:px-6">
            <CardHeader>
              <CardTitle className="text-lg">AI Analysis</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 text-sm md:text-base">

              <div>
                <h3 className="font-semibold">Emotional Tone</h3>
                <p className="text-muted-foreground">{analysis.emotion}</p>
              </div>

              <div>
                <h3 className="font-semibold">Summary</h3>
                <p className="text-muted-foreground">{analysis.summary}</p>
              </div>

              <div>
                <h3 className="font-semibold">Cognitive Patterns</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.biases.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Recommendation</h3>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200/40">
                  <p className="text-muted-foreground leading-relaxed">
                    {analysis.recommendation}
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
