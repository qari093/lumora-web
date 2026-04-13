export type SafeRating = "G" | "PG" | "PG-13" | "R" | "NC-17" | "UNRATED" | "UNKNOWN";

export type SafeRatingInput = {
  assetId: string;
  rating?: string;
  source?: string;
  title?: string;
};

export type SafeRatingResult = {
  assetId: string;
  normalizedRating: SafeRating;
  allowed: boolean;
  action: "allow" | "review" | "block";
  reason: string;
};

function normalizeRating(value?: string): SafeRating {
  const v = String(value || "").trim().toUpperCase();
  if (v === "G") return "G";
  if (v === "PG") return "PG";
  if (v === "PG-13" || v === "PG13") return "PG-13";
  if (v === "R") return "R";
  if (v === "NC-17" || v === "NC17") return "NC-17";
  if (v === "UNRATED") return "UNRATED";
  return "UNKNOWN";
}

export function applySafeRatingFilter(input: SafeRatingInput): SafeRatingResult {
  const normalizedRating = normalizeRating(input.rating);

  if (normalizedRating === "G" || normalizedRating === "PG") {
    return {
      assetId: input.assetId,
      normalizedRating,
      allowed: true,
      action: "allow",
      reason: "safe_rating_allowed",
    };
  }

  if (normalizedRating === "UNKNOWN" || normalizedRating === "UNRATED") {
    return {
      assetId: input.assetId,
      normalizedRating,
      allowed: false,
      action: "review",
      reason: "rating_unknown_or_unrated",
    };
  }

  return {
    assetId: input.assetId,
    normalizedRating,
    allowed: false,
    action: "block",
    reason: "rating_above_pg",
  };
}

export function applySafeRatingBatch(inputs: SafeRatingInput[]): SafeRatingResult[] {
  return (Array.isArray(inputs) ? inputs : []).map(applySafeRatingFilter);
}
