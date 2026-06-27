import { FYP_FRESHNESS_CONFIG } from "./freshnessConfig";
import type {
  FypFreshnessAsset,
  FypFreshnessResult,
  FypSeenRecord
} from "./freshnessTypes";

const DAY = 24 * 60 * 60 * 1000;

export function evaluateFreshness(
  asset: FypFreshnessAsset,
  seen: FypSeenRecord[],
  now: number
): FypFreshnessResult {
  const prior = seen.find(x => x.assetId === asset.id);

  if (
    prior &&
    now - prior.seenAt <
      FYP_FRESHNESS_CONFIG.repeatCooldownDays * DAY
  ) {
    return {
      eligible: false,
      reason: "recently_seen"
    };
  }

  if (
    !asset.evergreen &&
    now - asset.publishedAt >
      FYP_FRESHNESS_CONFIG.expireAfterDays * DAY
  ) {
    return {
      eligible: false,
      reason: "expired"
    };
  }

  return {
    eligible: true,
    reason: "fresh"
  };
}
