import { describe, expect, it } from "vitest";
import {
  adjustFeedBiasWithinSession,
  buildLightweightSessionFeedback,
  trackDwellTime,
  trackSessionPreferences,
  trackSkipRate,
} from "../../src/lib/fyp_archive/session_feedback";

describe("Phase 6 Pack 20 — Lightweight Session Feedback", () => {
  const events = [
    { clipId: "1", query: "crowd", action: "watch", dwellMs: 5000 },
    { clipId: "2", query: "crowd", action: "like", dwellMs: 3000 },
    { clipId: "3", query: "nature", action: "skip", dwellMs: 500 },
  ] as const;

  const feed = [
    { id: "a", query: "nature" },
    { id: "b", query: "crowd" },
  ];

  it("tracks dwell time", () => {
    expect(trackDwellTime([...events])).toBe(8500);
  });

  it("tracks skip rate", () => {
    expect(trackSkipRate([...events])).toBeGreaterThan(0);
  });

  it("tracks session preferences", () => {
    const prefs = trackSessionPreferences([...events]);
    expect(prefs[0].key).toBe("crowd");
  });

  it("adjusts feed bias within session", () => {
    const prefs = trackSessionPreferences([...events]);
    const out = adjustFeedBiasWithinSession(feed, prefs);
    expect(out[0].query).toBe("crowd");
  });

  it("builds feedback payload without long-term profiling", () => {
    const out = buildLightweightSessionFeedback(feed, [...events]);
    expect(out.longTermProfiling).toBe(false);
    expect(out.feed[0].query).toBe("crowd");
  });
});
