// src/app/(protected)/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DemoForm from "@/components/demo-form";
import { SignOutButton } from "@/components/sign-out-button";

export default async function ProtectedHome() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("unreachable: layout guards auth");

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