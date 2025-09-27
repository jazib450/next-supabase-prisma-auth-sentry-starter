// src/app/api/debug/session/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  // Disable outside local dev (Vercel sets NODE_ENV=production for preview/prod)
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Disabled" }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!session) return NextResponse.json({ error: "No session" }, { status: 401 });

  return NextResponse.json({
    access_token: session.access_token,
    expires_at: session.expires_at,
    user: { id: session.user.id, email: session.user.email },
  });
}