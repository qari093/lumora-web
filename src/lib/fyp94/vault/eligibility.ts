export const FYP94_DEFAULT_VAULT_THRESHOLD = 50;

export function isFyp94VaultEligible(input: {
  pulseScore: number;
  threshold?: number;
}): boolean {
  return input.pulseScore >= (input.threshold ?? FYP94_DEFAULT_VAULT_THRESHOLD);
}
