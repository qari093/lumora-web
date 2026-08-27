import { defineConfig } from "vitest/config";
import path from "node:path";

const MEGA19_HAS_SAFE_TEST_DATABASE =
  /^postgres(?:ql)?:\/\//.test(
    process.env.TEST_DATABASE_URL?.trim() || ""
  );

export default defineConfig({
  esbuild: { jsx: "automatic" },
resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {


      teardownTimeout: 30000,reporters: ['default', 'hanging-process'],
exclude: ["**/.lumora-legacy-tests/**", "**/.quarantine/**", "**/.lumora-recovery/**", "**/backups/**", "**/node_modules/**", "**/.next/**",
      "**/tests/browser/**",
      "**/*.production-smoke.spec.ts",
      ...(!MEGA19_HAS_SAFE_TEST_DATABASE
        ? ["**/tests/wallet/wallet_api_smoke.test.ts"]
        : []),
    ],

    pool: "forks",

    globalSetup: 'tests/_helpers/vitest.global.setup.ts',
hookTimeout: 120000,
    testTimeout: 120000,

    environment: "jsdom",
    globals: true,
    restoreMocks: true,
    clearMocks: true,
  },
});
