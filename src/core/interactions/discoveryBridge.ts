export type InteractionDiscoverySignal = {
  resonanceBoost: number;
  reflectionDepthBoost: number;
  rippleReachBoost: number;
};

export function getInteractionDiscoverySignal(): InteractionDiscoverySignal {
  return {
    resonanceBoost: 0.18,
    reflectionDepthBoost: 0.24,
    rippleReachBoost: 0.21,
  };
}
