export function buildUserSessionVector(events: any[]) {
  const vec = {
    likes: 0,
    skips: 0,
    watchTime: 0,
    interest: new Set<string>(),
  };

  for (const e of events) {
    if (e.type === "like") vec.likes++;
    if (e.type === "skip") vec.skips++;
    if (e.type === "watch") vec.watchTime += Number(e.value || 0);
    if (e.query) vec.interest.add(e.query);
  }

  return {
    ...vec,
    interest: Array.from(vec.interest),
  };
}

export function scoreFeedAgainstUser(feed: any[], session: any) {
  const interests = new Set(session.interest || []);

  return feed.map((item) => {
    const match = interests.has(item.query) ? 1 : 0;
    const humanBoost = Number(item.humanScore || 0);

    return {
      ...item,
      userScore: match * 0.6 + humanBoost * 0.4,
    };
  });
}

export function preventUserFatigue(feed: any[]) {
  const out: any[] = [];
  const seenQuery = new Set<string>();

  for (const item of feed) {
    const query = String(item.query || "unknown");
    if (seenQuery.has(query)) continue;

    seenQuery.add(query);
    out.push(item);
  }

  return out.length ? out : feed;
}

export function injectRecoveryClip(feed: any[]) {
  const calm = feed.find((x) => (x.tone || "").toLowerCase() === "calm");
  if (!calm) return feed;

  const out = [...feed];
  out.splice(Math.floor(out.length / 2), 0, { ...calm, recovery: true });

  return out;
}

export function detectChurnRisk(session: any) {
  if (!session) return false;

  const lowEngagement =
    session.likes === 0 &&
    session.watchTime < 20 &&
    session.skips >= 3;

  return lowEngagement;
}

export function buildBehaviorAwareFeed(feed: any[], session: any) {
  const scored = scoreFeedAgainstUser(feed, session);
  const sorted = [...scored].sort((a, b) => b.userScore - a.userScore);
  const noFatigue = preventUserFatigue(sorted);

  if (detectChurnRisk(session)) {
    return injectRecoveryClip(noFatigue);
  }

  return noFatigue;
}
