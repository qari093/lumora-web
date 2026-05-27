import { describe, expect, it } from "vitest";

import { createRuntimeState } from "@/src/core/lumexa/runtime/runtimeCore";
import { resolveAtmosphericConfidence } from "@/src/core/lumexa/runtime/confidenceLayer";

describe("Lumexa Block 01", () => {
  it("creates runtime", () => {
    const state = createRuntimeState();
    expect(state.mode).toBe("neutral");
  });

  it("neutralizes weak confidence", () => {
    expect(resolveAtmosphericConfidence(0.1)).toBe("neutralize");
  });

  it("adapts strong confidence", () => {
    expect(resolveAtmosphericConfidence(0.9)).toBe("adapt");
  });
});
