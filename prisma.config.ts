import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Step 1818: explicit env loading for Prisma CLI (Prisma config disables auto env loading)
import { existsSync } from "node:fs";
const envPath = existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envPath });


export default defineConfig({
  schema: "prisma/schema.prisma",
});
