"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ShieldCheck,
  Brain,
  Heart,
  Compass as CompassIcon,
  Flame,
  Anchor,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/useAppStore";

// --------------------------------------------------
// Badge component
// --------------------------------------------------
function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      className={`
        px-3 py-1 rounded-xl text-sm border whitespace-nowrap
        ${color}
      `}
    >
      {children}
    </span>
  );
}

// --------------------------------------------------
// PAGE
// --------------------------------------------------
export default function CompassPage() {
  const {
    compassProfile,
    loading,
    refreshing,
    regenerateCompass,
    loadCompassProfile,
  } = useAppStore();

  // -------------------------------------------
  // Load Compass Profile on mount
  // -------------------------------------------
  useEffect(() => {
    loadCompassProfile();
  }, [loadCompassProfile]);

  // -------------------------------------------
  // Auto-weekly regeneration (works the same)
  // -------------------------------------------
  useEffect(() => {
    if (!compassProfile) return;

    const last = new Date(compassProfile.last_generated);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (Date.now() - last.getTime() > oneWeek) {
      regenerateCompass();
    }
  }, [compassProfile, regenerateCompass]);

  // -------------------------------------------
  // Loading
  // -------------------------------------------
  if (loading) {
    return (
      <div className="py-20 flex justify-center text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // -------------------------------------------
  // No Compass Yet
  // -------------------------------------------
  if (!compassProfile) {
    return (
      <div className="text-center py-20 space-y-6 px-6">
        <h2 className="text-xl font-semibold text-slate-700">
          Compass profile is not generated yet.
        </h2>

        <p className="text-slate-500 max-w-md mx-auto">
          Compass se generira automatski 1× tjedno — ili ga možeš generirati sada.
        </p>

        <Button
          onClick={regenerateCompass}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing && <Loader2 className="w-4 h-4 animate-spin" />}
          Generate Compass
        </Button>
      </div>
    );
  }

  const c = compassProfile;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className="py-12 space-y-12">

      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}
      <header className="flex items-center justify-between px-4 md:px-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 text-slate-900">
            <CompassIcon className="w-8 h-8 text-indigo-600" />
            Your Mental Compass
          </h1>

          <p className="text-slate-600 max-w-2xl leading-relaxed">
            Tvoja stabilna psihološka mapa — vrijednosti, stilovi razmišljanja,
            emocija, dugoročni okidači i zaštitni faktori.
          </p>
        </div>

        <Button
          onClick={regenerateCompass}
          variant="outline"
          disabled={refreshing}
          className="hidden md:flex items-center gap-2"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Regenerate
        </Button>
      </header>

      {/* -------------------------------------------------- */}
      {/* GRID */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* CORE VALUES */}
        <Card className="rounded-3xl shadow-md border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Heart className="text-rose-500" /> Core Values
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            {c.core_values.map((v, i) => (
              <Badge key={i} color="bg-rose-50 text-rose-700 border-rose-200">
                {v}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* EMOTIONAL STYLE */}
        <Card className="rounded-3xl shadow-md border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Brain className="text-indigo-600" /> Emotional Style
            </CardTitle>
          </CardHeader>

          <CardContent className="text-slate-700 text-sm leading-relaxed">
            {c.default_emotional_style}
          </CardContent>
        </Card>

        {/* THINKING STYLE */}
        <Card className="rounded-3xl shadow-md border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              🧠 Thinking Style
            </CardTitle>
          </CardHeader>

          <CardContent className="text-slate-700 text-sm leading-relaxed">
            {c.default_thinking_style}
          </CardContent>
        </Card>

        {/* CORE FEARS */}
        <Card className="rounded-3xl shadow-md border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Flame className="text-amber-500" /> Core Fears
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            {c.core_fears.map((v, i) => (
              <Badge key={i} color="bg-amber-50 text-amber-700 border-amber-200">
                {v}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* VULNERABILITIES */}
        <Card className="rounded-3xl shadow-md border-slate-200 bg-white md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <AlertTriangle className="text-red-500" /> Vulnerabilities
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            {c.vulnerabilities.map((v, i) => (
              <Badge key={i} color="bg-red-50 text-red-700 border-red-200">
                {v}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* PROTECTIVE FACTORS */}
        <Card className="rounded-3xl shadow-md border-slate-200 bg-white md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <ShieldCheck className="text-emerald-600" /> Protective Factors
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            {c.protective_factors.map((v, i) => (
              <Badge
                key={i}
                color="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                {v}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* TRIGGERS */}
        <Card className="rounded-3xl shadow-md border-slate-200 bg-white md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              ⚡ Long-Term Triggers
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            {c.long_term_triggers.map((v, i) => (
              <Badge
                key={i}
                color="bg-indigo-50 text-indigo-700 border-indigo-200"
              >
                {v}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* PSYCHOLOGICAL FORMULA */}
        <Card className="rounded-3xl shadow-md border-slate-200 bg-white md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Anchor className="text-slate-700" /> Psychological Formula
            </CardTitle>
          </CardHeader>

          <CardContent className="text-slate-700 text-sm leading-relaxed">
            {c.psychological_formula}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
