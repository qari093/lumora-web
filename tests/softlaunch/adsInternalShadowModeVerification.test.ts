import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateAdsInternalShadowModeVerification } from "@/lib/softlaunch/adsInternalShadowModeVerification";

describe("soft-launch ads internal shadow mode verification", () => {
  it("passes valid shadow config", () => {
    const config = JSON.parse(fs.readFileSync("data/softlaunch/ads-shadow-config.json", "utf8"));
    const out = evaluateAdsInternalShadowModeVerification({ config });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.mode).toBe("shadow");
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects shadow mode without internalOnly", () => {
    const out = evaluateAdsInternalShadowModeVerification({
      config: {
        mode: "shadow",
        internalOnly: false,
        maxSponsoredPerFeed: 1,
        impressionsCap: 500,
        adsEnabled: true,
      },
    });

    expect(out).toEqual({ ok: false, reason: "shadow_requires_internal_only" });
  });

  it("rejects shadow mode with high feed cap", () => {
    const out = evaluateAdsInternalShadowModeVerification({
      config: {
        mode: "shadow",
        internalOnly: true,
        maxSponsoredPerFeed: 2,
        impressionsCap: 500,
        adsEnabled: true,
      },
    });

    expect(out).toEqual({ ok: false, reason: "shadow_requires_low_feed_cap" });
  });

  it("rejects invalid impressions cap", () => {
    const out = evaluateAdsInternalShadowModeVerification({
      config: {
        mode: "shadow",
        internalOnly: true,
        maxSponsoredPerFeed: 1,
        impressionsCap: -1,
        adsEnabled: true,
      },
    });

    expect(out).toEqual({ ok: false, reason: "invalid_impressions_cap" });
  });
});
