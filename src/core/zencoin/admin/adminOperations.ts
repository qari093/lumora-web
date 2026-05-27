export const adminOperations = {
  adminDashboard: true,
  transactionLookup: true,
  refundOperations: true,
  suspiciousActivityManagement: true,
  campaignManagement: true,
  featureFlagControls: true,
  supportTools: true,
  operationalExports: true
} as const;

export function adminOperationsHealthy(): boolean {
  return Object.values(adminOperations).every(Boolean);
}
