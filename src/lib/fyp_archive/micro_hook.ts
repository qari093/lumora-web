export function computeHookScore(item: any): number {
  let score = 0;

  if (item.curiosityScore) score += Number(item.curiosityScore) * 0.6;
  if (item.viralScore) score += Number(item.viralScore) * 0.5;
  if (item.humanScore) score += Number(item.humanScore) * 0.5;

  return Math.min(score, 1);
}

export function markHookMoments(items: any[]) {
  return items.map((item) => {
    const score = computeHookScore(item);

    return {
      ...item,
      hookScore: score,
      isHook: score >= 0.2,
    };
  });
}

export function injectMicroHooks(feed: any[]) {
  const hooks = feed.filter((item) => item.isHook);
  if (!hooks.length) return feed;

  const out: any[] = [];
  let hookIndex = 0;

  for (let i = 0; i < feed.length; i++) {
    out.push(feed[i]);

    if ((i + 1) % 3 === 0 && hooks[hookIndex]) {
      out.push({
        ...hooks[hookIndex],
        microHook: true,
      });
      hookIndex++;
    }
  }

  if (!out.some((item) => item.microHook)) {
    out.splice(Math.min(1, out.length), 0, {
      ...hooks[0],
      microHook: true,
    });
  }

  return out;
}

export function preventHookOverload(feed: any[], max = 2) {
  let count = 0;

  return feed.filter((item) => {
    if (item.microHook) {
      count++;
      return count <= max;
    }

    return true;
  });
}

export function buildMicroHookFeed(items: any[]) {
  const marked = markHookMoments(items);
  const injected = injectMicroHooks(marked);
  return preventHookOverload(injected);
}
