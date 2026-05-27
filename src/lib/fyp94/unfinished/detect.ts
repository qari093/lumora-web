import type { Fyp94UnfinishedContext, Fyp94UnfinishedThread } from "./types";

export function createFyp94UnfinishedThread(input: {
  anonymousUserId: string;
  context: Fyp94UnfinishedContext;
  category: string;
  tags?: string[];
  clipId?: string;
  sequenceId?: string;
  waveId?: string;
  now?: Date;
  resumeMinutes?: number;
}): Fyp94UnfinishedThread {
  const now = input.now ?? new Date();
  const resumeMinutes = input.resumeMinutes ?? 120;

  return {
    threadId: `unfinished_${input.context}_${input.anonymousUserId}_${now.getTime()}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    anonymousUserId: input.anonymousUserId,
    context: input.context,
    clipId: input.clipId,
    sequenceId: input.sequenceId,
    waveId: input.waveId,
    category: input.category,
    tags: input.tags ?? [],
    createdAt: now.toISOString(),
    resumesUntil: new Date(now.getTime() + resumeMinutes * 60_000).toISOString(),
  };
}

export function shouldCreateFyp94UnfinishedThread(input: {
  exited: boolean;
  context?: Fyp94UnfinishedContext;
}): boolean {
  return Boolean(input.exited && input.context);
}
