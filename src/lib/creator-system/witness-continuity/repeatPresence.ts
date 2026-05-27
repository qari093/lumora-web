export type WitnessPresenceTrace = {
  creatorId: string;
  witnessId: string;
  circleId: string;
  createdAt: string;
};

export function countRepeatPresence(input: {
  creatorId: string;
  witnessId: string;
  traces: WitnessPresenceTrace[];
}): number {
  return input.traces.filter(
    (trace) =>
      trace.creatorId === input.creatorId &&
      trace.witnessId === input.witnessId,
  ).length;
}

export function hasRepeatPresence(input: {
  creatorId: string;
  witnessId: string;
  traces: WitnessPresenceTrace[];
  minimum?: number;
}): boolean {
  return countRepeatPresence(input) >= (input.minimum || 2);
}
