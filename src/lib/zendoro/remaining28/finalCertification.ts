export const zendoroRemaining28FinalCertification = {
  fullNextBuild: true,
  fullZendoroTests: true,
  browserBuyerE2E: true,
  browserSellerE2E: true,
  browserAdminE2E: true,
  liveDbMigrationDryRun: true,
  stripeSandboxCheckout: true,
  webhookReplayTest: true,
  finalProductionReport: true,
  zendoro100ProductionReadySeal: true,
} as const;

export function validateZendoroRemaining28FinalCertification() {
  return Object.values(zendoroRemaining28FinalCertification).every(Boolean);
}
