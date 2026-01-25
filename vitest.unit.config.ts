import { defineConfig, mergeConfig } from "vitest/config";
import base from "./vitest.config";

export default mergeConfig(
  // @ts-expect-error - base config typing varies by vitest version
  base,
  defineConfig({
    test: {
      name: "unit",
      // Unit-only allowlist by exclusion (server-dependent suites are excluded)
      exclude: [
      "tests/**/api.*.spec.ts",
      "tests/**/security_*.*",
      "tests/**/portals_*.*",
      "tests/**/middleware_*.*",
      "tests/**/health_*.*",
      "**/*.e2e.test.ts",
      "**/*.contract.test.ts",
        "**/node_modules/**",
        "**/.next/**",
        "**/dist/**",
        "tests/live/**",
        "tests/health/**",
        "tests/security/**",
        "tests/portals/**",
        "tests/performance/**",
        "tests/api.*.spec.ts",
        "tests/**/**.e2e.test.ts",
        "tests/**/**.integration.test.ts",
      ],
    },
  })
);
