import { describe, expect, it } from "vitest";
import { emotionalSignal } from "@/src/core/fyp-intelligence/emotion/emotionalSignal";
import { rankWeight } from "@/src/core/fyp-intelligence/ranking/rankWeight";
import { trustGate } from "@/src/core/fyp-intelligence/trust/trustGate";

describe("fyp intelligence discovery", () => {
  it("creates usable emotional signal", () => {
    expect(emotionalSignal(0.7).confidence).toBe("usable");
  });

  it("weights ranking", () => {
    expect(rankWeight(0.8, 0.6)).toBe(74);
  });

  it("gates low trust", () => {
    expect(trustGate(0.3).allowed).toBe(false);
  });
});
