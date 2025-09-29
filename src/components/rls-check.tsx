// src/components/rls-check.tsx
"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Conversation = {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  id: string;
  conversationId: string;
  userId: string;
  role: "system" | "user" | "assistant";
  content: string;
  createdAt: string;
};

export default function RlsCheck() {
  const supabase = createSupabaseBrowserClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [convos, setConvos] = useState<Conversation[] | null>(null);
  const [msgs, setMsgs] = useState<Message[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) { setErr(userErr.message); setLoading(false); return; }
      if (!user) { setErr("Not signed in"); setLoading(false); return; }
      setUserId(user.id);

      const { data: c, error: ce } = await supabase
        .from("Conversation")
        .select("*")
        .order("createdAt", { ascending: true });
      if (ce) { setErr(ce.message); setLoading(false); return; }
      setConvos(c ?? []);

      const { data: m, error: me } = await supabase
        .from("Message")
        .select("*")
        .order("createdAt", { ascending: true });
      if (me) { setErr(me.message); setLoading(false); return; }
      setMsgs(m ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Auto-load on mount
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>RLS Check (dev-only)</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {userId ? `userId: ${userId}` : "no session"}
          </span>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {err && <p className="text-sm text-red-500">Error: {err}</p>}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium mb-2">Conversations</p>
            <pre className="text-xs whitespace-pre-wrap bg-muted p-3 rounded">
              {JSON.stringify(convos, null, 2)}
            </pre>
          </div>
          <div>
            <p className="font-medium mb-2">Messages</p>
            <pre className="text-xs whitespace-pre-wrap bg-muted p-3 rounded">
              {JSON.stringify(msgs, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}