"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RoadmapItem = {
  id: number;
  title: string;
  desc: string;
  status: "Planned" | "In Progress" | "Completed" | "Future";
  priority: "High" | "Medium" | "Low";
};

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([
    {
      id: 1,
      title: "Mindset Score v1",
      desc: "First version of mindset scoring based on emotional analysis.",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 2,
      title: "Weekly Insight Reports",
      desc: "AI-generated summary every Sunday.",
      status: "Planned",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Cognitive Bias Engine v2",
      desc: "Deeper bias detection",
      status: "Future",
      priority: "Low",
    },
    {
      id: 4,
      title: "Mobile App",
      desc: "Full iOS + Android app",
      status: "Future",
      priority: "High",
    },
    {
      id: 5,
      title: "Daily AI Mood Analysis",
      desc: "Improved emotional classification",
      status: "Completed",
      priority: "Medium",
    },
  ]);

  const [expanded, setExpanded] = useState<number | null>(null);
  const [sort, setSort] = useState<"none" | "priority">("none");

  const [showAdmin, setShowAdmin] = useState(false);
  const [newItem, setNewItem] = useState<RoadmapItem>({
    id: 999,
    title: "",
    desc: "",
    status: "Planned",
    priority: "Medium",
  });

  // Progress chart
  const completed = items.filter((i) => i.status === "Completed").length;
  const progressData = [{ name: "Progress", value: completed, total: items.length }];

  // Sorting
  const priorityWeight = { High: 1, Medium: 2, Low: 3 };

  const sortedItems =
    sort === "priority"
      ? [...items].sort(
          (a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]
        )
      : items;

  // ADD NEW ITEM (ADMIN)
  function addRoadmapItem() {
    setItems((prev) => [
      ...prev,
      { ...newItem, id: prev.length + 1 },
    ]);
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
    <div className="space-y-12 px-4 md:px-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Roadmap</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            What's being built, shipped or planned next.
          </p>
        </div>

        <Button onClick={() => setShowAdmin(true)}>+ Add Feature</Button>
      </div>

      {/* PROGRESS CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Roadmap Progress</CardTitle>
        </CardHeader>

        <CardContent className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" domain={[0, progressData[0].total]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-xs text-center mt-2 text-muted-foreground">
            {completed}/{items.length} features completed
          </p>
        </CardContent>
      </Card>

      {/* SORT */}
      <div className="flex gap-3">
        <Button
          variant={sort === "priority" ? "default" : "outline"}
          onClick={() =>
            setSort(sort === "priority" ? "none" : "priority")
          }
        >
          Sort by Priority
        </Button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {sortedItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              className="cursor-pointer"
            >
              <CardTitle className="text-base md:text-lg flex justify-between items-center">
                {item.title}
                <Badge>{item.priority}</Badge>
              </CardTitle>
            </CardHeader>

            {/* EXPANDED CONTENT */}
            {expanded === item.id && (
              <CardContent className="space-y-3">
                <p className="text-xs md:text-sm text-muted-foreground">
                  {item.desc}
                </p>

                <Badge
                  variant={
                    item.status === "Completed"
                      ? "secondary"
                      : item.status === "In Progress"
                      ? "default"
                      : item.status === "Planned"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {item.status}
                </Badge>

                {/* PROGRESS BAR */}
                <div className="h-2 w-full bg-muted rounded mt-3">
                  <div
                    className="h-full bg-primary rounded"
                    style={{
                      width:
                        item.status === "Completed"
                          ? "100%"
                          : item.status === "In Progress"
                          ? "60%"
                          : item.status === "Planned"
                          ? "20%"
                          : "0%",
                    }}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}

      </div>

      {/* ADMIN MODAL */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-4 space-y-4">

            <h2 className="text-lg font-semibold">Add New Feature</h2>

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
                  status: e.target.value as any,
                })
              }
            >
              <option>Planned</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Future</option>
            </select>

            <select
              className="border rounded p-2 text-sm"
              value={newItem.priority}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  priority: e.target.value as any,
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

          </Card>
        </div>
      )}

    </div>
  );
}
