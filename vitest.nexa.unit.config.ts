import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "tests/nexa/**/*.test.ts",
    ],
    // No globalSetup: avoid Next test server boot (which is failing in your env)
    globalSetup: [],
    setupFiles: [],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    reporters: ["default"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
