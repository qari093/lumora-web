export function buildDecadeBuckets(items: any[]) {
  const buckets: Record<string, any[]> = {};

  for (const item of items) {
    const d = item.decade || "unknown";
    if (!buckets[d]) buckets[d] = [];
    buckets[d].push(item);
  }

  return buckets;
}

export function preventSameEraRepetition(feed: any[]) {
  const out: any[] = [];
  let lastDecade: string | null = null;

  for (const item of feed) {
    if (item.decade === lastDecade) continue;
    out.push(item);
    lastDecade = item.decade;
  }

  return out;
}

export function mixArchiveWithModern(archive: any[], modern: any[]) {
  const out: any[] = [];
  const max = Math.max(archive.length, modern.length);

  for (let i = 0; i < max; i++) {
    if (archive[i]) out.push(archive[i]);
    if (modern[i]) out.push(modern[i]);
  }

  return out;
}

export function injectTemporalJumps(feed: any[]) {
  return feed.map((item, i) => {
    if (i % 4 === 0) {
      return { ...item, timeJump: true };
    }
    return { ...item, timeJump: false };
  });
}

export function buildTimeMachineFeed(archive: any[], modern: any[]) {
  const mixed = mixArchiveWithModern(archive, modern);
  const noRepeat = preventSameEraRepetition(mixed);
  return injectTemporalJumps(noRepeat);
}
