// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// 1) Extend the global object with a prisma slot (typed).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 2) Reuse an existing client if present, otherwise create one.
//    - In dev: after the first creation, we stash it on globalForPrisma.prisma
//    - In prod: modules aren't reloaded, so one new PrismaClient() is fine.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Optional: see queries in dev; keep prod logs minimal.
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 3) In dev, cache it on global to survive Hot Module Reloading.
//    In prod we skip caching to keep the environment clean.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;