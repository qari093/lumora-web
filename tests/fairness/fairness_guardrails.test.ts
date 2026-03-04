import { describe, expect, it } from "vitest";
import { enforceResolutionCap, applyFairnessToScore, normalizeRequestedVariant } from "@/lib/fairness/guardrails";

describe("fairness guardrails", () => {
  it("free tier capped at 720p", () => {
    const d = enforceResolutionCap({ tier: "free", width: 1920, height: 1080 });
    expect(d.ok).toBe(false);
    expect(d.reason).toBe("tier_cap");
    expect(d.allowedMaxHeight).toBe(720);
  });

  it("plus tier allows 1080p", () => {
    const d = enforceResolutionCap({ tier: "plus", width: 1920, height: 1080 });
    expect(d.ok).toBe(true);
    expect(d.reason).toBeUndefined();
  });

  it("applyFairnessToScore dampens tier-capped variants slightly", () => {
    const fairness = enforceResolutionCap({ tier: "free", width: 1920, height: 1080 });
    const s = applyFairnessToScore({ score: 100, fairness });
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThan(100);
    // bounded dampening ~3%
    expect(s).toBeGreaterThan(96.5);
  });

  it("normalizeRequestedVariant never upscales, only caps", () => {
    const r = normalizeRequestedVariant({ tier: "free", width: 640, height: 360 });
    expect(r.capped).toBe(false);
    expect(r.width).toBe(640);
    expect(r.height).toBe(360);

    const r2 = normalizeRequestedVariant({ tier: "free", width: 1920, height: 1080 });
    expect(r2.capped).toBe(true);
    expect(r2.height).toBeLessThanOrEqual(720);
  });
});
