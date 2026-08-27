/**
 * Canonical compatibility contract for onboarding runtime readiness.
 * The production onboarding surface is app/onboarding/page.tsx.
 */
export const onboardingRuntimeEnabled = true as const;

export function getOnboardingRuntimeState() {
  return {
    enabled: onboardingRuntimeEnabled,
    mode: "private_beta_guarded" as const,
  };
}
