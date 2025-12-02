"use server";

import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";

export async function analyzeEntry(text: string) {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const prompt = `
Analyze the following reflection and extract:
1) Top 3 dominant emotions with percentages
2) 1-sentence summary
3) List of cognitive biases
4) Recommendation for improvement
5) A mindset score from 1–100

Text:
"${text}"
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const result = completion.choices[0].message.content || "";

  // Parse JSON-like output (možemo kasnije preciznije ako želiš)
  const parsed = {
    emotion: result.match(/Emotions:\s*(.*)/)?.[1] || "",
    summary: result.match(/Summary:\s*(.*)/)?.[1] || "",
    biases: result.match(/Biases:\s*(.*)/)?.[1]?.split(",") || [],
    recommendation: result.match(/Recommendation:\s*(.*)/)?.[1] || "",
    score: parseInt(result.match(/Score:\s*(\d+)/)?.[1] ?? "70"),
  };

  // save to DB
  await supabase.from("entries").insert({
    user_id: user.id,
    content: text,
    ai_emotion: parsed.emotion,
    ai_summary: parsed.summary,
    ai_biases: JSON.stringify(parsed.biases),
    ai_recommendation: parsed.recommendation,
    ai_score: parsed.score,
  });

  return parsed;
}
