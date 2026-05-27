import type { AuraProfile, AuraTier } from "./auraTypes";

export function calculateAuraTier(score: number): AuraTier {
  if (score >= 900) return "singularity";
  if (score >= 650) return "volt";
  if (score >= 400) return "blaze";
  if (score >= 180) return "spark";
  return "wire";
}

export function createAuraProfile(input: {
  creatorId: string;
  impactQuotient: number;
  resonance: number;
  voltage: number;
  loyalty: number;
  trust: number;
}): AuraProfile {
  if (!input.creatorId.trim()) {
    throw new Error("Aura profile requires creatorId.");
  }

  const score =
    input.impactQuotient * 0.35 +
    input.resonance * 0.25 +
    input.voltage * 0.2 +
    input.loyalty * 0.1 +
    input.trust * 0.1;

  return {
    creatorId: input.creatorId,
    tier: calculateAuraTier(score),
    impactQuotient: input.impactQuotient,
    resonance: input.resonance,
    voltage: input.voltage,
    loyalty: input.loyalty,
    trust: input.trust
  };
}
