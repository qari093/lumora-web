export const PRODUCTION_LOCK = {
  mp4Only: true,
  localPlaybackStable: true,
  cdnMappingPrepared: true,
  fastApiResponseTargetMs: 250,
  noAiEnabled: true,
};

export function validateMp4Only(manifest) {
  return manifest.every((item) => String(item.localUrl || item.mp4Url || "").includes(".mp4"));
}

export function validateApiPerformance({ responseMs }) {
  return Number(responseMs) <= PRODUCTION_LOCK.fastApiResponseTargetMs;
}

export function buildProductionReadinessReport({ manifest = [], responseMs = 0 } = {}) {
  return {
    mp4Only: validateMp4Only(manifest),
    apiFast: validateApiPerformance({ responseMs }),
    cdnReady: PRODUCTION_LOCK.cdnMappingPrepared,
    noAiEnabled: PRODUCTION_LOCK.noAiEnabled,
    ready:
      validateMp4Only(manifest) &&
      validateApiPerformance({ responseMs }) &&
      PRODUCTION_LOCK.cdnMappingPrepared &&
      PRODUCTION_LOCK.noAiEnabled,
  };
}
