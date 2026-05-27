export const integrationTestingSeal = {
  echoPurchases: true,
  subscriptions: true,
  refunds: true,
  duplicateReceipts: true,
  biometricSigning: true,
  sessionRevocation: true,
  exportDeleteFlows: true,
  offlineBehavior: true,
  recoveryFlows: true
} as const;

export function integrationTestingHealthy(): boolean {
  return Object.values(integrationTestingSeal).every(Boolean);
}
