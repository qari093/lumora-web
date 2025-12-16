import { defineConfig } from "prisma/config";

import dotenv from "dotenv";
// Step 1826 — deterministic env load for Prisma CLI (prevents P1012 in config mode)
const __ENV_PATH__ = process.env.PRISMA_ENV_PATH || (require("fs").existsSync(".env.local") ? ".env.local" : ".env");
dotenv.config({ path: __ENV_PATH__ });
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
});
