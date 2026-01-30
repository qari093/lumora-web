import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    setupFiles: ["tests/vitest.setup.ts"],
    environment: "jsdom",
    globals: true,
    restoreMocks: true,
    clearMocks: true,
  },
});
