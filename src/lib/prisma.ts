/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "error", emit: "event" },
    { level: "warn", emit: "event" },
    { level: "info", emit: "event" },
  ],
});

// 👇 kasih cast biar TS ngerti
(prisma as any).$on("query", (e: Prisma.QueryEvent) => {
  console.log("🟢 [QUERY]");
  console.log("SQL:", e.query);
  console.log("Params:", e.params);
  console.log("Duration:", e.duration + "ms");
});

(prisma as any).$on("error", (e: Prisma.LogEvent) => {
  console.error("❌ [ERROR]", e.message);
});

(prisma as any).$on("warn", (e: Prisma.LogEvent) => {
  console.warn("⚠️ [WARN]", e.message);
});

(prisma as any).$on("info", (e: Prisma.LogEvent) => {
  console.info("ℹ️ [INFO]", e.message);
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma