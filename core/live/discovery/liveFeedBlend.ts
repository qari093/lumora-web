export function blendLiveFeed(weight = 0.25) {
  return {
    enabled: true,
    feedWeight: weight,
    discoveryReady: true,
    crossPortalReady: true
  };
}
