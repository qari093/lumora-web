import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    singleThread: true,
    pool: "forks",
    setupFiles: ["tests/_helpers/vitest.global.setup.ts"],
    
    globalSetup: ["./tests/_helpers/vitest.globalSetup.ts"],
hookTimeout: 120000,
    testTimeout: 120000,
    
    environment: "jsdom",
    globals: true,
    restoreMocks: true,
    clearMocks: true,
  },
});
