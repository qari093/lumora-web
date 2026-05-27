export const POOL_TARGETS = {
  batchMin: 100,
  minimumPool: 300,
  idealPool: 500,
  queryDiversityMin: 10,
};

export function appendManifest(existing, additions) {
  return [...existing, ...additions];
}

export function getPoolMetrics(manifest) {
  const queries = new Set(manifest.map(x => x.query).filter(Boolean));
  const sources = new Set(manifest.map(x => x.source).filter(Boolean));
  const urls = new Set(manifest.map(x => x.mp4Url).filter(Boolean));

  return {
    total: manifest.length,
    queryDiversity: queries.size,
    sourceDiversity: sources.size,
    uniqueUrls: urls.size,
    duplicateCount: manifest.filter(x => x.mp4Url).length - urls.size,
  };
}

export function validatePoolReadiness(manifest) {
  const m = getPoolMetrics(manifest);

  return {
    ok:
      m.total >= POOL_TARGETS.minimumPool &&
      m.queryDiversity >= POOL_TARGETS.queryDiversityMin &&
      m.duplicateCount === 0,
    ...m,
  };
}

export function buildIngestionLog({ added, skipped, manifest }) {
  const metrics = getPoolMetrics(manifest);

  return {
    added,
    skipped,
    total: metrics.total,
    queryDiversity: metrics.queryDiversity,
    sourceDiversity: metrics.sourceDiversity,
    duplicateCount: metrics.duplicateCount,
  };
}
