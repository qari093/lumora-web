export type VaultMoment = {
  id: string;
  title: string;
  lane: string;
  savedAt: number;
  peak?: boolean;
};

export type VaultState = {
  capacity: number;
  moments: VaultMoment[];
};

export function createVault(): VaultState {
  return {
    capacity: 12,
    moments: []
  };
}

export function addMoment(
  vault: VaultState,
  moment: VaultMoment
): VaultState {
  const next = [...vault.moments];

  if (next.length >= vault.capacity) {
    next.shift();
  }

  next.push(moment);

  return {
    ...vault,
    moments: next
  };
}

export function expandVault(
  vault: VaultState,
  completedSessions: number
): VaultState {
  const bonus =
    completedSessions >= 100 ? 12 :
    completedSessions >= 50 ? 6 :
    completedSessions >= 25 ? 3 : 0;

  return {
    ...vault,
    capacity: 12 + bonus
  };
}
