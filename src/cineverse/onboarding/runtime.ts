export const onboardingSystems = [
  "emotional-signature",
  "civilization-entry",
  "first-watch-flow",
  "oracle-introduction",
  "retention-loops",
] as const;

export function createUserJourney() {
  return {
    onboarding: "cinematic",
    civilizationAssigned: true,
  };
}

export function supportsRetentionLoop() {
  return true;
}
