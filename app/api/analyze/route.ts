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

    const prompt = `
You are Mindset Debugger™, an advanced cognitive analysis engine.

Analyze the user's entry deeply using:
- cognitive science
- emotional analytics
- behavioral psychology
- motivation science
- pattern detection
- long-term emotional trend modeling

Write the entire analysis in SECOND PERSON (“ti”, “tvoje misli…”, “kod tebe…”).

Return ONLY VALID JSON.
NO markdown.
NO explanations.
EVERY field must be present. No nulls.

====================================================
ACTION LOGIC RULES:
====================================================
- "today_micro_step" MUST be 1 behavioural instruction, ≤ 15 words, doable in under 2 minutes.
- Must begin with an action verb (“Napravi…”, “Udahni…”, “Uzmi 1 minutu za…”).
- "tomorrow_focus" = 1 clear direction you need to follow.
- "potential_pitfall" = subtle trap you often fall into.
- "supportive_mindset" = 1–2 warm sentences addressed to YOU.
- "ai_insight_today" = 2–4 dense sentences.

====================================================
JSON STRUCTURE:
====================================================
{
  "summary": "...",

  "emotions": {
    "primary": [{ "emotion": "...", "intensity": 0 }],
    "secondary": [{ "emotion": "...", "intensity": 0 }],
    "body_sensations": ["..."],
    "emotion_direction": "rising | falling | stable",
    "emotion_regulation_capacity": 0
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

  "insight_clusters": {
    "emotional_themes": ["..."],
    "thinking_trends": ["..."],
    "common_triggers": ["..."],
    "growth_signals": ["..."],
    "protective_factors": ["..."],
    "vulnerabilities": ["..."]
  },

  "reframes": {
    "stoic": "...",
    "cognitive_behavioral_therapy": "...",
    "logic": "...",
    "self_compassion": "...",
    "growth_mindset_reframe": "...",
    "meta_perspective_reframe": "...",
    "action_reframe": "...",
    "values_based_reframe": "..."
  },

  "actions": {
    "today_micro_step": "...",
    "tomorrow_focus": "...",
    "potential_pitfall": "...",
    "supportive_mindset": "..."
  },

  "trends": {
    "short_term_patterns": ["..."],
    "long_term_patterns": ["..."],
    "energy_trend": "up | down | neutral",
    "motivation_trend": "up | down | neutral"
  },

  "stats": {
    "emotional_stability_score": 0,
    "motivation_score": 0,
    "stress_marker": 0,
    "resilience_marker": 0,
    "clarity_score": 0
  },

  "mindset_score": 0,
  "ai_insight_today": "...",

  "tags": ["..."],

  "meta": {
    "analysis_confidence": 0.0,
    "distress_level": 0,
    "category": "stress | fear | motivation | relationships | identity | growth | burnout | uncertainty | frustration | overwhelm | sadness | mixed"
  }
}

====================================================
RULES:
- No markdown
- No null fields
- All numbers 0–100
- Write everything in SECOND PERSON
====================================================

USER HISTORY SUMMARY:
${historySummary || "None"}

ENTRY:
${text}
`;

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "system", content: "Return ONLY raw JSON" },
        { role: "user", content: prompt }
      ],
    });

    const raw = response.output[0].content[0].text;
    const json = JSON.parse(raw);

    return NextResponse.json(
      { success: true, analysis: json },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("ANALYZE ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
