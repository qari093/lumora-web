import { describe, expect, it } from "vitest";
import { pickReaction, pickReactionVariant, reactionCode } from "../../src/lib/persona/reactionMatrix";

describe("persona reactionMatrix", () => {
  it("is deterministic for same emotion+seed", () => {
    const a = pickReaction("happy", "seed-1");
    const b = pickReaction("happy", "seed-1");
    expect(a).toBe(b);
  });

  it("variant is deterministic for same seed", () => {
    const a = pickReactionVariant("seed-1");
    const b = pickReactionVariant("seed-1");
    expect(a).toBe(b);
  });

  it("reactionCode format", () => {
    expect(reactionCode("love", "01")).toBe("rx_love_01");
  });
});
