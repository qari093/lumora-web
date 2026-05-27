import type { Fyp94SwerveSignal, Fyp94SwerveSignalType } from "./types";

export function createFyp94SwerveSignal(input: {
  type: Fyp94SwerveSignalType;
  clipId: string;
  category: string;
  tags?: string[];
  anonymousSessionId: string;
  now?: Date;
}): Fyp94SwerveSignal {
  return {
    signalId: `swerve_${input.type}_${input.clipId}_${(input.now ?? new Date()).getTime()}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    type: input.type,
    clipId: input.clipId,
    category: input.category,
    tags: input.tags ?? [],
    anonymousSessionId: input.anonymousSessionId,
    createdAt: (input.now ?? new Date()).toISOString(),
  };
}
