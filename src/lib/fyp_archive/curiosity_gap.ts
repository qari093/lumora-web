export function computeCuriosityScore(item: any): number {
  const text = `${item.title || ""} ${item.query || ""}`.toLowerCase();

  let score = 0;

  if (text.includes("unexpected")) score += 0.4;
  if (text.includes("wait")) score += 0.2;
  if (text.includes("watch")) score += 0.2;
  if (text.includes("what happens")) score += 0.3;
  if (text.includes("reaction")) score += 0.2;
  if (text.includes("moment")) score += 0.2;

  return Math.min(score, 1);
}

export function markCuriosityItems(items: any[]) {
  return items.map((item) => {
    const score = computeCuriosityScore(item);
    return {
      ...item,
      curiosityScore: score,
      hasCuriosity: score >= 0.3,
    };
  });
}

export function injectCuriosityGap(feed: any[]) {
  const candidates = feed.filter((x) => x.hasCuriosity);
  if (!candidates.length) return feed;

  const out = [...feed];
  out.splice(1, 0, { ...candidates[0], curiositySlot: true });

  return out;
}

export function preventCuriositySpam(feed: any[], max = 2) {
  const out: any[] = [];
  let streak = 0;

  for (const item of feed) {
    if (item.hasCuriosity) {
      streak++;
      if (streak > max) continue;
    } else {
      streak = 0;
    }
    out.push(item);
  }

  return out;
}

export function buildCuriosityFeed(items: any[]) {
  const marked = markCuriosityItems(items);
  const injected = injectCuriosityGap(marked);
  return preventCuriositySpam(injected);
}
