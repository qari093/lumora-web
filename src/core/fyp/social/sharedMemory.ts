import type { AtmosphereMode } from "../core/types";

export type SharedAtmosphereMemory = {
  memoryId: string;
  mode: AtmosphereMode;
  participantCount: number;
  echoUnlocked: boolean;
  createdAt: number;
};

export function createSharedAtmosphereMemory(input: {
  mode: AtmosphereMode;
  participantCount: number;
  now?: number;
}): SharedAtmosphereMemory {
  if (input.participantCount < 2) {
    throw new Error("Shared atmosphere memory requires at least 2 participants.");
  }

  const now = input.now ?? Date.now();

  return {
    memoryId: `shared_${input.mode}_${now}`,
    mode: input.mode,
    participantCount: input.participantCount,
    echoUnlocked: true,
    createdAt: now
  };
}
