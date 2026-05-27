import { describe, expect, it } from "vitest";
import {
  buildHookScore,
  buildRetentionLoopFeed,
  enforceLoopClosure,
  injectCuriosityGap,
  injectHookSequence,
  preventPredictableOrdering,
} from "../../src/lib/fyp_archive/retention_loop";

describe("Phase 4 Pack 14 — Retention Loop", () => {
  const items = [
    { id: "1", title: "calm scene", humanScore: 0 },
    { id: "2", title: "unexpected funny fail reaction", humanScore: 0.5 },
    { id: "3", title: "crowd cheering", humanScore: 0.3 },
  ];

  it("builds hook score", () => {
    expect(buildHookScore(items[1])).toBeGreaterThan(buildHookScore(items[0]));
  });

  it("injects hook sequence", () => {
    const out = injectHookSequence(items);
    expect(out[1].hookSlot).toBe(true);
  });

  it("injects curiosity gap", () => {
    const out = injectCuriosityGap(items);
    expect(out[0].curiosityGap).toBe(true);
  });

  it("prevents predictable ordering", () => {
    const out = preventPredictableOrdering([...items]);
    expect(out.length).toBe(items.length);
  });

  it("enforces loop closure", () => {
    const out = enforceLoopClosure(items);
    expect(out[out.length - 1].loopBack).toBe(items[0].id);
  });

  it("builds retention loop feed", () => {
    const out = buildRetentionLoopFeed(items);
    expect(out.length).toBeGreaterThan(0);
  });
});
