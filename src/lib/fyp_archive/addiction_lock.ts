export function computeAddictionScore(item: any): number {
  let score = 0;

  if (item.humanScore) score += item.humanScore * 0.4;
  if (item.viralScore) score += item.viralScore * 0.3;
  if (item.curiosityScore) score += item.curiosityScore * 0.3;

  return Math.min(score, 1);
}

export function markAddictiveMoments(items: any[]) {
  return items.map((item) => {
    const score = computeAddictionScore(item);

    return {
      ...item,
      addictionScore: score,
      isAddictive: score >= 0.3,
    };
  });
}

export function injectAddictionHooks(feed: any[]) {
  const addictive = feed.filter((x) => x.isAddictive);
  if (!addictive.length) return feed;

  const out: any[] = [];

  for (let i = 0; i < feed.length; i++) {
    out.push(feed[i]);

    if (i % 4 === 2 && addictive[i % addictive.length]) {
      out.push({
        ...addictive[i % addictive.length],
        addictionHook: true,
      });
    }
  }

  if (!out.some((x) => x.addictionHook)) {
    out.splice(1, 0, { ...addictive[0], addictionHook: true });
  }

  return out;
}

export function enforceAddictionLoop(feed: any[]) {
  if (!feed.length) return feed;

  const last = feed[feed.length - 1];
  return [
    ...feed,
    {
      ...feed[0],
      loopBack: feed[0].id,
      addictionLoop: true,
    },
    last,
  ];
}

export function buildAddictionLockedFeed(items: any[]) {
  const marked = markAddictiveMoments(items);
  const injected = injectAddictionHooks(marked);
  return enforceAddictionLoop(injected);
}
