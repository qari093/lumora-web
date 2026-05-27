export function calculateSessionPacing(input: {
  videosWatched: number;
  adsShown: number;
  targetSpacing: number;
}) {
  const expectedAds = Math.floor(input.videosWatched / input.targetSpacing);
  return {
    canServe: input.adsShown < expectedAds,
    expectedAds,
  };
}
