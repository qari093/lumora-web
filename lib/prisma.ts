/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

// Prevent hot-reload from creating new PrismaClient instances in dev.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export { prisma };
export default prisma;
