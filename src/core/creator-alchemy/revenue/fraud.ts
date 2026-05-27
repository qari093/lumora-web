export interface RevenueFraudSignal {
  chargebackRate: number;
  giftVelocitySpike: number;
  repeatedViewerRatio: number;
  suspiciousDeviceRatio: number;
}

export function revenueFraudCleared(signal: RevenueFraudSignal): boolean {
  if (signal.chargebackRate > 0.03) return false;
  if (signal.giftVelocitySpike > 0.85) return false;
  if (signal.repeatedViewerRatio > 0.75) return false;
  if (signal.suspiciousDeviceRatio > 0.12) return false;
  return true;
}
