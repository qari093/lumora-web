export function computeRewatchScore(item: any): number {
  let score = 0;

  if (item.viralScore) score += item.viralScore * 0.4;
  if (item.curiosityScore) score += item.curiosityScore * 0.3;
  if (item.humanScore) score += item.humanScore * 0.3;

  return Math.min(score, 1);
}

export function markRewatchCandidates(items: any[]) {
  return items.map((item) => {
    const score = computeRewatchScore(item);
    return {
      ...item,
      rewatchScore: score,
      rewatchCandidate: score >= 0.3,
    };
  });
}

export function injectRewatchLoop(feed: any[]) {
  const candidates = feed.filter((x) => x.rewatchCandidate);
  if (!candidates.length) return feed;

  const loopItem = candidates[0];

  const out = [...feed];
  out.push({
    ...loopItem,
    rewatchLoop: true,
    loopSourceId: loopItem.id,
  });

  return out;
}

export function preventLoopSpam(feed: any[], max = 1) {
  let count = 0;
  return feed.filter((item) => {
    if (item.rewatchLoop) {
      count++;
      return count <= max;
    }
    return true;
  });
}

export function buildRewatchLoopFeed(items: any[]) {
  const marked = markRewatchCandidates(items);
  const looped = injectRewatchLoop(marked);
  return preventLoopSpam(looped);
}
