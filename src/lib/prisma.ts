import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = typeof globalThis & { _prisma?: PrismaClient };
const g = globalThis as GlobalWithPrisma;

export const prisma: PrismaClient = g._prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  g._prisma = prisma;
}

// Support both `import { prisma } ...` and `import prisma ...`
export default prisma;
