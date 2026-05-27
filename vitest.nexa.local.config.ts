import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".")
    }
  },
  test: {
    environment: "node",
    globals: true,
    setupFiles: [],
    globalSetup: [],
    include: ["tests/nexa/**/*.test.ts"]
  }
});
