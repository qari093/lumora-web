export const ARCHIVE_DEPTH_POLICY = {
  minArchivePool: 500,
  maxArchiveRatio: 0.4,
  minDecadeDiversity: 4,
  minQueryDiversity: 10,
};

export function buildArchiveDedupeKey(item: any): string {
  return `${item.source || "archive"}:${item.sourceId || item.identifier || ""}:${item.archiveFile || item.mp4Url || ""}`;
}

export function preventDuplicateArchiveIngestion(existing: any[], additions: any[]) {
  const seen = new Set(existing.map(buildArchiveDedupeKey));
  const out: any[] = [];

  for (const item of additions) {
    const key = buildArchiveDedupeKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

export function trackArchiveRatio(feed: any[]) {
  const total = feed.length || 1;
  const archiveCount = feed.filter((item) => item.source === "archive").length;

  return {
    archiveCount,
    total,
    ratio: archiveCount / total,
  };
}

export function validateArchiveDepth(archiveItems: any[]) {
  const decades = new Set(archiveItems.map((item) => item.decade).filter(Boolean));
  const queries = new Set(archiveItems.map((item) => item.query).filter(Boolean));

  return {
    total: archiveItems.length,
    poolReady: archiveItems.length >= ARCHIVE_DEPTH_POLICY.minArchivePool,
    decadeDiversity: decades.size,
    queryDiversity: queries.size,
    diversityReady:
      decades.size >= ARCHIVE_DEPTH_POLICY.minDecadeDiversity &&
      queries.size >= ARCHIVE_DEPTH_POLICY.minQueryDiversity,
  };
}

export function maintainArchiveLongTailDiversity(items: any[], maxPerQuery = 30) {
  const counts = new Map<string, number>();

  return items.filter((item) => {
    const query = item.query || "unknown";
    const next = (counts.get(query) || 0) + 1;
    counts.set(query, next);
    return next <= maxPerQuery;
  });
}
