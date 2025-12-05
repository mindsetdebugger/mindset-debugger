// app/api/roadmap/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabase/server";

type RoadmapItemStatus = "not_started" | "in_progress" | "completed";

export async function POST(req: Request) {
  try {
    const { analysis } = await req.json();

    if (!analysis) {
      return NextResponse.json(
        { error: "Missing analysis." },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // 1) User
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    // 2) History summary + trends (za dugoročnu sliku)
    const { data: summaryRow } = await supabase
      .from("history_summaries")
      .select("summary_long, aggregates, trends_page")
      .eq("user_id", user.id)
      .maybeSingle();

    const summaryLong = summaryRow?.summary_long ?? "None";
    const aggregates = summaryRow?.aggregates ?? {};
    const trendsPage = summaryRow?.trends_page ?? {};

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    // 3) Prompt
    const prompt = `
You are Mindset Debugger — create a WEEKLY PERSONAL GROWTH ROADMAP.

Inputs:
- Long-term history summary
- Aggregates (patterns, beliefs, needs)
- Trends page (30-day evolution)
- Today's analysis

Write EVERYTHING in second person (“ti”, “kod tebe…”).

Return ONLY valid JSON with this shape:

{
  "core_challenges": ["..."],
  "core_strengths": ["..."],
  "emotional_skills": ["..."],
  "thinking_patterns": ["..."],
  "identity_drivers": ["..."],
  "vulnerabilities": ["..."],
  "protective_factors": ["..."],
  "long_term_triggers": ["..."],

  "weekly_goals": [
    { "id": "wk1", "text": "...", "status": "not_started" }
  ],

  "growth_actions": [
    { "id": "ga1", "text": "...", "status": "not_started" }
  ],

  "weekly_checkpoint": {
    "wins": ["..."],
    "obstacles": ["..."],
    "keep_doing": ["..."],
    "adjust": ["..."],
    "stagnation": ["..."]
  }
}

RULES:
- 3–5 "core_challenges"
- 3–5 "core_strengths"
- 3–5 "emotional_skills"
- 3–5 "weekly_goals" (each very concrete, small, weekly-doable)
- 3–6 "growth_actions" (habit-like micro actions, 1–5 min)
- All "status" MUST be exactly "not_started".
- Use concise bullet-style sentences.

HISTORY SUMMARY:
${summaryLong}

AGGREGATES:
${JSON.stringify(aggregates)}

TRENDS PAGE:
${JSON.stringify(trendsPage)}

TODAY ANALYSIS:
${JSON.stringify(analysis)}
`;

    // 4) OpenAI call
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [{ role: "user", content: prompt }],
    });

    const raw = response.output[0].content[0].text;
    const json = JSON.parse(raw);

    // basic sanity: ensure status fields
    const normalizeItems = (items: any[]): any[] =>
      (items || []).map((it, idx) => ({
        id: it.id ?? `auto_${idx}`,
        text: it.text ?? "",
        status: (it.status ??
          "not_started") as RoadmapItemStatus,
      }));

    const roadmap = {
      core_challenges: json.core_challenges ?? [],
      core_strengths: json.core_strengths ?? [],
      emotional_skills: json.emotional_skills ?? [],
      thinking_patterns: json.thinking_patterns ?? [],
      identity_drivers: json.identity_drivers ?? [],
      vulnerabilities: json.vulnerabilities ?? [],
      protective_factors: json.protective_factors ?? [],
      long_term_triggers: json.long_term_triggers ?? [],
      weekly_goals: normalizeItems(json.weekly_goals ?? []),
      growth_actions: normalizeItems(json.growth_actions ?? []),
      weekly_checkpoint: json.weekly_checkpoint ?? {
        wins: [],
        obstacles: [],
        keep_doing: [],
        adjust: [],
        stagnation: [],
      },
    };

    // 5) Save in DB
    const { error: upsertError } = await supabase
      .from("roadmap_profiles")
      .upsert({
        user_id: user.id,
        ...roadmap,
        last_generated: new Date().toISOString(),
      });

    if (upsertError) {
      console.error("ROADMAP UPSERT ERROR:", upsertError);
      return NextResponse.json(
        { error: "Failed to save roadmap." },
        { status: 500 }
      );
    }

    return NextResponse.json({ roadmap }, { status: 200 });
  } catch (e: any) {
    console.error("ROADMAP API ERROR:", e);
    return NextResponse.json(
      { error: e.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
