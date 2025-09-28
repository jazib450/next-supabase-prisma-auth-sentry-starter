// src/app/(protected)/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DemoForm from "@/components/demo-form";
import { SignOutButton } from "@/components/sign-out-button";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // avoid stale caching

export default async function ProtectedHome() {
  const supabase = await createSupabaseServerClient();

  // Use the same source of truth as the layout
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="flex items-center justify-center min-h-screen bg-background relative">
      {/* small signed-in indicator in the corner */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <SignOutButton />
      </div>
      
      <DemoForm />
    </main>
  );
}