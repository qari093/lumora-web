import { defineConfig } from "vitest/config";
import path from "node:path";

// Ensure HTTP tests have a base URL (default: local dev port)
process.env.NEXA_BASE_URL = process.env.NEXA_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3040}`;


export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    environment: "node",
    include: [
    "tests/nexa/**/*.test.ts",
      "tests/nexa/nexa_runtime.test.ts",
      "tests/nexa/nexa_metrics.test.ts",
      "tests/nexa/nexa_metrics_route.test.ts",
      "tests/nexa/nexa_diag_route.test.ts",
      "tests/nexa/nexa_info_route.test.ts",
      "tests/nexa/nexa_index_route.test.ts",
      "tests/nexa/middleware_smoke.test.ts",
      "tests/nexa/nexa_validate.test.ts",
      "tests/nexa/nexa_contract.test.ts",
      "tests/nexa/nexa_page_smoke.test.ts"
    ],
    globalSetup: [],
    setupFiles: [],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    reporters: ["default"],
  },
});
