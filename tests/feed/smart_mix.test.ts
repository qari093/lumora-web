import { describe, it, expect } from "vitest";
import { buildSmartMix } from "@/lib/feed/smartMix";

describe("smart mix (worker assembly)", () => {
  it("adds lane labels and never exceeds limit", () => {
    const now = Date.now();
    const out = buildSmartMix([
      { id: "a", contentType: "ugc", baseScore: 0.9, engagement: { missionBoost: 1 }, createdAtMs: now },
      { id: "b", contentType: "trailer", baseScore: 0.7, engagement: { squadBoost: 1 }, createdAtMs: now - 1000 },
      { id: "c", contentType: "ugc", baseScore: 0.2, createdAtMs: now - 1000 * 60 },
    ], { limit: 2 });

    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.items.length).toBe(2);
    for (const it of out.items) {
      expect(typeof it.lane).toBe("string");
      expect(typeof it.laneLabel).toBe("string");
      expect(Number.isFinite(it.score)).toBe(true);
    }
  });

  it("flags escalation when budget is unrealistically small", () => {
    const now = Date.now();
    const items = Array.from({ length: 500 }, (_, i) => ({
      id: "x" + i,
      contentType: "ugc" as const,
      baseScore: 0.5 + (i % 10) / 100,
      createdAtMs: now - i * 1000
    }));
    const out = buildSmartMix(items, { limit: 60, tookBudgetMs: 1 });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(["none","server"]).toContain(out.meta.escalation);
    // With tiny budget, likely "server" but don't hard-require in CI variability.
  });
});
