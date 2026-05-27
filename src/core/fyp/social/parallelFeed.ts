import type { AtmosphereMode } from "../core/types";

export type ParallelFeedAccess = {
  ownerUserId: string;
  viewerUserId: string;
  mode: AtmosphereMode;
  permitted: boolean;
  expiresAt: number;
};

export function createParallelFeedAccess(input: {
  ownerUserId: string;
  viewerUserId: string;
  mode: AtmosphereMode;
  permitted: boolean;
  now?: number;
  durationMs?: number;
}): ParallelFeedAccess {
  if (!input.ownerUserId.trim() || !input.viewerUserId.trim()) {
    throw new Error("Parallel feed requires owner and viewer.");
  }

  const now = input.now ?? Date.now();

  return {
    ownerUserId: input.ownerUserId,
    viewerUserId: input.viewerUserId,
    mode: input.mode,
    permitted: input.permitted,
    expiresAt: now + (input.durationMs ?? 300000)
  };
}

export function assertParallelFeedAccess(access: ParallelFeedAccess): true {
  if (!access.permitted) {
    throw new Error("Parallel feed access denied.");
  }

  return true;
}
