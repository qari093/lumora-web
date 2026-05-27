export type PresentPulse = {
  circleId: string;
  hostId: string;
  type: "present";
  automaticFallback: true;
  createdAt: string;
};

export function createPresentPulseFallback(input: {
  circleId: string;
  hostId: string;
  createdAt?: string;
}): PresentPulse {
  return {
    circleId: input.circleId,
    hostId: input.hostId,
    type: "present",
    automaticFallback: true,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}
