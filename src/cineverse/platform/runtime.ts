export const cineversePlatformRuntime = {
  pwaFirst: true,
  cloudflareFirst: true,
  workersReady: true,
  d1MetadataReady: true,
  r2TeaserStorageReady: true,
  externalVideoFirst: true,
  lowBurnMode: true,
};

export function validateCineVersePlatformRuntime() {
  return Object.values(cineversePlatformRuntime).every(Boolean);
}
