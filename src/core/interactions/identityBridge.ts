export type InteractionIdentitySignal = {
  prismGrowthEnabled: boolean;
  resonanceIdentityEnabled: boolean;
  reflectionProfileEnabled: boolean;
};

export function getInteractionIdentitySignal(): InteractionIdentitySignal {
  return {
    prismGrowthEnabled: true,
    resonanceIdentityEnabled: true,
    reflectionProfileEnabled: true,
  };
}
