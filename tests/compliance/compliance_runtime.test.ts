import { describe, expect, it } from "vitest";

describe("compliance runtime", () => {
  it("enables compliance runtime", async () => {
    const mod = await import("@/core/compliance/runtime");
    expect(mod.complianceRuntimeEnabled).toBe(true);
  });
});
