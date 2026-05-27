export function triggerEchoAfterCircleEnd(input: {
  creatorId: string;
  circleId: string;
  ended: boolean;
  nowMs?: number;
}) {
  const now = input.nowMs ?? Date.now();
  return {
    creatorId: input.creatorId,
    circleId: input.circleId,
    active: input.ended,
    createdAtMs: now,
    expiresAtMs: now + 86400000,
  };
}
