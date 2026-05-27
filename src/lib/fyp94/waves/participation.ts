export type Fyp94WaveParticipation = {
  waveId: string;
  anonymousUserId: string;
  watchedClipIds: string[];
  joinedAt: string;
};

export function createFyp94WaveParticipation(input: {
  waveId: string;
  anonymousUserId: string;
  watchedClipIds?: string[];
  now?: Date;
}): Fyp94WaveParticipation {
  return {
    waveId: input.waveId,
    anonymousUserId: input.anonymousUserId,
    watchedClipIds: input.watchedClipIds ?? [],
    joinedAt: (input.now ?? new Date()).toISOString(),
  };
}

export function addFyp94WaveWatchedClip(
  participation: Fyp94WaveParticipation,
  clipId: string,
): Fyp94WaveParticipation {
  if (participation.watchedClipIds.includes(clipId)) return participation;
  return {
    ...participation,
    watchedClipIds: [...participation.watchedClipIds, clipId],
  };
}
