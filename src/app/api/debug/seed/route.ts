// src/app/api/debug/seed/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseFromRequest } from "@/lib/supabase/from-request";

export async function POST(request: Request) {
  // Auth gate
  const supabase = await createSupabaseFromRequest(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convo = await prisma.conversation.create({
    data: { userId: user.id, title: "First conversation" },
  });

  await prisma.message.create({
    data: {
      conversationId: convo.id,
      userId: user.id,
      role: "user",
      content: "Hello?",
    },
  });

  await prisma.message.create({
    data: {
      conversationId: convo.id,
      userId: user.id,
      role: "assistant",
      content: "Hi! 👋",
    },
  });

  const full = await prisma.conversation.findUnique({
    where: { id: convo.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json(full);
}