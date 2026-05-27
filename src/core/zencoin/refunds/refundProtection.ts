export const refundProtection = {
  riskScoring: true,
  normalUsersInstantAccess: true,
  riskySettlementDelay: true,
  velocityProtection: true,
  abuseCooldowns: true
} as const;

export function shouldDelaySettlement(input: {
  newDevice: boolean;
  refundHistory: boolean;
  unusualVelocity: boolean;
}): boolean {
  return (
    input.newDevice ||
    input.refundHistory ||
    input.unusualVelocity
  );
}

export function refundProtectionHealthy(): boolean {
  return (
    refundProtection.riskScoring &&
    refundProtection.normalUsersInstantAccess &&
    refundProtection.riskySettlementDelay &&
    refundProtection.velocityProtection &&
    refundProtection.abuseCooldowns
  );
}
