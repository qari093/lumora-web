import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/zencoin/**/*.test.ts"],
    setupFiles: [],
    globalSetup: [],
    testTimeout: 15000,
    hookTimeout: 15000
  },
  resolve: {
    alias: {
      "@": process.cwd() + "/src"
    }
  }
});
