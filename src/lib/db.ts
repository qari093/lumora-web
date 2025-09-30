import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.__prisma ?? new PrismaClient();
if (!globalThis.__prisma) globalThis.__prisma = prisma;

export default prisma;
