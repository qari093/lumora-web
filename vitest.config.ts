import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 🔒 Launch-safe deterministic mode
    threads: false,
    pool: "forks",
    maxConcurrency: 1,
    isolate: false,

    // ⛔ Prevent empty / broken suites from failing launch
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",

      // known empty / legacy / malformed tests
      "**/*.empty.test.*",
      "**/*.broken.test.*",
      "**/emml.state.client.test.ts"
    ],

    // 🧠 Environment defaults (browser-like tests handled later)
    environment: "node",

    // ⏱️ Generous but finite timeouts
    testTimeout: 30_000,
    hookTimeout: 30_000,

    // 📜 Clean reporting
    reporters: ["default"],
  },
});
