export const SCALE_TARGETS = {
  minimumPool: 300,
  growthPool: 500,
  minQueryDiversity: 10,
  minSourceDiversity: 2,
};

export function createCrossRunSeenSet(manifest) {
  return new Set(
    manifest
      .filter(x => x.source && (x.sourceId || x.mp4Url))
      .map(x => `${x.source}:${x.sourceId || x.mp4Url}`)
  );
}

export function filterAlreadyIngested(candidates, manifest) {
  const seen = createCrossRunSeenSet(manifest);

  return candidates.filter(c => {
    const key = `${c.source}:${c.sourceId || c.mp4Url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function validateScaleTargets(manifest) {
  const queries = new Set(manifest.map(x => x.query).filter(Boolean));
  const sources = new Set(manifest.map(x => x.source).filter(Boolean));

  return {
    ready300: manifest.length >= SCALE_TARGETS.minimumPool,
    ready500: manifest.length >= SCALE_TARGETS.growthPool,
    queryDiversity: queries.size,
    sourceDiversity: sources.size,
    queryOk: queries.size >= SCALE_TARGETS.minQueryDiversity,
    sourceOk: sources.size >= SCALE_TARGETS.minSourceDiversity,
  };
}

export function buildScaleReport(manifest) {
  const scale = validateScaleTargets(manifest);

  return {
    total: manifest.length,
    target300: scale.ready300,
    target500: scale.ready500,
    queryDiversity: scale.queryDiversity,
    sourceDiversity: scale.sourceDiversity,
    ok: scale.ready300 && scale.queryOk,
  };
}
