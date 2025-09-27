// src/components/sign-out-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const supabase = createSupabaseBrowserClient();
  return (
    <Button variant="outline" onClick={async () => {
      await supabase.auth.signOut();
      location.href = "/login";
    }}>
      Sign out
    </Button>
  );
}