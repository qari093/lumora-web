import { describe, expect, it } from "vitest";

import { validateMonetizationSignal } from "@/src/core/fyp/monetization/contracts/monetizationContract";
import { evaluateMonetization } from "@/src/core/fyp/monetization/runtime/monetizationPolicy";
import { runMonetizationRuntime } from "@/src/core/fyp/monetization/runtime/monetizationRuntime";

const signal = {
  userId: "user_1",
  itemId: "item_1",
  mode: "native" as const,
  eligible: true,
  value: 0.02
};

describe("Lumora FYP Monetization Runtime Activation", () => {
  it("validates monetization signal", () => {
    expect(validateMonetizationSignal(signal)).toBe(true);
  });

  it("allows eligible monetization", () => {
    const decision = evaluateMonetization(signal);

    expect(decision.allowed).toBe(true);
    expect(decision.mode).toBe("native");
  });

  it("blocks disabled monetization", () => {
    const decision = evaluateMonetization({
      ...signal,
      mode: "disabled"
    });

    expect(decision.allowed).toBe(false);
    expect(decision.estimatedValue).toBe(0);
  });

  it("blocks ineligible monetization", () => {
    const decision = evaluateMonetization({
      ...signal,
      eligible: false
    });

    expect(decision.allowed).toBe(false);
  });

  it("runs monetization runtime", () => {
    const decision = runMonetizationRuntime(signal);

    expect(decision.reason).toBe("eligible");
  });
});
