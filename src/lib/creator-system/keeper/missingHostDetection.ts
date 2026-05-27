export type HostPresence = {
  hostId?: string;
  present: boolean;
  checkedAt: string;
};

export function isHostMissingBeforeCircle(presence: HostPresence): boolean {
  return !presence.hostId || presence.present === false;
}

export function buildHostPresenceCheck(input: {
  hostId?: string;
  present: boolean;
  checkedAt?: string;
}): HostPresence {
  return {
    hostId: input.hostId,
    present: input.present,
    checkedAt: input.checkedAt || new Date().toISOString(),
  };
}
