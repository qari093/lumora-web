export function onboardingFlow(step: number) {
  return {
    completed: step >= 5
  };
}
