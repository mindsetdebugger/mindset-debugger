"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Sparkles,
  Flame,
  Rocket,
  CheckCircle2,
  Clock,
  Brain,
  Target,
  Search,
  Plus,
} from "lucide-react";

type RoadmapItem = {
  id: number;
  title: string;
  desc: string;
  status: "Planned" | "In Progress" | "Completed" | "Future";
  priority: "High" | "Medium" | "Low";
};

const PRIORITY_COLOR: Record<RoadmapItem["priority"], string> = {
  High: "bg-red-500/20 text-red-600 border-red-400",
  Medium: "bg-yellow-500/20 text-yellow-600 border-yellow-400",
  Low: "bg-green-500/20 text-green-600 border-green-400",
};

const STATUS_COLOR: Record<RoadmapItem["status"], string> = {
  Future: "bg-slate-500/20 text-slate-600 border-slate-400",
  Planned: "bg-blue-500/20 text-blue-600 border-blue-400",
  "In Progress": "bg-orange-500/20 text-orange-600 border-orange-400",
  Completed: "bg-emerald-500/20 text-emerald-600 border-emerald-400",
};

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([
    {
      id: 1,
      title: "Mindset Score v1",
      desc: "First version of mindset scoring based on emotional patterns.",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 2,
      title: "Weekly AI Reports",
      desc: "Automatic weekly summaries analyzing your mood evolution.",
      status: "Planned",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Cognitive Bias Engine v2",
      desc: "Deeper recognition of thinking errors using hybrid transformers.",
      status: "Future",
      priority: "Low",
    },
    {
      id: 4,
      title: "Mobile App",
      desc: "Native iOS + Android app with offline-first functionality.",
      status: "Future",
      priority: "High",
    },
    {
      id: 5,
      title: "Daily Mood Engine",
      desc: "Fine-grained emotion scores with trend prediction.",
      status: "Completed",
      priority: "Medium",
    },
  ]);

  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return items;
    return items.filter((i) =>
      (i.title + i.desc).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  const progressChart = [
    { name: "Completed", value: items.filter((i) => i.status === "Completed").length },
    { name: "Remaining", value: items.filter((i) => i.status !== "Completed").length },
  ];

  const COLORS = ["#10b981", "#e5e7eb"];

  const [newItem, setNewItem] = useState<RoadmapItem>({
    id: 999,
    title: "",
    desc: "",
    status: "Planned",
    priority: "Medium",
  });

  function addRoadmapItem() {
    setItems((prev) => [...prev, { ...newItem, id: prev.length + 1 }]);
    setShowAdmin(false);
    setNewItem({
      id: 999,
      title: "",
      desc: "",
      status: "Planned",
      priority: "Medium",
    });
  }

  return (
    <div className="space-y-12 px-4 md:px-10 py-10 relative">

      {/* PARALLAX BACKGROUND */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-indigo-400/30 blur-[180px] -top-40 -left-40" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[160px] bottom-0 right-0" />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Rocket className="text-indigo-600 h-8 w-8" />
            Product Roadmap
          </h1>
          <p className="text-slate-600 mt-1 max-w-xl">
            Follow the evolution of Mindset Debugger as we shape a world-class emotional intelligence platform.
          </p>
        </div>

        <Button onClick={() => setShowAdmin(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Feature
        </Button>
      </motion.div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-white/70 backdrop-blur-lg rounded-xl border p-3 shadow">
        <Search className="text-slate-500" />
        <Input
          className="border-none shadow-none focus-visible:ring-0"
          placeholder="Search roadmap..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* PROGRESS CHART */}
      <Card className="rounded-2xl p-6 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="text-indigo-600" /> Progress Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {progressChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <RTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-indigo-700">
              {progressChart[0].value} / {items.length}
            </h3>
            <p className="text-slate-500">Features completed</p>

            <div className="mt-4 flex gap-3">
              <Badge className="bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
              </Badge>
              <Badge className="bg-orange-100 text-orange-700">
                <Clock className="h-4 w-4 mr-1" /> In Progress
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROADMAP LIST */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            layout
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            <Card
              className="rounded-2xl p-5 shadow-lg border hover:shadow-xl transition cursor-pointer"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{item.title}</h3>

                <Badge className={PRIORITY_COLOR[item.priority] + " border"}>
                  {item.priority}
                </Badge>
              </div>

              <Badge className={"mt-2 border " + STATUS_COLOR[item.status]}>
                {item.status}
              </Badge>

              <AnimatePresence>
                {expanded === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="mt-4 space-y-3"
                  >
                    <p className="text-sm text-slate-600">{item.desc}</p>

                    {/* Difficulty meter */}
                    <div className="text-xs text-slate-500">Difficulty</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`
                            w-6 h-2 rounded
                            ${lvl <= (item.priority === "High" ? 5 : item.priority === "Medium" ? 3 : 2)
                              ? "bg-indigo-600"
                              : "bg-slate-300"
                            }
                          `}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ADMIN MODAL */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md p-5 bg-white rounded-2xl shadow-xl space-y-4"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Target className="text-indigo-600" /> Add New Feature
              </h2>

              <Input
                placeholder="Title"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
              />

              <Textarea
                placeholder="Description"
                value={newItem.desc}
                onChange={(e) =>
                  setNewItem({ ...newItem, desc: e.target.value })
                }
              />

              <select
                className="border rounded p-2 text-sm"
                value={newItem.status}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    status: e.target.value as RoadmapItem["status"],
                  })
                }
              >
                <option>Future</option>
                <option>Planned</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <select
                className="border rounded p-2 text-sm"
                value={newItem.priority}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    priority: e.target.value as RoadmapItem["priority"],
                  })
                }
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAdmin(false)}>
                  Cancel
                </Button>
                <Button onClick={addRoadmapItem}>Add</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
