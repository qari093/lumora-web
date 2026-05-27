export type PassivePresenceState = {
  creatorId: string;
  active: boolean;
  lastSeenAt: number;
};

export function registerPassivePresence(input: {
  creatorId: string;
  nowMs?: number;
}): PassivePresenceState {
  return {
    creatorId: input.creatorId,
    active: true,
    lastSeenAt: input.nowMs ?? Date.now(),
  };
}
