export function buildHookScore(item: any): number {
  const text = `${item.title || ""} ${item.query || ""}`.toLowerCase();

  let score = Number(item.humanScore || 0);

  if (text.includes("unexpected")) score += 0.4;
  if (text.includes("reaction")) score += 0.3;
  if (text.includes("crowd")) score += 0.2;
  if (text.includes("fail")) score += 0.3;
  if (text.includes("funny")) score += 0.2;

  return Math.min(score, 1);
}

export function injectHookSequence(feed: any[]) {
  if (!feed.length) return feed;

  const sorted = [...feed].sort((a, b) => buildHookScore(b) - buildHookScore(a));
  const hook = sorted[0];

  const out = [...feed];
  out.splice(1, 0, { ...hook, hookSlot: true });

  return out;
}

export function enforceLoopClosure(feed: any[]) {
  if (feed.length < 3) return feed;

  const last = feed[feed.length - 1];
  const first = feed[0];

  return [
    ...feed.slice(0, -1),
    {
      ...last,
      loopBack: first.id,
    },
  ];
}

export function injectCuriosityGap(feed: any[]) {
  return feed.map((item, i) => {
    if (i % 3 === 0) {
      return { ...item, curiosityGap: true };
    }
    return item;
  });
}

export function preventPredictableOrdering(feed: any[]) {
  return feed.sort(() => Math.random() - 0.5);
}

export function buildRetentionLoopFeed(items: any[]) {
  const hooked = injectHookSequence(items);
  const curiosity = injectCuriosityGap(hooked);
  const shuffled = preventPredictableOrdering(curiosity);
  return enforceLoopClosure(shuffled);
}
