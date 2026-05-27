import type { Fyp94WaveEcho } from "./types";

export function createFyp94WaveEcho(input: {
  waveId: string;
  anonymousUserId: string;
  posterIds: string[];
  now?: Date;
  lifetimeDays?: number;
}): Fyp94WaveEcho {
  const now = input.now ?? new Date();
  const lifetime = input.lifetimeDays ?? 14;

  return {
    echoId: `echo_${input.waveId}_${input.anonymousUserId}_${now.getTime()}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    waveId: input.waveId,
    anonymousUserId: input.anonymousUserId,
    posterIds: input.posterIds.slice(0, 3),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + lifetime * 24 * 60 * 60_000).toISOString(),
    state: "active",
  };
}
