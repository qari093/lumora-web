import { describe, it, expect, beforeEach } from "vitest";
import { enforce720pFreeTierCap } from "@/lib/video/resolution_cap";
import {
  resetResolutionForTest,
  recordResolutionCappedUsage,
  getResolutionDistribution,
} from "@/lib/telemetry/resolution";

describe("free-tier 720p cap", () => {
  beforeEach(() => resetResolutionForTest());

  it("caps >720p for free tier", () => {
    const r = enforce720pFreeTierCap("1080p", { isFreeTier: true });
    expect(r.ok).toBe(true);
    expect((r as any).capped).toBe(true);
    expect((r as any).enforced).toBe(720);
  });

  it("does not cap <=720p for free tier", () => {
    const r = enforce720pFreeTierCap("720p", { isFreeTier: true });
    expect(r.ok).toBe(true);
    expect((r as any).capped).toBe(false);
  });

  it("does not cap for paid tier", () => {
    const r = enforce720pFreeTierCap("1080p", { isFreeTier: false });
    expect(r.ok).toBe(true);
    expect((r as any).capped).toBe(false);
  });

  it("records requested+enforced buckets when capped", () => {
    // normalizeLabel converts 1920x1080 -> 1080p, so "requested:1080p" is expected
    const r = enforce720pFreeTierCap("1920x1080", { isFreeTier: true });
    expect(r.ok).toBe(true);
    const capped = (r as any).capped === true;

    recordResolutionCappedUsage({
      requestedLabel: "1920x1080",
      enforcedHeight: capped ? (r as any).enforced : undefined,
      wasCapped: capped,
      bytes: 1000,
    });

    const dist = getResolutionDistribution();
    expect(dist.find((d) => d.label === "requested:1080p")).toBeTruthy();
    expect(dist.find((d) => d.label === "enforced:720p")).toBeTruthy();
  });

  it("rejects invalid resolution strings", () => {
    const r = enforce720pFreeTierCap("nonsense", { isFreeTier: true });
    expect(r.ok).toBe(false);
    expect((r as any).error).toBe("bad_resolution");
  });
});
