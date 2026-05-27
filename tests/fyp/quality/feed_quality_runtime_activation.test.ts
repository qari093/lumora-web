import { describe, expect, it } from "vitest";

import { validateFeedQualityInput } from "@/src/core/fyp/quality/contracts/feedQualityContract";
import { calculateFeedQuality } from "@/src/core/fyp/quality/runtime/feedQualityScore";
import { runFeedQualityRuntime } from "@/src/core/fyp/quality/runtime/feedQualityRuntime";

const input = {
  itemId: "item_1",
  watchScore: 100,
  safetyScore: 100,
  freshnessScore: 100,
  duplicateRisk: 0
};

describe("Lumora FYP Feed Quality Runtime Activation", () => {
  it("validates feed quality input", () => {
    expect(validateFeedQualityInput(input)).toBe(true);
  });

  it("calculates excellent feed quality", () => {
    const decision = calculateFeedQuality(input);

    expect(decision.grade).toBe("excellent");
    expect(decision.publishable).toBe(true);
  });

  it("rejects very weak feed quality", () => {
    const decision = calculateFeedQuality({
      ...input,
      watchScore: 0,
      safetyScore: 0,
      freshnessScore: 0,
      duplicateRisk: 100
    });

    expect(decision.grade).toBe("reject");
    expect(decision.publishable).toBe(false);
  });

  it("sorts quality decisions", () => {
    const results = runFeedQualityRuntime([
      input,
      {
        ...input,
        itemId: "item_2",
        watchScore: 10
      }
    ]);

    expect(results[0].itemId).toBe("item_1");
  });

  it("runs feed quality runtime", () => {
    const results = runFeedQualityRuntime([input]);

    expect(results).toHaveLength(1);
    expect(results[0].score).toBeGreaterThan(80);
  });
});
