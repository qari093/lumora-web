import { describe, expect, it } from "vitest";
import {
  buildBehaviorAwareFeed,
  buildUserSessionVector,
  detectChurnRisk,
  injectRecoveryClip,
  preventUserFatigue,
  scoreFeedAgainstUser,
} from "../../src/lib/fyp_archive/behavior_memory";

describe("Phase 4 Pack 15 — Behavior Memory", () => {
  const feed = [
    { id: "1", query: "crowd", humanScore: 0.5 },
    { id: "2", query: "crowd", humanScore: 0.5 },
    { id: "3", query: "nature", humanScore: 0 },
    { id: "4", query: "calm", tone: "calm" },
  ];

  const sessionEvents = [
    { type: "watch", value: 10, query: "crowd" },
    { type: "skip" },
    { type: "skip" },
    { type: "skip" },
  ];

  it("builds session vector", () => {
    const s = buildUserSessionVector(sessionEvents);
    expect(s.watchTime).toBe(10);
    expect(s.interest).toContain("crowd");
  });

  it("scores feed against user", () => {
    const s = buildUserSessionVector(sessionEvents);
    const out = scoreFeedAgainstUser(feed, s);
    expect(out[0]).toHaveProperty("userScore");
  });

  it("prevents fatigue repetition", () => {
    const out = preventUserFatigue(feed);
    expect(out.length).toBeLessThan(feed.length);
  });

  it("injects recovery clip", () => {
    const out = injectRecoveryClip(feed);
    expect(out.some((x: any) => x.recovery)).toBe(true);
  });

  it("detects churn risk", () => {
    const s = buildUserSessionVector(sessionEvents);
    expect(detectChurnRisk(s)).toBe(true);
  });

  it("builds behavior aware feed", () => {
    const s = buildUserSessionVector(sessionEvents);
    const out = buildBehaviorAwareFeed(feed, s);
    expect(out.length).toBeGreaterThan(0);
  });
});
