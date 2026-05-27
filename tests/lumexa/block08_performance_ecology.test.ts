import { describe, expect, it } from "vitest";

import { resolvePerformanceTier } from "../../src/core/lumexa/performance/performanceEcology";

describe("Lumexa Performance Ecology", () => {
  it("degrades safely", () => {
    const result = resolvePerformanceTier(0.1, 0.9);

    expect(result.tier).toBe("low");
  });
});
