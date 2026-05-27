export const MONETIZATION_PRINCIPLES = {
  nonInterruptive: true,
  userFirst: true,
  signalDriven: true,
  optInReward: true,
  noForcedAds: true,
} as const;

export function validatePrinciples() {
  return Object.values(MONETIZATION_PRINCIPLES).every(Boolean);
}
