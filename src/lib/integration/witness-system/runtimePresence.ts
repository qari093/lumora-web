export type RuntimeWitnessPresence = {
  circleId: string;
  creatorId: string;
  witnessId: string;
  witnessName: string;
  present: true;
  capturedAt: string;
};

export function captureRuntimeWitnessPresence(input: {
  circleId: string;
  creatorId: string;
  witnessId: string;
  witnessName: string;
  capturedAt?: string;
}): RuntimeWitnessPresence {
  return {
    circleId: input.circleId,
    creatorId: input.creatorId,
    witnessId: input.witnessId,
    witnessName: input.witnessName.trim(),
    present: true,
    capturedAt: input.capturedAt || new Date().toISOString(),
  };
}
