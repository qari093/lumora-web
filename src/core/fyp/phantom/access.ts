import type {
  PhantomAccessMethod,
  PhantomFeedAccess
} from "./types";

export function grantPhantomAccess(input: {
  userId: string;
  method: PhantomAccessMethod;
  now?: number;
  durationMs?: number;
}): PhantomFeedAccess {
  if (!input.userId.trim()) {
    throw new Error("Phantom access requires userId.");
  }

  const now = input.now ?? Date.now();

  return {
    accessId: `phantom_access_${input.userId}_${now}`,
    userId: input.userId,
    method: input.method,
    granted: true,
    expiresAt: now + (input.durationMs ?? 60 * 60 * 1000)
  };
}

export function assertPhantomAccess(input: {
  access: PhantomFeedAccess;
  now: number;
}): true {
  if (!input.access.granted || input.now > input.access.expiresAt) {
    throw new Error("Phantom Feed access denied.");
  }

  return true;
}
