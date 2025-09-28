// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Explicit type for mutable cookie jar
type MutableCookies = {
  set: (name: string, value: string, options?: CookieOptions) => void;
};

// Next.js 14/15 behavior:
// - In React Server Components (RSC): cookies() is async and the store is read-only.
//   You can read cookies, but .set() will throw since there's no Response to attach headers.
// - In Route Handlers or Middleware: cookies() is mutable. You can set/delete cookies.
// This helper accounts for both by catching .set() errors in read-only contexts.
export async function createSupabaseServerClient() {
  // Next.js 14/15: cookies() may be async
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll(); // [{ name, value }, ...]
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        // In Server Components, cookieStore is read-only; in Route Handlers it's mutable.
        // Try to set; if we're in a read-only context, it will throw—ignore safely.
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // call .set(name, value, options) only when mutable
            if ("set" in cookieStore) (cookieStore as unknown as MutableCookies).set(name, value, options);
          });
        } catch {
          // no-op in read-only contexts
        }
      },
    },
  });
}