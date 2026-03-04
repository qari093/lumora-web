import { describe, it, expect } from "vitest";
import { enforceResolutionCap } from "@/lib/guards/fairness";

describe("fairness guardrails (resolution caps)", () => {
  it("free tier clamps 1080p down to <=720p with aspect preserved", () => {
    const d = enforceResolutionCap({ tier: "free", requested: { width: 1920, height: 1080 } });
    expect(d.ok).toBe(true);
    expect(d.effective.height).toBeLessThanOrEqual(720);
    expect(d.effective.width).toBeLessThanOrEqual(1280);
    expect(d.reason).toBe("free_tier_clamped_to_720p");
    // 1920x1080 -> scale 720/1080 = 0.666.. => 1280x720
    expect(d.effective).toEqual({ width: 1280, height: 720 });
  });

  it("free tier leaves compliant 720p unchanged", () => {
    const d = enforceResolutionCap({ tier: "free", requested: { width: 1280, height: 720 } });
    expect(d.effective).toEqual({ width: 1280, height: 720 });
    expect(d.reason).toBeUndefined();
  });

  it("pro tier does not clamp", () => {
    const d = enforceResolutionCap({ tier: "pro", requested: { width: 3840, height: 2160 } });
    expect(d.effective).toEqual({ width: 3840, height: 2160 });
  });

  it("clamps weird inputs safely", () => {
    const d = enforceResolutionCap({ tier: "free", requested: { width: 0, height: -5 } });
    expect(d.effective.width).toBeGreaterThanOrEqual(1);
    expect(d.effective.height).toBeGreaterThanOrEqual(1);
  });
});
