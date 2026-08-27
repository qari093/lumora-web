import { defineConfig, mergeConfig } from "vitest/config";
import base from "./vitest.config";

export default mergeConfig(
  base,
  defineConfig({

    test: {
      name: "integration",
      // Integration suite runs everything (unit + integration),
      // but it will be executed ONLY through the dedicated runner.
    },
  })
);
