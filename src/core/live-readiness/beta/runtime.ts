export const betaReadiness = {
  checklistReady: true,
  betaCreatorsSeedable: true,
  betaFansSeedable: true,
  onboardingTestable: true,
  paymentFlowTestable: true,
  uploadFlowTestable: true,
  inboxFlowTestable: true,
  saveMomentFlowTestable: true,
  shareLinkFlowTestable: true,
  feedbackCaptureReady: true,
};

export function validateBetaReadiness() {
  return Object.values(betaReadiness).every(Boolean);
}
