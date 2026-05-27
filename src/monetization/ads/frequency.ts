export type FrequencyInput = {
  adsShown: number;
  maxAdsPerSession: number;
};

export function canShowMoreAds(input: FrequencyInput) {
  return input.adsShown < input.maxAdsPerSession;
}
