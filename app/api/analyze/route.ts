import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { error: "Text is too short" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const prompt = `
You are a mindset analysis assistant.
Return STRICT JSON with this exact structure:

{
  "emotion": "...",
  "summary": "...",
  "biases": ["...", "..."],
  "recommendation": "..."
}

Entry:
${text}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "Return ONLY valid JSON, no markdown."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // Extract text from Responses API
    const raw = response.output[0].content[0].text;

    const json = JSON.parse(raw);

    return NextResponse.json({
      success: true,
      analysis: json,
    });

  } catch (err: any) {
    console.error("ANALYZE ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
