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
You are Mindset Debugger™, an advanced cognitive–emotional analysis engine.

Write everything in SECOND PERSON (“ti”, “tvoje misli…”).
Return ONLY VALID JSON.
No markdown. No explanations. No nulls.

====================================================
RESPONSE FORMAT:
====================================================
{
  "summary": "...",

  "emotions": {
    "primary": [{ "emotion": "...", "intensity": 0 }],
    "secondary": [{ "emotion": "...", "intensity": 0 }],
    "body_sensations": ["..."],
    "emotion_direction": "rising|falling|stable",
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
      "type": "fact|interpretation|fear_projection",
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
    "energy_trend": "up|down|neutral",
    "motivation_trend": "up|down|neutral"
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
    "category": "stress|fear|motivation|relationships|identity|growth|burnout|uncertainty|frustration|overwhelm|sadness|mixed"
  },

  "behavioural_profile": {
    "avoidance_tendencies": "...",
    "emotional_response_style": "...",
    "decision_making_bias": "...",
    "activation_level": 0
  },

  "coaching_recommendations": {
    "focus_for_today": "...",
    "focus_for_tomorrow": "...",
    "optimal_strategy": "...",
    "motivation_driver": "...",
    "energy_management": "..."
  },

  "progress_tracking": {
    "consistency_score": 0,
    "streak_days": 0,
    "recent_wins": ["..."],
    "areas_to_improve": ["..."]
  }
}

====================================================
COACHING RULES:
====================================================
- "today_micro_step" ≤ 15 words, super konkretan, izvediv u < 2 minute.
- "ai_insight_today" = 2–4 guste rečenice.
- Polja u "coaching_recommendations" neka budu 2–3 rečenice – konkretan, topao i usmjeren savjet.
- SVE piši u drugom licu (“ti…”, “kod tebe…”).
- Nema praznih polja, nema null.

====================================================
INPUT CONTEXT:
====================================================

USER HISTORY SUMMARY:
${historySummary || "None"}

ENTRY:
${text}
`;

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "system", content: "Return ONLY raw JSON." },
        { role: "user", content: prompt },
      ],
    });

    const raw = (response as any).output[0].content[0].text;
    const json = JSON.parse(raw);

    return NextResponse.json({ success: true, analysis: json }, { status: 200 });
  } catch (err: any) {
    console.error("ANALYZE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
