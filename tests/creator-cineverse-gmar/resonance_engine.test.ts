import { describe, expect, it } from "vitest";
import { createResonanceSignal } from "@/lib/creator/resonanceEngine";

describe("creator resonance", () => {
  it("creates emotional creator signal", () => {
    const result = createResonanceSignal("creator-1", 4);

    expect(result.publicCountersVisible).toBe(false);
    expect(result.emotionalImpact).toBeGreaterThan(0);
  });
});
