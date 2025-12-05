// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // 1) signup na serveru → postavlja sb cookies
    const supabase = await supabaseServer();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const user = data.user;
    if (!user) {
      return NextResponse.json(
        { error: "User not returned from signUp" },
        { status: 400 }
      );
    }

    // 2) admin client za user_profiles (service role key)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: insertError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        user_id: user.id,
        email,
        name: email.split("@")[0],
        avatar_url: null,
      });

    if (insertError) {
      console.error("PROFILE INSERT ERROR:", insertError);
      // ne blokiramo usera zbog ovoga
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
