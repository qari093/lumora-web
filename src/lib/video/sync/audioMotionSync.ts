export type AudioMotionSyncPlan = {
  audioStartMs: number;
  motionStartMs: number;
  offsetMs: number;
  driftToleranceMs: number;
};

export function buildAudioMotionSyncPlan(input?: {
  audioStartMs?: number;
  motionStartMs?: number;
  driftToleranceMs?: number;
}): AudioMotionSyncPlan {
  const audioStartMs = input?.audioStartMs ?? 0;
  const motionStartMs = input?.motionStartMs ?? 0;

  return {
    audioStartMs,
    motionStartMs,
    offsetMs: motionStartMs - audioStartMs,
    driftToleranceMs: input?.driftToleranceMs ?? 60,
  };
}
