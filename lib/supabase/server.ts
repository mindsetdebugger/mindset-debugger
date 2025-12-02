import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function supabaseServer() {
  const cookieStore = cookies();

  function safeGet(name: string) {
    try {
      // Next.js 14/15/16 API
      const direct = cookieStore.get(name);
      if (direct) return direct.value;

      // fallback za edge runtimes
      const all = cookieStore.getAll();
      const found = all.find((c) => c.name === name);
      return found?.value;
    } catch {
      return undefined;
    }
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return safeGet(name);
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            /* ignore edge writes */
          }
        },
        remove(name, options) {
          try {
            cookieStore.delete({ name, ...options });
          } catch {
            /* ignore */
          }
        },
      },
    }
  );
}
