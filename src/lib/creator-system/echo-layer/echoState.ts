export type EchoState = {
  creatorId: string;
  circleId: string;
  createdAtMs: number;
  expiresAtMs: number;
  active: boolean;
};

export function createEchoState(input: {
  creatorId: string;
  circleId: string;
  nowMs?: number;
}): EchoState {
  const now = input.nowMs ?? Date.now();
  const ttl = 24 * 60 * 60 * 1000;

  return {
    creatorId: input.creatorId,
    circleId: input.circleId,
    createdAtMs: now,
    expiresAtMs: now + ttl,
    active: true,
  };
}
