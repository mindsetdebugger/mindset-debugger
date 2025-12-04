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

Merge today’s analysis with the existing history summary and generate:
- summary_long (4–7 paragraphs)
- summary_short (80–130 words)
- aggregates
- insights_page
- trends_page

Write everything in second person (“ti”, “tvoje misli”, “kod tebe…”).

Return ONLY VALID JSON:

{
  "summary_long": "...",
  "summary_short": "...",
  "aggregates": { ... },
  "insights_page": { ... },
  "trends_page": { ... }
}

OLD SUMMARY:
${historySummary || "None"}

NEW DAILY ANALYSIS:
${JSON.stringify(analysis)}
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

    // 🟢 FIX: Return full object (not updated_summary)
    return NextResponse.json(
      {
        summary_long: json.summary_long,
        summary_short: json.summary_short,
        aggregates: json.aggregates,
        insights_page: json.insights_page,
        trends_page: json.trends_page
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
