import type { ResonanceProfile } from "../imprints/types";

export type ImpactQuotient = {
  contentId: string;
  quotient: number;
  liveVelocity: number;
  emotionalDepth: number;
};

export function calculateImpactQuotient(input: {
  profile: ResonanceProfile;
  velocity: number;
  emotionalDepth: number;
}): ImpactQuotient {
  const quotient =
    input.profile.resonanceScore +
    (input.velocity * 3) +
    (input.emotionalDepth * 5);

  return {
    contentId: input.profile.contentId,
    quotient,
    liveVelocity: input.velocity,
    emotionalDepth: input.emotionalDepth
  };
}
