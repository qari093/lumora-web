export type AuraTier =
  | "wire"
  | "spark"
  | "blaze"
  | "volt"
  | "singularity";

export type AuraProfile = {
  creatorId: string;
  tier: AuraTier;
  impactQuotient: number;
  resonance: number;
  voltage: number;
  loyalty: number;
  trust: number;
};
