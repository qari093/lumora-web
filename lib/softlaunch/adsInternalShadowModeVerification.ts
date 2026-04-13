export type ShadowAdConfig = {
  mode: "disabled" | "shadow" | "controlled";
  internalOnly: boolean;
  maxSponsoredPerFeed: number;
  impressionsCap: number;
  adsEnabled: boolean;
};

export type AdsInternalShadowModeVerificationInput = {
  config?: ShadowAdConfig | null;
};

export type AdsInternalShadowModeVerificationResult =
  | {
      ok: true;
      verification: {
        mode: "disabled" | "shadow" | "controlled";
        internalOnly: boolean;
        adsEnabled: boolean;
        maxSponsoredPerFeed: number;
        impressionsCap: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateAdsInternalShadowModeVerification(
  input: AdsInternalShadowModeVerificationInput
): AdsInternalShadowModeVerificationResult {
  const config = input.config;
  if (!config) return { ok: false, reason: "missing_config" };

  if (!["disabled", "shadow", "controlled"].includes(config.mode)) {
    return { ok: false, reason: "invalid_mode" };
  }
  if (!Number.isFinite(config.maxSponsoredPerFeed) || config.maxSponsoredPerFeed < 0 || config.maxSponsoredPerFeed > 3) {
    return { ok: false, reason: "invalid_max_sponsored_per_feed" };
  }
  if (!Number.isFinite(config.impressionsCap) || config.impressionsCap < 0) {
    return { ok: false, reason: "invalid_impressions_cap" };
  }

  if (config.mode === "shadow") {
    if (!config.adsEnabled) return { ok: false, reason: "shadow_requires_ads_enabled" };
    if (!config.internalOnly) return { ok: false, reason: "shadow_requires_internal_only" };
    if (config.maxSponsoredPerFeed > 1) return { ok: false, reason: "shadow_requires_low_feed_cap" };
  }

  return {
    ok: true,
    verification: {
      mode: config.mode,
      internalOnly: config.internalOnly,
      adsEnabled: config.adsEnabled,
      maxSponsoredPerFeed: config.maxSponsoredPerFeed,
      impressionsCap: config.impressionsCap,
      ready:
        config.mode === "shadow" &&
        config.adsEnabled &&
        config.internalOnly &&
        config.maxSponsoredPerFeed <= 1 &&
        config.impressionsCap > 0,
    },
  };
}
