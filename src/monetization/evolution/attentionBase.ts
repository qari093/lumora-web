export type AttentionProofBase = {
  userId: string;
  sessionId: string;
  attentionQuality: number;
  generatedAt: number;
};

export function createAttentionProofBase(input: AttentionProofBase) {
  return {
    ...input,
    valid:
      Boolean(input.userId) &&
      Boolean(input.sessionId) &&
      input.attentionQuality >= 0 &&
      input.attentionQuality <= 1 &&
      input.generatedAt > 0,
  };
}
