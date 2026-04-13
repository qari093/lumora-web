export type InternalAdsRolloutInput = {
  mode?: "disabled" | "shadow" | "controlled" | null;
  maxSponsoredPerFeed?: number | null;
  maxDailyImpressions?: number | null;
  internalOnly?: boolean | null;
};

export type InternalAdsRolloutResult =
  | {
      ok: true;
      rollout: {
        mode: "disabled" | "shadow" | "controlled";
        adsEnabled: boolean;
        internalOnly: boolean;
        maxSponsoredPerFeed: number;
        maxDailyImpressions: number;
      };
    }
  | { ok: false; reason: string };

export function resolveInternalAdsRollout(
  input: InternalAdsRolloutInput
): InternalAdsRolloutResult {
  const mode = input.mode ?? "disabled";
  const maxSponsoredPerFeed =
    typeof input.maxSponsoredPerFeed === "number" && Number.isFinite(input.maxSponsoredPerFeed)
      ? Math.trunc(input.maxSponsoredPerFeed)
      : NaN;
  const maxDailyImpressions =
    typeof input.maxDailyImpressions === "number" && Number.isFinite(input.maxDailyImpressions)
      ? Math.trunc(input.maxDailyImpressions)
      : NaN;
  const internalOnly = Boolean(input.internalOnly);

  if (!["disabled", "shadow", "controlled"].includes(mode)) {
    return { ok: false, reason: "invalid_mode" };
  }

  if (!Number.isFinite(maxSponsoredPerFeed) || maxSponsoredPerFeed < 0 || maxSponsoredPerFeed > 3) {
    return { ok: false, reason: "invalid_max_sponsored_per_feed" };
  }

  if (!Number.isFinite(maxDailyImpressions) || maxDailyImpressions < 0) {
    return { ok: false, reason: "invalid_max_daily_impressions" };
  }

  if (mode === "disabled") {
    if (maxSponsoredPerFeed !== 0 || maxDailyImpressions !== 0) {
      return { ok: false, reason: "disabled_mode_requires_zero_limits" };
    }
    return {
      ok: true,
      rollout: {
        mode,
        adsEnabled: false,
        internalOnly: true,
        maxSponsoredPerFeed,
        maxDailyImpressions,
      },
    };
  }

  if (!internalOnly) {
    return { ok: false, reason: "softlaunch_requires_internal_only_ads" };
  }

  return {
    ok: true,
    rollout: {
      mode,
      adsEnabled: true,
      internalOnly: true,
      maxSponsoredPerFeed,
      maxDailyImpressions,
    },
  };
}
