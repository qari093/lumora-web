import { describe, expect, it } from "vitest";

describe("civilization runtime", () => {
  it("enables civilization runtime", async () => {
    const mod = await import("@/core/civilization/runtime");
    expect(mod.civilizationRuntimeEnabled).toBe(true);
  });

  it("enables protocol evolution runtime", async () => {
    const mod = await import("@/core/protocol/runtime");
    expect(mod.protocolEvolutionRuntimeEnabled).toBe(true);
  });
});
