"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  Brush,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Heart,
  Brain,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

/* ========================================================================
   STATIC DATA
   ======================================================================== */

const ranges = ["week", "month", "quarter", "year"] as const;
type Range = (typeof ranges)[number];
type ChartType = "line" | "bar";

/* Main emotional trend (weekly) */
const EMOTIONAL_TREND = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 58 },
  { day: "Wed", value: 74 },
  { day: "Thu", value: 69 },
  { day: "Fri", value: 65 },
  { day: "Sat", value: 71 },
  { day: "Sun", value: 75 },
];

/* Category trends */
const EMOTION_CATEGORIES = [
  {
    emotion: "Anxiety",
    Mon: 40,
    Tue: 32,
    Wed: 28,
    Thu: 35,
    Fri: 22,
    Sat: 18,
    Sun: 20,
  },
  {
    emotion: "Motivation",
    Mon: 25,
    Tue: 31,
    Wed: 40,
    Thu: 38,
    Fri: 35,
    Sat: 30,
    Sun: 42,
  },
  {
    emotion: "Calm",
    Mon: 30,
    Tue: 28,
    Wed: 35,
    Thu: 32,
    Fri: 38,
    Sat: 40,
    Sun: 45,
  },
];

/* Heatmap 30 days (0–4 intensity) */
const HEATMAP: number[] = [
  0, 1, 2, 3, 4,
  1, 2, 3, 4, 0,
  2, 3, 4, 3, 2,
  1, 0, 1, 2, 3,
  4, 3, 2, 1, 0,
  1, 2, 3, 4, 2,
];

const HEATMAP_COLORS = [
  "bg-slate-200",
  "bg-indigo-100",
  "bg-indigo-300",
  "bg-indigo-500",
  "bg-indigo-700",
];

/* Emotion clusters (bubble viz) */
type EmotionCluster = {
  x: number; // intensity axis
  y: number; // valence axis
  z: number; // bubble size
  label: string;
  category: string;
};

const EMOTION_CLUSTERS: EmotionCluster[] = [
  { x: 80, y: 20, z: 200, label: "Work stress", category: "Anxiety" },
  { x: 65, y: 30, z: 160, label: "Family pressure", category: "Guilt" },
  { x: 40, y: 70, z: 140, label: "Deep focus", category: "Motivation" },
  { x: 30, y: 80, z: 130, label: "Slow evening", category: "Calm" },
  { x: 55, y: 50, z: 150, label: "Planning future", category: "Reflection" },
];

/* Multi-year trend (monthly points for ~2 years) */
type YearPoint = {
  month: string; // label
  score: number;
};

const MULTI_YEAR_TREND: YearPoint[] = [
  { month: "2023-01", score: 58 },
  { month: "2023-02", score: 60 },
  { month: "2023-03", score: 63 },
  { month: "2023-04", score: 61 },
  { month: "2023-05", score: 65 },
  { month: "2023-06", score: 67 },
  { month: "2023-07", score: 70 },
  { month: "2023-08", score: 68 },
  { month: "2023-09", score: 66 },
  { month: "2023-10", score: 69 },
  { month: "2023-11", score: 71 },
  { month: "2023-12", score: 72 },
  { month: "2024-01", score: 69 },
  { month: "2024-02", score: 70 },
  { month: "2024-03", score: 73 },
  { month: "2024-04", score: 74 },
  { month: "2024-05", score: 76 },
  { month: "2024-06", score: 78 },
  { month: "2024-07", score: 77 },
  { month: "2024-08", score: 79 },
  { month: "2024-09", score: 80 },
  { month: "2024-10", score: 81 },
];

/* ========================================================================
   SMALL COMPONENTS
   ======================================================================== */

