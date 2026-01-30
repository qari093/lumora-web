import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton for Next.js (dev hot-reload safe) + Vitest-safe.
 * - Provides BOTH: `export const prisma` and `export default prisma`
 * - Never throws at import time due to DATABASE_URL issues; errors occur on query.
 * - Ensures a deterministic SQLite fallback when DATABASE_URL is missing/blank.
 *
 * Note: Prisma reads DATABASE_URL at client creation time. We compute a fallback
 * early to avoid "db_unavailable" in local/dev contexts.
 */

declare global {
  // eslint-disable-next-line no-var
  var __lumora_prisma__: PrismaClient | undefined;
}

function isNonEmpty(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

function absoluteFileUrl(path: string): string {
  // Prisma SQLite file URL format: file:/absolute/path/to/dev.db
  // Ensure exactly one leading slash after file:
  if (path.startsWith("/")) return `file:${path}`;
  return `file:/${path}`;
}

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (isNonEmpty(envUrl)) return envUrl.trim();

  // Default: repo-local dev.db to keep local/dev and basic tests working.
  // (Vitest can override by setting process.env.DATABASE_URL before imports.)
  const cwd = process.cwd(); // expected repo root in runtime
  const devDbPath = `${cwd}/prisma/dev.db`;
  return absoluteFileUrl(devDbPath);
}

function ensureDatabaseUrl() {
  if (!isNonEmpty(process.env.DATABASE_URL)) {
    process.env.DATABASE_URL = resolveDatabaseUrl();
  }
}

export function getPrisma(): PrismaClient {
  ensureDatabaseUrl();

  if (globalThis.__lumora_prisma__) return globalThis.__lumora_prisma__;

  // Create client once. Do not connect here; connect happens lazily on first query.
  const client = new PrismaClient();

  // Cache globally in dev to survive Next.js hot reload.
  if (process.env.NODE_ENV !== "production") {
    globalThis.__lumora_prisma__ = client;
  }

  return client;
}

export const prisma = getPrisma();
export default prisma;
