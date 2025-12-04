// middleware.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: any) {
  const res = NextResponse.next();

  // 🔥 Create Supabase client using cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set(name, value, options);
        },
        remove: (name, options) => {
          res.cookies.delete(name, options);
        },
      },
    }
  );

  // ================================
  // 1️⃣ Get session
  // ================================
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ================================
  // 2️⃣ Identify routes
  // ================================
  const pathname = req.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");

  // ================================
  // 3️⃣ If session exists → validate user
  // ================================
  if (session) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ❗ If tokens exist but user was deleted (e.g., table wiped)
    // → remove tokens and redirect to login
    if (!user) {
      res.cookies.delete("sb-access-token");
      res.cookies.delete("sb-refresh-token");

      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Authenticated user trying to access /auth page → redirect to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return res;
  }

  // ================================
  // 4️⃣ No session → protect dashboard
  // ================================
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
