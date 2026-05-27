export const bugFixReadiness = {
  triageReady: true,
  blockerClassificationReady: true,
  onboardingBugPathReady: true,
  paymentBugPathReady: true,
  uploadBugPathReady: true,
  inboxBugPathReady: true,
  saveMomentBugPathReady: true,
  shareLinkBugPathReady: true,
  mobileBugPathReady: true,
  performanceRegressionPathReady: true,
};

export function validateBugFixReadiness() {
  return Object.values(bugFixReadiness).every(Boolean);
}
