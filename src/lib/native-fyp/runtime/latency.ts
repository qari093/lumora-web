export function shouldShowShimmer(loadTimeMs: number): boolean {
  return loadTimeMs > 200;
}

export function shouldSkipVideo(loadTimeMs: number): boolean {
  return loadTimeMs > 700;
}
