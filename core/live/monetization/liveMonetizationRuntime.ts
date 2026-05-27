export function evaluateLiveMonetization(input: { viewers: number; consent: boolean; safetyOk: boolean }) {
  const enabled = input.consent && input.safetyOk && input.viewers >= 10;
  return { enabled, nativeAdsReady: enabled, creatorTipReady: enabled, sponsorCardReady: enabled, nonDisruptive: true };
}
