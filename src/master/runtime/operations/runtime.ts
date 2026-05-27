export const operationsRuntime = {
  securityHardeningReady: true,
  complianceReady: true,
  betaCreatorOnboardingReady: true,
  betaFanOnboardingReady: true,
  feedbackIterationReady: true,
  stabilizationReady: true,
  trafficActivationReady: true,
  scaleValidationReady: true,
  costOptimizationReady: true,
  devopsAutomationReady: true,
  disasterRecoveryReady: true,
};

export function validateOperationsRuntime() {
  return Object.values(operationsRuntime).every(Boolean);
}
