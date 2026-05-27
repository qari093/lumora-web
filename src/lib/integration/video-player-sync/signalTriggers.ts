export function triggerPresent(input: { videoId: string; creatorId: string; witnessId: string; timestampMs: number }) {
  return { ...input, type: "present", humanOnly: true };
}

export function triggerHold(input: { videoId: string; creatorId: string; witnessId: string; timestampMs: number; holdDurationMs: number }) {
  return { ...input, type: "hold", humanOnly: true };
}

export function triggerRewatch(input: { videoId: string; creatorId: string; witnessId: string; timestampMs: number; rewatchCount: number }) {
  return { ...input, type: "rewatch", humanOnly: true };
}
