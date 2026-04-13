import { describe, expect, it } from "vitest";
import { resolveAdsActivation } from "@/lib/ads/activation";

describe("ads engine activation (disabled -> controlled)", () => {
  it("accepts fully disabled mode", () => {
    const out = resolveAdsActivation({
      enabled: false,
      mode: "disabled",
      allowExternal: false,
      maxSponsoredPerFeed: 0,
      maxDailyImpressions: 0,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.config.mode).toBe("disabled");
      expect(out.config.enabled).toBe(false);
    }
  });

  it("accepts shadow mode with internal-only delivery", () => {
    const out = resolveAdsActivation({
      enabled: true,
      mode: "shadow",
      allowExternal: false,
      maxSponsoredPerFeed: 1,
      maxDailyImpressions: 500,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.config.mode).toBe("shadow");
      expect(out.config.allowExternal).toBe(false);
    }
  });

  it("accepts controlled mode", () => {
    const out = resolveAdsActivation({
      enabled: true,
      mode: "controlled",
      allowExternal: false,
      maxSponsoredPerFeed: 1,
      maxDailyImpressions: 1000,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.config.mode).toBe("controlled");
    }
  });

  it("rejects shadow mode with external ads", () => {
    const out = resolveAdsActivation({
      enabled: true,
      mode: "shadow",
      allowExternal: true,
      maxSponsoredPerFeed: 1,
      maxDailyImpressions: 100,
    });

    expect(out).toEqual({ ok: false, reason: "shadow_mode_disallows_external_ads" });
  });

  it("rejects non-disabled mode when ads are disabled", () => {
    const out = resolveAdsActivation({
      enabled: false,
      mode: "controlled",
      allowExternal: false,
      maxSponsoredPerFeed: 1,
      maxDailyImpressions: 100,
    });

    expect(out).toEqual({ ok: false, reason: "mode_requires_enabled_ads" });
  });
});
