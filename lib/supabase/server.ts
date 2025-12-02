import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function supabaseServer() {
  const cookieStore = cookies(); // returns RequestCookies

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          try {
            return cookieStore.get(name)?.value;
          } catch {
            return undefined;
          }
        },
        set: () => {
          // Next.js 14 server components CANNOT set cookies here.
          // Supabase will fallback safely.
        },
        remove: () => {
          // Same here – server components cannot delete cookies.
        },
      },
    }
  );
}
