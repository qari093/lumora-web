export function scoreHumanActivity(clip) {
  const q = String(clip.query || "").toLowerCase();
  const terms = ["people", "kids", "crowd", "reaction", "laughing", "arguing", "sports", "festival", "concert", "wedding"];
  return terms.some(t => q.includes(t)) ? 1 : Number(clip.humanScore ?? 0.3);
}

export function reduceAestheticOnlyWeight(clips) {
  return [...clips].sort((a, b) => scoreHumanActivity(b) - scoreHumanActivity(a));
}

export function injectRandomCategoryClip(feed, pool) {
  const categories = new Set(feed.map(x => x.category));
  const candidate = pool.find(x => !categories.has(x.category)) || pool[0];
  if (!candidate) return feed;

  const out = [...feed];
  out.splice(Math.min(4, out.length), 0, candidate);
  return out;
}

export function enforceMultiQueryDistribution(clips, maxPerQuery = 5) {
  const counts = new Map();

  return clips.filter(c => {
    const q = c.query || "unknown";
    const next = (counts.get(q) || 0) + 1;
    counts.set(q, next);
    return next <= maxPerQuery;
  });
}

export function buildRealismDiversityFeed(clips, pool = clips) {
  return injectRandomCategoryClip(
    enforceMultiQueryDistribution(
      reduceAestheticOnlyWeight(clips)
    ),
    pool
  );
}
