import type { OfficialPromoSourceCategory } from "./officialPromoSourceRegistry";
import type { TrustState } from "./trustState";

export type TeaserIngestionInput = {
  sourceId: string;
  sourceDomain: string;
  sourceName: string;
  category: OfficialPromoSourceCategory;
  trustState: TrustState;
  title: string;
  teaserUrl?: string;
  posterUrl?: string;
  canonicalUrl?: string;
  language?: string;
  region?: string;
  releasedAt?: string;
  ingestedAt: string;
  rightsHint?: "safe" | "unknown" | "restricted";
};

export type TeaserIngestionResult = {
  accepted: boolean;
  reason?:
    | "ok"
    | "missing-title"
    | "missing-source"
    | "suppressed-source"
    | "invalid-category";
  normalized: TeaserIngestionInput;
};

export function validateTeaserIngestionInput(
  input: TeaserIngestionInput
): TeaserIngestionResult {
  if (!input.title.trim()) {
    return { accepted: false, reason: "missing-title", normalized: input };
  }

  if (!input.sourceId.trim() || !input.sourceDomain.trim() || !input.sourceName.trim()) {
    return { accepted: false, reason: "missing-source", normalized: input };
  }

  if (input.trustState === "suppressed") {
    return { accepted: false, reason: "suppressed-source", normalized: input };
  }

  if (
    input.category !== "movie" &&
    input.category !== "series" &&
    input.category !== "music" &&
    input.category !== "gaming" &&
    input.category !== "cross-media"
  ) {
    return { accepted: false, reason: "invalid-category", normalized: input };
  }

  return { accepted: true, reason: "ok", normalized: input };
}
