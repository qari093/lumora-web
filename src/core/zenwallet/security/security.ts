export type RiskSignal = {
  amount: number;
  newDevice: boolean;
  failedAttempts: number;
};

export function evaluateSpendRisk(signal: RiskSignal) {
  let score = 0;
  if (signal.amount > 100) score += 50;
  if (signal.newDevice) score += 30;
  score += signal.failedAttempts * 10;

  return {
    score,
    requiresPin: score >= 30,
    requiresWebAuthn: score >= 70,
  };
}

export function createZenLockState(enabled: boolean) {
  return { enabled, updatedAt: new Date().toISOString() };
}

export function verifyWebhookSignature(signature: string, expected: string) {
  return signature.length > 0 && signature === expected;
}
