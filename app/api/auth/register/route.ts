import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Create profile
  await supabase.from("profiles").upsert({
    id: data.user.id,
    email,
    name: email.split("@")[0],
  });

  return NextResponse.json({ user: data.user });
}
