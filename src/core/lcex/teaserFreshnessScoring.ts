export type TeaserFreshnessInput = {
  releasedAt?: string;
  ingestedAt?: string;
  updatedAt?: string;
};

export type TeaserFreshnessScore = {
  score: number;
  bucket: "breaking" | "fresh" | "warm" | "aging" | "stale";
};

function pickTimestamp(input: TeaserFreshnessInput): number | null {
  const raw = input.updatedAt || input.ingestedAt || input.releasedAt;
  if (!raw) return null;
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

export function scoreTeaserFreshness(
  input: TeaserFreshnessInput
): TeaserFreshnessScore {
  const timestamp = pickTimestamp(input);

  if (timestamp === null) {
    return { score: 35, bucket: "aging" };
  }

  const ageDays = Math.max(0, (Date.now() - timestamp) / (1000 * 60 * 60 * 24));

  if (ageDays <= 1) return { score: 100, bucket: "breaking" };
  if (ageDays <= 7) return { score: 90, bucket: "fresh" };
  if (ageDays <= 30) return { score: 72, bucket: "warm" };
  if (ageDays <= 90) return { score: 48, bucket: "aging" };
  return { score: 20, bucket: "stale" };
}

export function isFreshTeaser(
  input: TeaserFreshnessInput
): boolean {
  return scoreTeaserFreshness(input).score >= 72;
}
