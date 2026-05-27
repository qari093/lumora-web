import { describe, expect, it } from "vitest";

import { calculateCalmDividend } from "../../src/core/lumexa/economy/calmDividends";

describe("Lumexa Zen Economy", () => {
  it("calculates calm dividend", () => {
    const result = calculateCalmDividend(100);

    expect(result.rebate).toBeGreaterThan(0);
  });
});
