import type { LumoraContentItem } from "../schema";

export type ScoredFypItem = LumoraContentItem & {
  viralScore: number;
  teaserScore: number;
};

export function scoreItem(item: LumoraContentItem): ScoredFypItem {
  const engagement =
    item.stats.views > 0
      ? (item.stats.likes * 2 + item.stats.comments * 3) / item.stats.views
      : 0;

  const viralScore = item.stats.velocity * 0.6 + engagement * 100 * 0.4;
  const teaserScore =
    item.type === "trailer" || /trailer|teaser/i.test(`${item.title} ${item.description}`)
      ? viralScore + 50
      : viralScore;

  return { ...item, viralScore, teaserScore };
}

export function buildMixedFeed(
  items: LumoraContentItem[],
  options: { fallbackItems?: LumoraContentItem[]; minimumFeedLength?: number } = {},
): ScoredFypItem[] {
  const minimum = Math.max(1, options.minimumFeedLength ?? 10);
  const scored = items.map(scoreItem).sort((a, b) => b.viralScore - a.viralScore);
  const fallback = (options.fallbackItems ?? []).map(scoreItem);

  const seen = new Set<string>();
  const out: ScoredFypItem[] = [];

  for (const item of [...scored, ...fallback]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
    if (out.length >= minimum) break;
  }

  return out;
}

export function validateBuiltFeed(items: ScoredFypItem[], minimum = 1) {
  const reasons: string[] = [];
  if (items.length < minimum) reasons.push("below_minimum");
  if (items.some((x) => !x.id || !x.title || !x.embedUrl)) reasons.push("invalid_shape");

  return {
    ok: reasons.length === 0,
    reasons,
    count: items.length,
  };
}
