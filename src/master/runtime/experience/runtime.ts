export const experienceRuntime = {
  inboxIntelligenceReady: true,
  saveMomentRuntimeReady: true,
  ambientLinkRuntimeReady: true,
  creatorStoreRuntimeReady: true,
  analyticsRuntimeReady: true,
  moderationRuntimeReady: true,
  observabilityRuntimeReady: true,
  performanceOptimizationReady: true,
  accessibilityReady: true,
};

export function validateExperienceRuntime() {
  return Object.values(experienceRuntime).every(Boolean);
}
