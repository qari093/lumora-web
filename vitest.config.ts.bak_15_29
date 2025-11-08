import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup/vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["app/_state/**/*.ts"],
      exclude: [
        "app/**/api/**",
        "app/**/server/**",
        "app/**/lib/**",
        "app/**/modules/**",
        "app/**/components/**",
        "app/**/route.ts",
        "app/**/routes/**",
        "app/**/layout.tsx",
        "app/**/page.tsx",
        "app/**/*.tsx"
      ]
    }
  }
});
