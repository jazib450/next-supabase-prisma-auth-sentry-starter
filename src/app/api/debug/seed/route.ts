import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Dummy user id (UUID).
const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000000";

export async function POST() {
  const convo = await prisma.conversation.create({
    data: { userId: DUMMY_USER_ID, title: "First conversation" },
  });

  await prisma.message.create({
    data: {
      conversationId: convo.id,
      userId: DUMMY_USER_ID,
      role: "user",
      content: "Hello?",
    },
  });

  await prisma.message.create({
    data: {
      conversationId: convo.id,
      userId: DUMMY_USER_ID,
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