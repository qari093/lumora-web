import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  
  teardownTimeout: 30000,
resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    
    reporters: ['default', 'hanging-process'],
exclude: ['**/.quarantine/**'],
    singleThread: true,
    pool: "forks",
    setupFiles: ["tests/_helpers/vitest.global.setup.ts"],
    
    globalSetup: 'tests/_helpers/vitest.global.setup.ts',
hookTimeout: 120000,
    testTimeout: 120000,
    
    environment: "jsdom",
    globals: true,
    restoreMocks: true,
    clearMocks: true,
  },
});
