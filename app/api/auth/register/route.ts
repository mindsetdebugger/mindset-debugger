import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user = data.user;
  if (!user) {
    return NextResponse.json({ error: "Sign-up failed" }, { status: 400 });
  }

  // INSERT INTO user_profiles
  await supabase.from("user_profiles").insert({
    user_id: user.id,
    email,
    name: email.split("@")[0],
    avatar_url: null,
  });

  return NextResponse.json({ user });
}
