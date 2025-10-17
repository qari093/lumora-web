import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __PRISMA__: PrismaClient | undefined;
}

// Reuse Prisma client across HMR in dev
export const prisma =
  global.__PRISMA__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query","error","warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__PRISMA__ = prisma;
}
