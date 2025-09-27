// src/app/(auth)/login/page.tsx
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

// Comment in or add additional auth methods as desired
export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  // const [email, setEmail] = useState("");

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  };

  // const signInWithGitHub = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: "github",
  //     options: { redirectTo: `${location.origin}/auth/callback` },
  //   });
  //   if (error) toast.error(error.message);
  // };

  // const sendMagicLink = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const { error } = await supabase.auth.signInWithOtp({
  //     email,
  //     options: { emailRedirectTo: `${location.origin}/auth/callback` },
  //   });
  //   if (error) toast.error(error.message);
  //   else toast.success("Check your email for a magic link");
  // };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={signInWithGoogle} className="w-full">
            Continue with Google
          </Button>
          {/* <Button onClick={signInWithGitHub} className="w-full">
            Continue with GitHub
          </Button> */}

          {/* <div className="h-px bg-border" />

          <form className="space-y-3" onSubmit={sendMagicLink}>
            <Label htmlFor="email">Email (magic link)</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full">Email me a link</Button>
          </form> */}
        </CardContent>
      </Card>
    </main>
  );
}
