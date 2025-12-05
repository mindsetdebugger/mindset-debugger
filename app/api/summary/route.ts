import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { historySummary, analysis } = await req.json();

    if (!analysis) {
      return NextResponse.json(
        { error: "Missing analysis object." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const prompt = `
You are Mindset Debugger™, an advanced long-term psychological summarization engine.

Merge TODAY'S ANALYSIS with the EXISTING HISTORY SUMMARY.

Goals:
- update long-term narrative
- track patterns over weeks
- generate coaching layers (daily/weekly/long-term) for the Coach page

Write everything in SECOND PERSON (“ti”, “tvoje misli…”, “kod tebe…”).

Return ONLY VALID JSON:

{
  "summary_long": "...",
  "summary_short": "...",
  "aggregates": {
    "total_entries": 0,
    "avg_mindset_score": 0,
    "dominant_emotions": ["..."],
    "recurring_patterns": ["..."]
  },
  "insights_page": { ... },
  "trends_page": { ... },
  "coach_layers": {
    "daily": {
      "anchor_sentence": "...",
      "reassurance": "...",
      "reminder": "..."
    },
    "weekly": {
      "weekly_theme": "...",
      "weekly_focus_areas": ["..."],
      "weekly_key_actions": ["..."],
      "weekly_pitfall": "...",
      "weekly_supportive_message": "..."
    },
    "long_term": {
      "long_term_direction": "...",
      "long_term_focus_areas": ["..."],
      "skill_building_focus": ["..."],
      "when_you_slip": "..."
    }
  }
}

RULES:
- summary_long = 4–7 odlomaka, narativno, ali jasno strukturirano.
- summary_short = 80–130 riječi.
- coach_layers:
  - sve u drugom licu.
  - weekly_* polja neka budu praktična, kao mini plan tjedna.
  - long_term_* polja neka zvuče kao mentor koji vidi te 3–6 mjeseci unaprijed.
- Nema null. Ako nema dovoljno podataka, koristi neutralne, ali iskrene formulacije.

OLD SUMMARY:
${historySummary || "None"}

NEW DAILY ANALYSIS:
${JSON.stringify(analysis)}
`;

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "system", content: "Return ONLY raw JSON. No markdown." },
        { role: "user", content: prompt },
      ],
    });

    const raw = (response as any).output[0].content[0].text;
    const json = JSON.parse(raw);

    return NextResponse.json(
      {
        summary_long: json.summary_long,
        summary_short: json.summary_short,
        aggregates: json.aggregates,
        insights_page: json.insights_page,
        trends_page: json.trends_page,
        coach_layers: json.coach_layers,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("SUMMARY ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
