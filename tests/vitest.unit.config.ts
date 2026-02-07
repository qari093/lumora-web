import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    // IMPORTANT: do NOT load repo-wide globalSetup that boots Next
    globalSetup: undefined,
    setupFiles: [],
    include: ["tests/**/*.test.ts", "tests/**/*.spec.ts"],
    exclude: [
      "tests/**/e2e/**",
      "tests/**/_helpers/**",
      "tests/**/next/**",
      "tests/**/integration/**",
    ],
    pool: "threads",
  },
});
