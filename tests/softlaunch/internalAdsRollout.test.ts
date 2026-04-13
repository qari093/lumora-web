import { describe, expect, it } from "vitest";
import { resolveInternalAdsRollout } from "@/lib/softlaunch/internalAdsRollout";

describe("soft-launch internal ads rollout", () => {
  it("accepts disabled mode", () => {
    const out = resolveInternalAdsRollout({
      mode: "disabled",
      maxSponsoredPerFeed: 0,
      maxDailyImpressions: 0,
      internalOnly: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.rollout.adsEnabled).toBe(false);
    }
  });

  it("accepts shadow mode", () => {
    const out = resolveInternalAdsRollout({
      mode: "shadow",
      maxSponsoredPerFeed: 1,
      maxDailyImpressions: 500,
      internalOnly: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.rollout.mode).toBe("shadow");
      expect(out.rollout.adsEnabled).toBe(true);
    }
  });

  it("accepts controlled mode", () => {
    const out = resolveInternalAdsRollout({
      mode: "controlled",
      maxSponsoredPerFeed: 1,
      maxDailyImpressions: 1000,
      internalOnly: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.rollout.mode).toBe("controlled");
    }
  });

  it("rejects non-internal rollout", () => {
    const out = resolveInternalAdsRollout({
      mode: "shadow",
      maxSponsoredPerFeed: 1,
      maxDailyImpressions: 500,
      internalOnly: false,
    });

    expect(out).toEqual({ ok: false, reason: "softlaunch_requires_internal_only_ads" });
  });

  it("rejects invalid disabled limits", () => {
    const out = resolveInternalAdsRollout({
      mode: "disabled",
      maxSponsoredPerFeed: 1,
      maxDailyImpressions: 0,
      internalOnly: true,
    });

    expect(out).toEqual({ ok: false, reason: "disabled_mode_requires_zero_limits" });
  });
});
