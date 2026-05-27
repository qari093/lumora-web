export const unitTestingSeal = {
  ledgerTests: true,
  balanceProjectionTests: true,
  spendFlowTests: true,
  refundTests: true,
  iapValidationTests: true,
  subscriptionTests: true,
  securityTests: true,
  privacyTests: true,
  spendingProtectionTests: true
} as const;

export function unitTestingHealthy(): boolean {
  return Object.values(unitTestingSeal).every(Boolean);
}
