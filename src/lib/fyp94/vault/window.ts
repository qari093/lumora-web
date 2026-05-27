import type { Fyp94PulseVault } from "./types";

export function createFyp94PulseVault(input: {
  anonymousUserId: string;
  clipIds: string[];
  unlocksAtScore?: number;
  now?: Date;
}): Fyp94PulseVault {
  const now = input.now ?? new Date();

  return {
    vaultId: `vault_${input.anonymousUserId}_${now.getTime()}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    anonymousUserId: input.anonymousUserId,
    clipIds: input.clipIds,
    unlocksAtScore: input.unlocksAtScore ?? 50,
    state: "locked",
  };
}

export function unlockFyp94PulseVault(input: {
  vault: Fyp94PulseVault;
  now?: Date;
  hoursOpen?: number;
}): Fyp94PulseVault {
  const now = input.now ?? new Date();
  const hoursOpen = input.hoursOpen ?? 48;

  return {
    ...input.vault,
    state: "unlocked",
    unlockedAt: now.toISOString(),
    relocksAt: new Date(now.getTime() + hoursOpen * 60 * 60_000).toISOString(),
  };
}

export function relockFyp94PulseVault(vault: Fyp94PulseVault, now = new Date()): Fyp94PulseVault {
  if (!vault.relocksAt) return vault;
  if (new Date(vault.relocksAt).getTime() > now.getTime()) return vault;
  return { ...vault, state: "relocked" };
}
