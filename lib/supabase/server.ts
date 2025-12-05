// lib/supabase/server.ts
import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServer() {
  // neki runtimovi vraćaju promise, neki objekt → ovo hendla oba
  const cookieStoreMaybe: any = cookies();
  const cookieStore =
    typeof cookieStoreMaybe?.then === "function"
      ? await cookieStoreMaybe
      : cookieStoreMaybe;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}
