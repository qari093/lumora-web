import { describe, expect, it } from "vitest";

import { resolveStabilityWindow } from "../../src/core/lumexa/stability/stabilityWindows";

describe("Lumexa Stability Windows", () => {
  it("protects stability", () => {
    const result = resolveStabilityWindow(8);

    expect(result.stable).toBe(false);
  });

  it("maintains calm window", () => {
    const result = resolveStabilityWindow(1);

    expect(result.durationMs).toBeGreaterThan(100000);
  });
});
