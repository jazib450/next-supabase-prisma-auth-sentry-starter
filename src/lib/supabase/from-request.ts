// src/lib/supabase/from-request.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Explicit type for mutable cookie jar
type MutableCookies = {
  set: (name: string, value: string, options?: CookieOptions) => void;
};

export async function createSupabaseFromRequest(req: Request) {
  const jar = await cookies();
  const auth = req.headers.get("authorization") || undefined; // "Bearer <jwt>"

  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return jar.getAll(); // [{ name, value }, ...]
      },
      // NOTE: use the explicit shape the SSR client passes to us
      setAll(items: { name: string; value: string; options?: CookieOptions }[]) {
        // In Server Components, the cookie jar is read-only; in Route Handlers it's mutable.
        try {
          items.forEach(({ name, value, options }) => {
            // Next 14/15 route handlers support .set(name, value, options)
            if ("set" in jar) (jar as unknown as MutableCookies).set(name, value, options);
          });
        } catch {
          // read-only context -> no-op
        }
      },
    },
    // Pass extra headers here (not at top-level)
    global: auth ? { headers: { Authorization: auth } } : undefined,
  });
}