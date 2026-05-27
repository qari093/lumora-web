export type PlaybackTimestampTrace = {
  videoId: string;
  currentTimeMs: number;
  durationMs: number;
  progress: number;
  recordedAt: string;
};

export function createPlaybackTimestampTrace(input: {
  videoId: string;
  currentTimeMs: number;
  durationMs: number;
  recordedAt?: string;
}): PlaybackTimestampTrace {
  const progress = input.durationMs > 0 ? input.currentTimeMs / input.durationMs : 0;

  return {
    videoId: input.videoId,
    currentTimeMs: input.currentTimeMs,
    durationMs: input.durationMs,
    progress: Math.max(0, Math.min(1, progress)),
    recordedAt: input.recordedAt || new Date().toISOString(),
  };
}