/* SVG ring for intensity / score */
function EmotionRing({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;

  return (
    <svg width="120" height="120" className="mx-auto">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#e2e8f0"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        className="transition-all duration-700"
      />
    </svg>
  );
}

/* Framer Motion variants */
const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/* ========================================================================
   PAGE
   ======================================================================== */

export default function TrendsPage() {
  const [range, setRange] = useState<Range>("week");
  const [chartType, setChartType] = useState<ChartType>("line");

  const avgMood = Math.round(
    EMOTIONAL_TREND.reduce((acc, item) => acc + item.value, 0) /
      EMOTIONAL_TREND.length
  );
  const delta = avgMood - 65; // mock comparison with previous period

  return (
    <motion.div
      className="space-y-12 px-4 md:px-10 py-8"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.06 }}
    >
      {/* ======================================================= */}
      {/* HERO HEADER */}
      {/* ======================================================= */}
      <motion.div variants={fadeInUp}>
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white p-10 shadow-xl overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-400/40 blur-3xl -left-32 -top-24 animate-float" />
          <div className="absolute w-72 h-72 bg-indigo-300/40 blur-3xl -right-20 bottom-0 animate-float-slow" />

          <div className="relative z-20">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
              <Brain className="h-8 w-8 text-indigo-200" />
              Emotional Trends
            </h1>
            <p className="text-indigo-200 max-w-xl mt-2 text-sm md:text-base">
              Visualize emotional movement, long-term tendencies and inner
              clusters that shape how you feel over time.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ======================================================= */}
      {/* SUMMARY CARDS */}
      {/* ======================================================= */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={fadeInUp}
      >
        {/* Average mood */}
        <motion.div variants={fadeInUp} className="tilt">
          <Card className="rounded-2xl p-6 shadow-md border border-indigo-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-indigo-600" />
                Average Mood
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <EmotionRing value={avgMood} color="#4f46e5" />
              <p className="text-3xl font-semibold mt-2 text-indigo-700">
                {avgMood}
              </p>
              <div className="flex justify-center items-center gap-1 mt-1 text-sm">
                {delta >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600">
                      +{delta} vs last period
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">
                      {delta} vs last period
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dominant emotion */}
        <motion.div variants={fadeInUp} className="tilt">
          <Card className="rounded-2xl p-6 shadow-md border border-indigo-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="h-5 w-5 text-indigo-600" />
                Dominant Emotion
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <EmotionRing value={78} color="#f97316" />
              <p className="text-xl font-semibold mt-3 text-slate-800">
                Anxiety
              </p>
              <p className="text-xs text-slate-500">
                Most intense emotional theme this week.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stability */}
        <motion.div variants={fadeInUp} className="tilt">
          <Card className="rounded-2xl p-6 shadow-md border border-indigo-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-indigo-600" />
                Emotional Stability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <EmotionRing value={62} color="#22c55e" />
              <p className="text-xl font-semibold mt-3 text-slate-800">
                Medium
              </p>
              <p className="text-xs text-slate-500">
                Generally steady, with a few sharper spikes.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ======================================================= */}
      {/* RANGE FILTERS + CHART TYPE */}
      {/* ======================================================= */}
      <motion.div
        variants={fadeInUp}
        className="flex gap-3 flex-wrap items-center"
      >
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm border transition",
              range === r
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-slate-300 hover:bg-slate-100"
            )}
          >
            {r.toUpperCase()}
          </button>
        ))}

        <button
          onClick={() =>
            setChartType(chartType === "line" ? "bar" : "line")
          }
          className="px-4 py-2 rounded-full text-sm bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition"
        >
          {chartType === "line" ? "BAR CHART" : "LINE CHART"}
        </button>
      </motion.div>

      {/* ======================================================= */}
      {/* MAIN TREND CHART */}
      {/* ======================================================= */}
      <motion.div variants={fadeInUp}>
        <Card className="rounded-2xl shadow-md p-6 border border-indigo-100">
          <CardHeader>
            <CardTitle className="text-lg">
              Overall Emotional Trend ({range})
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={EMOTIONAL_TREND}>
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" domain={[40, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    animationDuration={800}
                  />
                </LineChart>
              ) : (
                <BarChart data={EMOTIONAL_TREND}>
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#4f46e5"
                    radius={[6, 6, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* ======================================================= */}
      {/* HEATMAP + CLUSTER MAP */}
      {/* ======================================================= */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* HEATMAP */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 p-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Mood Heatmap (last 30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-1">
              {HEATMAP.map((lvl, i) => (
                <div
                  key={i}
                  className={clsx(
                    "w-7 h-7 rounded-md border border-white shadow-inner",
                    HEATMAP_COLORS[lvl]
                  )}
                  title={`Day ${i + 1}: intensity ${lvl}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Darker tiles = stronger emotional intensity.
            </p>
          </CardContent>
        </Card>

        {/* EMOTION CLUSTER MAP */}
        <Card className="rounded-2xl shadow-md border border-indigo-100 p-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Emotion Cluster Map
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Intensity"
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Valence"
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <ZAxis
                  type="number"
                  dataKey="z"
                  range={[60, 200]}
                  name="Frequency"
                />
                <Tooltip
                  formatter={(_, __, item) =>
                    (item && typeof item.payload.label === "string"
                      ? item.payload.label
                      : ""
                    )
                  }
                  labelFormatter={() => ""}
                />
                <Scatter data={EMOTION_CLUSTERS} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-3">
              Each bubble represents a recurring emotional context.  
              Larger bubbles = patterns that appear more often.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ======================================================= */}
      {/* MULTI-YEAR TREND (ZOOMABLE) */}
      {/* ======================================================= */}
      <motion.div variants={fadeInUp}>
        <Card className="rounded-2xl shadow-md border border-indigo-100 p-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Multi-Year Emotional Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MULTI_YEAR_TREND}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  minTickGap={12}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="url(#trendGradient)"
                  strokeWidth={2}
                  animationDuration={1000}
                />
                <Brush
                  dataKey="month"
                  height={22}
                  stroke="#4f46e5"
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-3">
              Use the brush to zoom into specific periods and see how your
              baseline emotional score changes across months.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ======================================================= */}
      {/* CATEGORY TRENDS */}
      {/* ======================================================= */}
      <motion.div variants={fadeInUp}>
        <Card className="rounded-2xl shadow-md border border-indigo-100 p-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Emotion Category Trends (weekly)
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {EMOTION_CATEGORIES.map((e) => (
              <div
                key={e.emotion}
                className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100"
              >
                <p className="font-semibold text-slate-800 mb-2">
                  {e.emotion}
                </p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { day: "Mon", value: e.Mon },
                        { day: "Tue", value: e.Tue },
                        { day: "Wed", value: e.Wed },
                        { day: "Thu", value: e.Thu },
                        { day: "Fri", value: e.Fri },
                        { day: "Sat", value: e.Sat },
                        { day: "Sun", value: e.Sun },
                      ]}
                    >
                      <XAxis dataKey="day" stroke="#aaa" />
                      <YAxis stroke="#aaa" domain={[0, 50]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        animationDuration={900}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
