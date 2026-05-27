import type {
  PulseModeSession
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createPulseModeSession(input: {
  userId: string;
  mode: AtmosphereMode;
  now?: number;
  durationSeconds?: number;
}): PulseModeSession {
  if (!input.userId.trim()) {
    throw new Error("Pulse Mode requires userId.");
  }

  const now = input.now ?? Date.now();
  const duration =
    (input.durationSeconds ?? 90) * 1000;

  return {
    sessionId: `pulse_${input.userId}_${now}`,
    userId: input.userId,
    mode: input.mode,
    startedAt: now,
    expiresAt: now + duration,
    active: true
  };
}

export function assertPulseSessionActive(
  session: PulseModeSession,
  now: number
): true {
  if (now > session.expiresAt) {
    throw new Error("Pulse Mode session expired.");
  }

  return true;
}
