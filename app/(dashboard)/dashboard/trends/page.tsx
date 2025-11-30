"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "recharts";

export default function TrendsPage() {
  // FILTERI
  const [range, setRange] = useState<"week" | "month" | "quarter" | "year">(
    "week"
  );
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // DATA ZA EMOCIONALNI TREND
  const emotionalTrend = [
    { day: "Mon", value: 62 },
    { day: "Tue", value: 58 },
    { day: "Wed", value: 74 },
    { day: "Thu", value: 69 },
    { day: "Fri", value: 65 },
    { day: "Sat", value: 71 },
    { day: "Sun", value: 75 },
  ];

  // EMOTIONAL CATEGORY TRENDS
  const emotionCategories = [
    { emotion: "Anxiety", Mon: 40, Tue: 32, Wed: 28, Thu: 35, Fri: 22, Sat: 18, Sun: 20 },
    { emotion: "Motivation", Mon: 25, Tue: 31, Wed: 40, Thu: 38, Fri: 35, Sat: 30, Sun: 42 },
    { emotion: "Calm", Mon: 30, Tue: 28, Wed: 35, Thu: 32, Fri: 38, Sat: 40, Sun: 45 },
  ];

  // HEATMAP (daily mood)
  const heatmap = Array.from({ length: 30 }, () => Math.floor(Math.random() * 5));

  const heatmapColors = [
    "bg-gray-200",
    "bg-blue-200",
    "bg-blue-400",
    "bg-blue-600",
    "bg-blue-800",
  ];

  return (
    <div className="space-y-8 px-4 md:px-8">

      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Trends</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Deep analytics of your emotional patterns.
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 flex-wrap">
        {["week", "month", "quarter", "year"].map((r) => (
          <Button
            key={r}
            variant={range === r ? "default" : "outline"}
            size="sm"
            onClick={() => setRange(r as any)}
          >
            {r.toUpperCase()}
          </Button>
        ))}

        {/* Chart toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
        >
          {chartType === "line" ? "Bar Chart" : "Line Chart"}
        </Button>
      </div>

      {/* MAIN TREND CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Overall Emotional Trend ({range})
          </CardTitle>
        </CardHeader>

        <CardContent className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={emotionalTrend}>
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" domain={[40, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={emotionalTrend}>
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* HEATMAP */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Daily Mood Heatmap</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-10 gap-1">
            {heatmap.map((level, i) => (
              <div
                key={i}
                className={clsx("w-6 h-6 rounded", heatmapColors[level])}
                title={`Day ${i + 1}: mood level ${level}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Darker squares = stronger emotional intensity.
          </p>
        </CardContent>
      </Card>

      {/* EMOTION CATEGORY TRENDS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Emotion Category Trends</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {emotionCategories.map((emotionData) => (
            <div key={emotionData.emotion}>
              <p className="font-medium mb-2">{emotionData.emotion}</p>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: "Mon", value: emotionData.Mon },
                    { day: "Tue", value: emotionData.Tue },
                    { day: "Wed", value: emotionData.Wed },
                    { day: "Thu", value: emotionData.Thu },
                    { day: "Fri", value: emotionData.Fri },
                    { day: "Sat", value: emotionData.Sat },
                    { day: "Sun", value: emotionData.Sun },
                  ]}>
                    <XAxis dataKey="day" stroke="#aaa" />
                    <YAxis stroke="#aaa" domain={[0, 50]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}

        </CardContent>
      </Card>

    </div>
  );
}
