import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import OpenAI from "openai";

// ============================================================================
// 🔵 GET — Fetch existing Compass Profile
// ============================================================================
export async function GET() {
  try {
    const supabase = await supabaseServer();

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

    const { data: compass, error } = await supabase
      .from("compass_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("COMPASS GET ERROR:", error);
      return NextResponse.json(
        { error: "Failed to fetch compass." },
        { status: 500 }
      );
    }

    return NextResponse.json({ compass }, { status: 200 });
  } catch (e: any) {
    console.error("COMPASS GET EXCEPTION:", e);
    return NextResponse.json(
      { error: e.message ?? "Internal error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// 🔴 POST — Generate new Compass Profile with OpenAI
// ============================================================================
export async function POST(req: Request) {
  try {
    // ---------------------------
    // 1) Parse incoming data
    // ---------------------------
    const { analysis } = await req.json();
    if (!analysis) {
      return NextResponse.json(
        { error: "Missing analysis." },
        { status: 400 }
      );
    }

    // ---------------------------
    // 2) AUTH — get user from server Supabase
    // ---------------------------
    const supabase = await supabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated (no Supabase session)." },
        { status: 401 }
      );
    }

    // ---------------------------
    // 3) Fetch history summary
    // ---------------------------
    const { data: summaryRow, error: summaryError } = await supabase
      .from("history_summaries")
      .select("summary_long, aggregates")
      .eq("user_id", user.id)
      .maybeSingle();

    if (summaryError) {
      console.error("SUMMARY FETCH ERROR:", summaryError);
    }

    const summaryLong = summaryRow?.summary_long ?? "None";
    const aggregates = summaryRow?.aggregates ?? {};

    // ---------------------------
    // 4) Build OpenAI prompt
    // ---------------------------
    const prompt = `
You are Mindset Debugger — generate a deep psychological COMPASS profile.

Use:
- Entire long-term summary
- Aggregates
- Today’s analysis

Write EVERYTHING in second person (“ti...”)

Return ONLY JSON:

{
  "core_values": [],
  "default_emotional_style": "",
  "default_thinking_style": "",
  "core_fears": [],
  "core_desires": [],
  "vulnerabilities": [],
  "protective_factors": [],
  "long_term_triggers": [],
  "identity_drivers": [],
  "psychological_formula": "..."
}

SUMMARY:
${summaryLong}

AGGREGATES:
${JSON.stringify(aggregates)}

TODAY ANALYSIS:
${JSON.stringify(analysis)}
`;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // ---------------------------
    // 5) OpenAI call
    // ---------------------------
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [{ role: "user", content: prompt }],
    });

    const raw = response.output[0].content[0].text;
    const json = JSON.parse(raw);

    // ---------------------------
    // 6) Save Compass to DB
    // ---------------------------
    const { error: compassError } = await supabase
      .from("compass_profiles")
      .upsert({
        user_id: user.id,
        ...json,
        updated_at: new Date().toISOString(),
        last_generated: new Date().toISOString(),
      });

    if (compassError) {
      console.error("COMPASS SAVE ERROR:", compassError);
      return NextResponse.json(
        { error: "Failed to save compass." },
        { status: 500 }
      );
    }

    // ---------------------------
    // 7) Return Compass JSON
    // ---------------------------
    return NextResponse.json({ compass: json }, { status: 200 });

  } catch (e: any) {
    console.error("COMPASS POST ERROR:", e);
    return NextResponse.json(
      { error: e.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
