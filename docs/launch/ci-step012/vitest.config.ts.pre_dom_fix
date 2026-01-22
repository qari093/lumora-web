import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Ensure repo-root discovery regardless of prior 'root' mutations
    root: ".",
    environment: "node",

    // Broad include so explicit file args + discovery runner always work
    include: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
      "tests/**/*.spec.ts",
      "tests/**/*.spec.tsx",
    ],

    // Keep build artifacts + quarantine out of discovery
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.quarantine/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
  },
});
