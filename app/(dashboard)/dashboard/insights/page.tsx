"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Sparkles,
  Orbit,
  Target,
  Flame,
  Compass,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function InsightsPage() {
  /* AI TYPING EFFECT */
  const insight =
    "Your emotional pattern shows a repeating loop: pressure → uncertainty → self-doubt → avoidance → guilt → renewed pressure.";

  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(insight.slice(0, i));
      if (i >= insight.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  /* RADAR DATA */
  const biasData = [
    { bias: "Overthinking", value: 78 },
    { bias: "Catastrophizing", value: 54 },
    { bias: "Self-Criticism", value: 84 },
    { bias: "Perfectionism", value: 70 },
    { bias: "Avoidance", value: 41 },
  ];

  /* WAVEFORM DATA */
  const waveformData = useMemo(
    () => Array.from({ length: 40 }, () => Math.random() * 35 + 10),
    []
  );

  return (
    <div className="space-y-12 px-4 md:px-14 py-6 md:py-10">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white p-6 md:p-10 shadow-2xl">

        {/* Blobs — HIDDEN ON MOBILE */}
        <div className="hidden md:block absolute w-96 h-96 bg-purple-400/40 blur-3xl -top-10 -left-20 animate-float-slow" />
        <div className="hidden md:block absolute w-80 h-80 bg-indigo-300/30 blur-3xl top-20 right-0 animate-float" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05]" />

        <div className="relative z-10 space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 md:h-10 md:w-10 text-indigo-200 animate-pulse-slow" />
            Insights
          </h1>

          <p className="text-indigo-200 text-sm md:text-lg max-w-2xl leading-relaxed">
            Deep, AI-powered understanding of your emotional and cognitive patterns.
          </p>
        </div>
      </div>

      {/* AI HIGHLIGHT */}
      <Card className="rounded-xl md:rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-indigo-800">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            AI Highlight
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm md:text-base font-mono text-slate-800 min-h-[80px]">
          {typed}
          <span className="inline-block w-1 h-4 bg-indigo-500 animate-pulse ml-1" />
        </CardContent>
      </Card>

      {/* RADAR + ROOT CAUSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

        {/* RADAR CHART */}
        <Card className="rounded-xl md:rounded-2xl p-4 border border-indigo-200 bg-white/60 backdrop-blur shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Activity className="h-5 w-5 text-indigo-600" />
              Cognitive Bias Map
            </CardTitle>
          </CardHeader>

          <CardContent className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="70%" data={biasData}>
                <PolarGrid stroke="#c7d2fe" />
                <PolarAngleAxis dataKey="bias" tick={{ fontSize: 10 }} />
                <Radar
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="#818cf8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROOT CAUSES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:col-span-2">

          <div className="p-5 rounded-xl bg-indigo-50 shadow-inner border border-indigo-200">
            <h3 className="font-semibold flex items-center gap-2 text-indigo-800 text-sm md:text-base">
              <Target className="h-5 w-5" /> Pressure Sensitivity
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mt-2">
              Your system reacts strongly to external expectations.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-indigo-50 shadow-inner border border-indigo-200">
            <h3 className="font-semibold flex items-center gap-2 text-indigo-800 text-sm md:text-base">
              <Flame className="h-5 w-5" /> Emotional Load
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mt-2">
              Stress quietly accumulates until it overwhelms you.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-indigo-50 shadow-inner border border-indigo-200">
            <h3 className="font-semibold flex items-center gap-2 text-indigo-800 text-sm md:text-base">
              <Compass className="h-5 w-5" /> Unclear Direction
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mt-2">
              Lack of clarity amplifies self-doubt and slows progress.
            </p>
          </div>
        </div>
      </div>

      {/* EMOTIONAL WAVEFORM */}
      <Card className="rounded-xl md:rounded-2xl p-5 md:p-6 bg-white/50 backdrop-blur border border-indigo-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Orbit className="h-5 w-5 text-indigo-600" />
            Emotional Waveform
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-end gap-[2px] h-24 md:h-32 overflow-hidden">
            {waveformData.map((h, i) => (
              <div
                key={i}
                className="w-1 bg-indigo-500 rounded-full shadow-inner animate-wave"
                style={{
                  height: `${h}px`,
                  animationDelay: `${i * 0.02}s`,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RECOMMENDATIONS */}
      <Card className="rounded-xl md:rounded-2xl p-6 md:p-8 bg-gradient-to-br from-white/60 to-indigo-50 backdrop-blur-xl border border-indigo-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Recommended Actions
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 md:space-y-3 text-sm md:text-base">
          <p>• Establish a daily grounding ritual.</p>
          <p>• Use 3-2-1 method when overwhelmed.</p>
          <p>• Replace judgment with observation.</p>
          <p>• Reduce context-switching noise.</p>
        </CardContent>
      </Card>
    </div>
  );
}
