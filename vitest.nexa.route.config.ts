import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    environment: "node",
    include: [
      "tests/nexa/nexa_runtime.test.ts",
      "tests/nexa/nexa_metrics.test.ts",
      "tests/nexa/nexa_metrics_route.test.ts",
      "tests/nexa/nexa_diag_route.test.ts",
      "tests/nexa/nexa_info_route.test.ts",
      "tests/nexa/nexa_index_route.test.ts",
      "tests/nexa/middleware_smoke.test.ts",
      "tests/nexa/nexa_validate.test.ts",
      "tests/nexa/nexa_contract.test.ts"
    ],
    globalSetup: [],
    setupFiles: [],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    reporters: ["default"],
  },
});
