export const ARCHIVE_MERGE_POLICY = {
  minArchiveRatio: 0.2,
  maxArchiveRatio: 0.4,
  maxSameSourceStreak: 2,
};

export function splitArchiveAndModern(items: any[]) {
  return {
    archive: items.filter((item) => item.source === "archive"),
    modern: items.filter((item) => item.source !== "archive"),
  };
}

export function enforceArchiveRatio(archive: any[], modern: any[], targetRatio = 0.3) {
  const totalTarget = archive.length + modern.length;
  const archiveLimit = Math.max(1, Math.floor(totalTarget * targetRatio));

  return {
    archive: archive.slice(0, archiveLimit),
    modern,
  };
}

export function mergeMultiSourceFeed(archive: any[], modern: any[]) {
  const out: any[] = [];
  const max = Math.max(archive.length, modern.length);

  for (let i = 0; i < max; i++) {
    if (modern[i]) out.push(modern[i]);
    if (archive[i]) out.push(archive[i]);
  }

  return out;
}

export function validateFeedBalance(feed: any[]) {
  const total = feed.length || 1;
  const archiveCount = feed.filter((item) => item.source === "archive").length;
  const ratio = archiveCount / total;

  return {
    ok:
      archiveCount === 0 ||
      (ratio >= ARCHIVE_MERGE_POLICY.minArchiveRatio &&
        ratio <= ARCHIVE_MERGE_POLICY.maxArchiveRatio),
    total,
    archiveCount,
    archiveRatio: ratio,
  };
}

export function buildArchiveEnhancedFeed(items: any[]) {
  const { archive, modern } = splitArchiveAndModern(items);
  const ratio = enforceArchiveRatio(archive, modern);
  const merged = mergeMultiSourceFeed(ratio.archive, ratio.modern);

  return {
    feed: merged,
    balance: validateFeedBalance(merged),
  };
}
