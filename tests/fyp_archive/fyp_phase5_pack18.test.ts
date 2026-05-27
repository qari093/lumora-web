import { describe, expect, it } from "vitest";
import {
  buildSessionSeed,
  deterministicShuffle,
  attachSessionContext,
  preventSessionRepetition,
  buildSessionPersonalizedFeed,
} from "../../src/lib/fyp_archive/session_personalization";

describe("Phase 5 Pack 18 — Session Personalization", () => {
  const items = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];

  it("builds session seed", () => {
    const seed1 = buildSessionSeed("abc");
    const seed2 = buildSessionSeed("abc");
    expect(seed1).toBe(seed2);
  });

  it("shuffles deterministically", () => {
    const seed = buildSessionSeed("test");
    const a = deterministicShuffle(items, seed);
    const b = deterministicShuffle(items, seed);
    expect(a).toEqual(b);
  });

  it("attaches session context", () => {
    const out = attachSessionContext(items, "s1");
    expect(out[0]).toHaveProperty("sessionRank");
  });

  it("prevents session repetition", () => {
    const history = new Set(["1"]);
    const out = preventSessionRepetition(items, history);
    expect(out.some(x => x.id === "1")).toBe(false);
  });

  it("builds personalized feed", () => {
    const history = new Set(["1"]);
    const out = buildSessionPersonalizedFeed(items, "s1", history);
    expect(out.length).toBeGreaterThan(0);
  });
});
