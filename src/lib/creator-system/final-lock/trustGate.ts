export type TrustGateCriteria = {
  minimumDeepEngagement: number;
  minimumQuietResonance: number;
  noFakeMetrics: true;
  noBackdoorMonetization: true;
};

export function getCreatorTrustGateCriteria(): TrustGateCriteria {
  return {
    minimumDeepEngagement: 3,
    minimumQuietResonance: 2,
    noFakeMetrics: true,
    noBackdoorMonetization: true,
  };
}

export function passesCreatorTrustGate(input: {
  deepEngagement: number;
  quietResonance: number;
}): boolean {
  const gate = getCreatorTrustGateCriteria();

  return (
    input.deepEngagement >= gate.minimumDeepEngagement &&
    input.quietResonance >= gate.minimumQuietResonance
  );
}
