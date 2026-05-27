import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __lumora_prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__lumora_prisma__ ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__lumora_prisma__ = prisma;
}

export default prisma;
