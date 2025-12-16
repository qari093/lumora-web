# Prisma config note (Config Mode)

This is Prisma CLI behavior in config mode.
It does NOT mean environment variables are unavailable to the app.

Schema validation (P1012) fails only if DATABASE_URL is missing at Prisma CLI runtime.

Required for local dev (SQLite):
- DATABASE_URL="file:./prisma/dev.db" in .env.local OR .env OR shell env

Enforcement in this repo:
prisma.config.ts loads env before schema is read.

This guarantees:
- npx prisma validate
- npx prisma generate
- npx prisma migrate status
do not fail in dev.

Operator check:
Run: npx prisma validate
