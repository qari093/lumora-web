export function enforceRevenueGuardrails(input: {
  adsPerSession: number;
  maxAdsPerSession: number;
  userState: "green" | "yellow" | "red";
}) {
  if (input.userState === "red") {
    return { allowedAds: 0 };
  }

  return {
    allowedAds: Math.min(input.adsPerSession, input.maxAdsPerSession),
  };
}
