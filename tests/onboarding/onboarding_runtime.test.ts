import { describe, expect, it } from "vitest";

describe("onboarding runtime", () => {
  it("enables onboarding runtime", async () => {
    const mod = await import("@/core/onboarding/runtime");
    expect(mod.onboardingRuntimeEnabled).toBe(true);
  });
});
