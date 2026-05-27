export type QuietResonanceEvent = {
  creatorId: string;
  witnessId: string;
  memoryId?: string;
  eventType: "quiet-resonance";
  createdAt: string;
};

export function createQuietResonanceEvent(input: {
  creatorId: string;
  witnessId: string;
  memoryId?: string;
  createdAt?: string;
}): QuietResonanceEvent {
  return {
    creatorId: input.creatorId,
    witnessId: input.witnessId,
    memoryId: input.memoryId,
    eventType: "quiet-resonance",
    createdAt: input.createdAt || new Date().toISOString(),
  };
}
