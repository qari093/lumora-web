export const zendoroTrustFraudGuards = {
  fakeReviewDetection: true,
  suspiciousOrderDetection: true,
  sellerRiskScoring: true,
  buyerAbuseDetection: true,
  scamKeywordMonitoring: true,
  chargebackRiskTracking: true,
  manualReviewQueue: true,
  enforcementLogging: true,
} as const;

export function validateZendoroTrustFraudGuards() {
  return Object.values(zendoroTrustFraudGuards).every(Boolean);
}

export function scoreZendoroSellerRisk(input: { disputes: number; chargebacks: number; fakeReviews: number }) {
  return Math.min(100, input.disputes * 15 + input.chargebacks * 25 + input.fakeReviews * 20);
}
