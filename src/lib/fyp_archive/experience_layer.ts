export function scoreRealLifeChaos(item: any): number {
  const text = `${item.title || ""} ${item.query || ""} ${item.description || ""}`.toLowerCase();

  let score = Number(item.humanScore || 0);

  if (text.includes("crowd")) score += 0.25;
  if (text.includes("reaction")) score += 0.25;
  if (text.includes("street")) score += 0.2;
  if (text.includes("kids")) score += 0.2;
  if (text.includes("festival")) score += 0.15;
  if (text.includes("unexpected")) score += 0.3;

  return Math.min(score, 1);
}

export function prioritizeRealLifeChaos(items: any[]) {
  return [...items].sort((a, b) => scoreRealLifeChaos(b) - scoreRealLifeChaos(a));
}

export function injectUnexpectedArchiveMoments(feed: any[], pool: any[]) {
  const unexpected = pool.find((item) => {
    const text = `${item.title || ""} ${item.query || ""}`.toLowerCase();
    return text.includes("unexpected") || text.includes("reaction") || text.includes("crowd");
  });

  if (!unexpected) return feed;

  const out = [...feed];
  out.splice(Math.min(3, out.length), 0, { ...unexpected, unexpectedMoment: true });
  return out;
}

export function mixEmotionalTones(items: any[]) {
  const buckets: Record<string, any[]> = {};

  for (const item of items) {
    const tone = item.tone || item.emotion || "curiosity";
    if (!buckets[tone]) buckets[tone] = [];
    buckets[tone].push(item);
  }

  const out: any[] = [];
  let active = true;

  while (active) {
    active = false;
    for (const key of Object.keys(buckets)) {
      const next = buckets[key].shift();
      if (next) {
        out.push(next);
        active = true;
      }
    }
  }

  return out;
}

export function avoidCalmOnlySequences(items: any[], maxCalm = 2) {
  const out: any[] = [];
  let calmStreak = 0;

  for (const item of items) {
    const tone = item.tone || item.emotion || "";
    if (tone === "calm") calmStreak += 1;
    else calmStreak = 0;

    if (calmStreak <= maxCalm) out.push(item);
  }

  return out;
}

export function buildArchiveExperienceFeed(items: any[]) {
  const chaos = prioritizeRealLifeChaos(items);
  const injected = injectUnexpectedArchiveMoments(chaos, items);
  const mixed = mixEmotionalTones(injected);

  return avoidCalmOnlySequences(mixed);
}
