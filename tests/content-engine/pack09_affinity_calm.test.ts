import { describe, expect, it } from "vitest";
import {
  assembleAffinityFeed,
  scoreAffinityMatch,
  selectCalmCandidate,
  shouldInjectCalm,
  updateAffinityVector,
} from "@/src/content-engine/affinity";

describe("Content Engine Pack09 — Affinity Matrix + Calm Injection", () => {
  it("updates affinity vector from hold signals", () => {
    const affinity = updateAffinityVector({}, {
      tags: ["nature", "calm"],
      holdDurationMs: 8000,
      videoDurationMs: 10000,
    });

    expect(affinity.nature).toBe(0.8);
    expect(affinity.calm).toBe(0.8);
  });

  it("applies skip penalty to affinity update", () => {
    const affinity = updateAffinityVector({}, {
      tags: ["chaos"],
      holdDurationMs: 8000,
      videoDurationMs: 10000,
      skipped: true,
    });

    expect(affinity.chaos).toBeLessThan(0.8);
  });

  it("scores affinity match", () => {
    const score = scoreAffinityMatch(
      { contentId: "c1", tags: ["nature", "calm"], durationMs: 15000, resonanceIndex: 0.5 },
      { nature: 0.8, calm: 0.6 },
    );

    expect(score).toBeGreaterThan(0.6);
  });

  it("decides calm injection when user is drifting", () => {
    expect(shouldInjectCalm({ recentSkips: 3, recentHolds: 1, fastScrolls: 0 })).toBe(true);
    expect(shouldInjectCalm({ recentSkips: 0, recentHolds: 2, fastScrolls: 0 })).toBe(false);
  });

  it("assembles feed with calm candidate first when needed", () => {
    const candidates = [
      { contentId: "high", tags: ["sports"], durationMs: 30000, resonanceIndex: 0.9 },
      { contentId: "calm", tags: ["calm"], durationMs: 15000, resonanceIndex: 0.4 },
    ];

    const feed = assembleAffinityFeed({
      candidates,
      affinity: { sports: 1 },
      injectCalm: true,
    });

    expect(selectCalmCandidate(candidates)?.contentId).toBe("calm");
    expect(feed[0].contentId).toBe("calm");
  });
});
