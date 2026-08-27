import { defineConfig } from 'prisma/config';

import dotenv from 'dotenv';
// Step 1826 — deterministic env load for Prisma CLI (prevents P1012 in config mode)
const __ENV_PATH__ =
  process.env.PRISMA_ENV_PATH || (require('fs').existsSync('.env.local') ? '.env.local' : '.env');
dotenv.config({ path: __ENV_PATH__ });

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for the canonical PostgreSQL Prisma configuration.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
});
