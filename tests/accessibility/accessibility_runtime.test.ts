import { describe, expect, it } from "vitest";

describe("accessibility runtime", () => {
  it("enables accessibility runtime", async () => {
    const mod = await import("@/core/accessibility/runtime");
    expect(mod.accessibilityRuntimeEnabled).toBe(true);
  });
});
