export function computeViralScore(item: any): number {
  const text = `${item.title || ""} ${item.query || ""}`.toLowerCase();

  let score = Number(item.humanScore || 0);

  if (text.includes("fail")) score += 0.4;
  if (text.includes("funny")) score += 0.3;
  if (text.includes("unexpected")) score += 0.4;
  if (text.includes("reaction")) score += 0.3;
  if (text.includes("crowd")) score += 0.2;
  if (text.includes("emotional")) score += 0.25;

  return Math.min(score, 1);
}

export function markViralCandidates(items: any[]) {
  return items.map((item) => {
    const score = computeViralScore(item);
    return {
      ...item,
      viralScore: score,
      isViral: score >= 0.6,
    };
  });
}

export function injectViralBoost(feed: any[]) {
  const viral = feed.filter((x) => x.isViral);

  if (!viral.length) return feed;

  const out = [...feed];
  out.splice(0, 0, { ...viral[0], viralBoost: true });

  return out;
}

export function limitViralStreak(feed: any[], max = 2) {
  const out: any[] = [];
  let streak = 0;

  for (const item of feed) {
    if (item.isViral) {
      streak++;
      if (streak > max) continue;
    } else {
      streak = 0;
    }
    out.push(item);
  }

  return out;
}

export function buildViralFeed(items: any[]) {
  const marked = markViralCandidates(items);
  const boosted = injectViralBoost(marked);
  return limitViralStreak(boosted);
}
