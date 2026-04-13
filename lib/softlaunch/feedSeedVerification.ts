export type FeedSeedItem = {
  id: string;
  portal: "FYP";
  title: string;
  category: string;
  active: boolean;
  score: number;
};

export type FeedSeedVerificationInput = {
  items?: FeedSeedItem[] | null;
};

export type FeedSeedVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        active: number;
        averageScore: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

function round2(v: number) {
  return Math.round(v * 100) / 100;
}

export function evaluateFeedSeedVerification(
  input: FeedSeedVerificationInput
): FeedSeedVerificationResult {
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) return { ok: false, reason: "missing_items" };

  const ids = new Set<string>();
  let active = 0;
  let totalScore = 0;

  for (const item of items) {
    if (!item.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(item.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(item.id);

    if (item.portal !== "FYP") return { ok: false, reason: "invalid_portal" };
    if (!item.title?.trim()) return { ok: false, reason: "missing_title" };
    if (!item.category?.trim()) return { ok: false, reason: "missing_category" };
    if (!Number.isFinite(item.score) || item.score < 0 || item.score > 1) {
      return { ok: false, reason: "invalid_score" };
    }

    if (item.active) active += 1;
    totalScore += item.score;
  }

  const averageScore = round2(totalScore / items.length);

  return {
    ok: true,
    verification: {
      total: items.length,
      active,
      averageScore,
      ready: active >= 3 && averageScore >= 0.6,
    },
  };
}
