export type AdsActivationMode = "disabled" | "shadow" | "controlled";

export type AdsActivationInput = {
  enabled?: boolean | null;
  mode?: AdsActivationMode | null;
  allowExternal?: boolean | null;
  maxSponsoredPerFeed?: number | null;
  maxDailyImpressions?: number | null;
};

export type AdsActivationResult =
  | {
      ok: true;
      config: {
        enabled: boolean;
        mode: AdsActivationMode;
        allowExternal: boolean;
        maxSponsoredPerFeed: number;
        maxDailyImpressions: number;
      };
    }
  | { ok: false; reason: string };

export function resolveAdsActivation(
  input: AdsActivationInput
): AdsActivationResult {
  const enabled = Boolean(input.enabled);
  const mode = input.mode ?? "disabled";
  const allowExternal = Boolean(input.allowExternal);
  const maxSponsoredPerFeed =
    typeof input.maxSponsoredPerFeed === "number" && Number.isFinite(input.maxSponsoredPerFeed)
      ? Math.trunc(input.maxSponsoredPerFeed)
      : NaN;
  const maxDailyImpressions =
    typeof input.maxDailyImpressions === "number" && Number.isFinite(input.maxDailyImpressions)
      ? Math.trunc(input.maxDailyImpressions)
      : NaN;

  if (!["disabled", "shadow", "controlled"].includes(mode)) {
    return { ok: false, reason: "invalid_mode" };
  }

  if (!Number.isFinite(maxSponsoredPerFeed) || maxSponsoredPerFeed < 0 || maxSponsoredPerFeed > 3) {
    return { ok: false, reason: "invalid_max_sponsored_per_feed" };
  }

  if (!Number.isFinite(maxDailyImpressions) || maxDailyImpressions < 0) {
    return { ok: false, reason: "invalid_max_daily_impressions" };
  }

  if (!enabled && mode !== "disabled") {
    return { ok: false, reason: "mode_requires_enabled_ads" };
  }

  if (mode === "shadow" && allowExternal) {
    return { ok: false, reason: "shadow_mode_disallows_external_ads" };
  }

  if (mode === "disabled" && (allowExternal || maxSponsoredPerFeed > 0 || maxDailyImpressions > 0)) {
    return { ok: false, reason: "disabled_mode_requires_zero_delivery" };
  }

  return {
    ok: true,
    config: {
      enabled,
      mode,
      allowExternal,
      maxSponsoredPerFeed,
      maxDailyImpressions,
    },
  };
}
