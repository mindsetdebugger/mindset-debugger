import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { text, historySummary } = await req.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Entry is too short." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // ------------------------------------------------------------
    //  FULL DEEP ANALYSIS PROMPT (with mindset_score + insight)
    // ------------------------------------------------------------
    const prompt = `
You are Mindset Debugger™, an advanced cognitive analysis engine.

Analyze the user's entry deeply.  
Return ONLY VALID JSON.  
NO markdown.  
EVERY field must exist and be filled (no nulls).

JSON STRUCTURE:
{
  "summary": "...",

  "emotions": {
    "primary": [{ "emotion": "...", "intensity": 0 }],
    "secondary": [{ "emotion": "...", "intensity": 0 }],
    "body_sensations": ["..."]
  },

  "cognitive_patterns": [
    { "name": "...", "score": 0, "explanation": "..." }
  ],

  "micro_thoughts": {
    "core_thought": "...",
    "supporting_thoughts": ["..."],
    "hidden_assumptions": ["..."],
    "emotional_statements": ["..."]
  },

  "sentence_scan": [
    {
      "sentence": "...",
      "type": "fact" | "interpretation" | "fear_projection",
      "emotion": "...",
      "pattern": "...",
      "notes": "..."
    }
  ],

  "root_cause": "...",

  "reframes": {
    "stoic": "...",
    "cognitive_behavioral_therapy": "...",
    "logic": "...",
    "self_compassion": "...",
    "growth_mindset_reframe" : "...",
    "meta_perspective_reframe" : "...",
    "action_reframe" : "...",
    "values_based_reframe" : "..."
  },

"actions": {
  "today_micro_step": "...",
  "momentum_builder": "...",
  "avoid_this": "...",
  "this_week_focus": "..."
}

  "mindset_score": 0,
  "ai_insight_today": "...",

  "tags": ["..."],

  "meta": {
    "analysis_confidence": 0.0,
    "distress_level": 0
  }
}

RULES:
- "mindset_score" MUST be an integer 0–100.
- "ai_insight_today" MUST be 2–4 sentences, short, high-value, emotionally intelligent.
- No markdown.
- No extra text.

USER HISTORY SUMMARY:
${historySummary || "None"}

ENTRY:
${text}
`;

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "system", content: "Return ONLY raw JSON. No markdown." },
        { role: "user", content: prompt }
      ],
    });

    const raw = response.output[0].content[0].text;
    const json = JSON.parse(raw);

    return NextResponse.json(
      {
        success: true,
        analysis: json,
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("ANALYZE ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
