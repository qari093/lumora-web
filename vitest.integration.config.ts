import { defineConfig, mergeConfig } from "vitest/config";
import base from "./vitest.config";

export default mergeConfig(
  // @ts-expect-error - base config typing varies by vitest version
  base,
  defineConfig({

  poolOptions: {
    threads: { minThreads: 1, maxThreads: 1 },
    forks: { minForks: 1, maxForks: 1 },
  },
    test: {
      name: "integration",
      // Integration suite runs everything (unit + integration),
      // but it will be executed ONLY through the dedicated runner.
    },
  })
);
