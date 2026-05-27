import { describe, expect, it } from "vitest";

import { resolveRibbonPortal } from "../../src/core/lumexa/navigation/gradientRibbon";

describe("Lumexa Gradient Ribbon", () => {
  it("routes toward portal", () => {
    expect(resolveRibbonPortal(0.8).portal).toBe("live");
  });
});
