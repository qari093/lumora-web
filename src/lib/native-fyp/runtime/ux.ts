export function getInitialVisualState() {
  return {
    showPoster: true,
    showVideo: false,
    showShimmer: false,
  };
}

export function resolveVisualState(loadTimeMs: number) {
  if (loadTimeMs < 150) {
    return { showPoster: false, showVideo: true, showShimmer: false };
  }
  if (loadTimeMs < 700) {
    return { showPoster: true, showVideo: true, showShimmer: true };
  }
  return { showPoster: true, showVideo: false, showShimmer: true };
}
