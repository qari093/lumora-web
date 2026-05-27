import { createPlaybackTimestampTrace } from "./timestampTracking";
import { triggerHold, triggerPresent, triggerRewatch } from "./signalTriggers";

export function syncPlaybackToSignalEngine(input: {
  videoId: string;
  creatorId: string;
  witnessId: string;
  currentTimeMs: number;
  durationMs: number;
  holdDurationMs?: number;
  rewatchCount?: number;
}) {
  const trace = createPlaybackTimestampTrace({
    videoId: input.videoId,
    currentTimeMs: input.currentTimeMs,
    durationMs: input.durationMs,
  });

  const signals = [
    triggerPresent({
      videoId: input.videoId,
      creatorId: input.creatorId,
      witnessId: input.witnessId,
      timestampMs: input.currentTimeMs,
    }),
  ];

  if ((input.holdDurationMs || 0) >= 1000) {
    signals.push(triggerHold({
      videoId: input.videoId,
      creatorId: input.creatorId,
      witnessId: input.witnessId,
      timestampMs: input.currentTimeMs,
      holdDurationMs: input.holdDurationMs || 0,
    }) as any);
  }

  if ((input.rewatchCount || 0) > 0) {
    signals.push(triggerRewatch({
      videoId: input.videoId,
      creatorId: input.creatorId,
      witnessId: input.witnessId,
      timestampMs: input.currentTimeMs,
      rewatchCount: input.rewatchCount || 0,
    }) as any);
  }

  return {
    trace,
    signals,
  };
}
