# Prisma config env loading (Step 1827)

Prisma CLI in **config mode** may print:

> "Prisma config detected, skipping environment variable loading."

That message refers to Prisma’s built-in `.env` auto-loading behavior.
In Lumora, `prisma.config.ts` **explicitly loads** `.env.local` (fallback `.env`)
and ensures `DATABASE_URL` is present to avoid `P1012` during `prisma validate/generate`.

**Dev default (SQLite):**
`DATABASE_URL="file:./prisma/dev.db"`

If you want a different env file for Prisma tooling:
- set `PRISMA_ENV_PATH=/path/to/envfile` before running Prisma.
