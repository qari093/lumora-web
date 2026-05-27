export function buildSessionSeed(sessionId: string | number) {
  let hash = 0;
  const s = String(sessionId);

  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function deterministicShuffle(items: any[], seed: number) {
  const out = [...items];
  let random = seed;

  for (let i = out.length - 1; i > 0; i--) {
    random = (random * 9301 + 49297) % 233280;
    const j = Math.floor((random / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

export function attachSessionContext(feed: any[], sessionId: string) {
  const seed = buildSessionSeed(sessionId);
  const shuffled = deterministicShuffle(feed, seed);

  return shuffled.map((item, index) => ({
    ...item,
    sessionRank: index,
    sessionId,
  }));
}

export function preventSessionRepetition(feed: any[], history: Set<string>) {
  return feed.filter((item) => !history.has(item.id));
}

export function buildSessionPersonalizedFeed(
  feed: any[],
  sessionId: string,
  history: Set<string>
) {
  const context = attachSessionContext(feed, sessionId);
  const filtered = preventSessionRepetition(context, history);

  return filtered.length ? filtered : context;
}
