export type TeaserAvailabilityCheckInput = {
  teaserUrl?: string;
  posterUrl?: string;
  canonicalUrl?: string;
  rightsState?:
    | "safe-display"
    | "safe-embed"
    | "metadata-only"
    | "thumbnail-only"
    | "blocked"
    | "manual-review";
  removed?: boolean;
  degraded?: boolean;
};

export type TeaserUnavailabilityReason =
  | "missing_media"
  | "blocked_media"
  | "removed_media"
  | "degraded_source"
  | "manual_review"
  | "available";

export type TeaserAvailabilityResult = {
  available: boolean;
  reason: TeaserUnavailabilityReason;
};

export function detectTeaserUnavailability(
  input: TeaserAvailabilityCheckInput
): TeaserAvailabilityResult {
  if (input.removed) {
    return { available: false, reason: "removed_media" };
  }

  if (input.degraded) {
    return { available: false, reason: "degraded_source" };
  }

  if (input.rightsState === "blocked") {
    return { available: false, reason: "blocked_media" };
  }

  if (input.rightsState === "manual-review") {
    return { available: false, reason: "manual_review" };
  }

  if (!input.teaserUrl && !input.posterUrl && !input.canonicalUrl) {
    return { available: false, reason: "missing_media" };
  }

  return { available: true, reason: "available" };
}
