export const REFRESH_CONFIG = {
  maxManifestItems: 500,
  minKeepItems: 300,
};

export function appendNewClips(manifest, additions) {
  return [...manifest, ...additions];
}

export function archiveOldClips(manifest) {
  if (manifest.length <= REFRESH_CONFIG.maxManifestItems) return manifest;

  return manifest.slice(manifest.length - REFRESH_CONFIG.maxManifestItems);
}

export function ensureMinimumPool(manifest) {
  return manifest.length >= REFRESH_CONFIG.minKeepItems;
}

export function buildRefreshCycle({ manifest, additions }) {
  const appended = appendNewClips(manifest, additions);
  const trimmed = archiveOldClips(appended);

  return {
    manifest: trimmed,
    total: trimmed.length,
    meetsMinimum: ensureMinimumPool(trimmed),
  };
}

export function buildRefreshLog({ added, before, after }) {
  return {
    added,
    before,
    after,
    delta: after - before,
  };
}
